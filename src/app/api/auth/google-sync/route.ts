import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth/nextauth';
import { csrfProtection } from '@/lib/security/csrf-protection';
import { createAuthRateLimit } from '@/lib/security/rate-limit-db';
import {
  logSecurityEventDB,
  SecurityEventType,
  SecurityEventSeverity,
} from '@/lib/security/security-logger-db';
import { getSecureClientIP } from '@/lib/security/security-utils';
import { generateSafeUsername } from '@/lib/server/auth/username-generator';
import { prisma } from '@/lib/server/prisma';
import { AuthProvider, AUTH_PROVIDERS } from '@/types/common';

// 既存アカウント検出時の共通処理
async function handleExistingAccountDetection(
  req: NextRequest,
  email: string,
  authProvider: AuthProvider,
  existingUserId?: string,
) {
  // 認証プロバイダーの妥当性チェック
  if (authProvider !== AUTH_PROVIDERS.EMAIL && authProvider !== AUTH_PROVIDERS.GOOGLE) {
    throw new Error(`Unknown auth provider in conflict detection: ${authProvider}`);
  }

  const isEmailProvider = authProvider === AUTH_PROVIDERS.EMAIL;

  await logSecurityEventDB(prisma, {
    type: SecurityEventType.OAUTH_LOGIN_FAILURE,
    severity: isEmailProvider ? SecurityEventSeverity.MEDIUM : SecurityEventSeverity.HIGH,
    ipAddress: getSecureClientIP(req),
    userAgent: req.headers.get('user-agent') || undefined,
    resource: req.url,
    details: {
      provider: 'google',
      reason: isEmailProvider ? 'email_account_exists' : 'google_account_switch_attempt',
      email,
      ...(existingUserId && { existingUserId }),
    },
  });

  const errorType = isEmailProvider ? 'email_account_exists' : 'google_account_exists';
  return NextResponse.redirect(
    `${req.nextUrl.origin}/login?error=${errorType}&email=${encodeURIComponent(email)}`,
  );
}

// セッション検証とセキュリティログ
async function validateGoogleSession(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    await logSecurityEventDB(prisma, {
      type: SecurityEventType.OAUTH_LOGIN_FAILURE,
      severity: SecurityEventSeverity.MEDIUM,
      ipAddress: getSecureClientIP(req),
      userAgent: req.headers.get('user-agent') || undefined,
      resource: req.url,
      details: {
        provider: 'google',
        reason: 'no_session_or_email',
        endpoint: req.url,
      },
    });

    return { session: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  return { session, error: null };
}

// 新規Googleユーザー作成
async function createNewGoogleUser(req: NextRequest, email: string, name?: string | null) {
  const username = await generateSafeUsername(name, email);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: '', // Google認証なのでパスワードは空
      authProvider: AUTH_PROVIDERS.GOOGLE,
      emailVerified: true,
    },
  });

  // 新規ユーザー作成ログ
  await logSecurityEventDB(prisma, {
    type: SecurityEventType.OAUTH_USER_CREATED,
    severity: SecurityEventSeverity.LOW,
    ipAddress: getSecureClientIP(req),
    userAgent: req.headers.get('user-agent') || undefined,
    resource: req.url,
    userId: user.id,
    details: {
      provider: 'google',
      email: user.email,
      username: user.username,
    },
  });

  return user;
}

// 既存ユーザーの認証プロバイダー検証
async function validateExistingUser(
  req: NextRequest,
  user: { id: string; email: string; authProvider: string },
) {
  if (user.authProvider === AUTH_PROVIDERS.GOOGLE) {
    // 同じGoogleアカウントでの再ログインは許可
    return { isValid: true, error: null };
  }

  if (user.authProvider === AUTH_PROVIDERS.EMAIL) {
    // メール認証ユーザーがGoogle認証を試行した場合は重複エラー
    const error = await handleExistingAccountDetection(
      req,
      user.email,
      user.authProvider as AuthProvider,
      undefined,
    );
    return { isValid: false, error };
  }

  // 未知の認証プロバイダーの場合はシステムエラー
  throw new Error(`Unknown auth provider: ${user.authProvider}`);
}

// ユーザー検索・作成のメイン処理
async function findOrCreateGoogleUser(req: NextRequest, email: string, name?: string | null) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // 新規ユーザー作成
    const newUser = await createNewGoogleUser(req, email, name);
    return { user: newUser, isNew: true };
  }

  // 既存ユーザーの検証
  const validation = await validateExistingUser(req, user);
  if (!validation.isValid) {
    return { user: null, isNew: false, error: validation.error };
  }

  return { user, isNew: false };
}

// JWTトークン生成
function generateAuthToken(user: { id: string; email: string; username: string }) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET!,
    { expiresIn: '30d' },
  );
}

// Cookie設定処理
async function setAuthCookie(req: NextRequest, token: string) {
  const authResponse = await fetch(`${req.nextUrl.origin}/api/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });

  return authResponse;
}

// 成功時のリダイレクト処理
function handleSuccessRedirect(req: NextRequest, authResponse: Response) {
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = cookieHeader.split(';').map((c) => c.trim());
  const profileContext = cookies.some((cookie) => cookie === 'profile-auth-context=true');

  const redirectUrl = profileContext ? `${req.nextUrl.origin}/profile` : `${req.nextUrl.origin}/`;

  const redirectResponse = NextResponse.redirect(redirectUrl);

  // プロフィールコンテキストCookieをクリア
  if (profileContext) {
    redirectResponse.cookies.set('profile-auth-context', '', {
      path: '/',
      maxAge: 0,
    });
  }

  // Cookieを転送
  const setCookieHeader = authResponse.headers.get('set-cookie');
  if (setCookieHeader) {
    redirectResponse.headers.set('set-cookie', setCookieHeader);
  }

  return redirectResponse;
}

// メイン処理関数（リファクタリング後）
async function handleGoogleSync(req: NextRequest) {
  try {
    // 1. セッション検証
    const sessionValidation = await validateGoogleSession(req);
    if (!sessionValidation.session) {
      return sessionValidation.error;
    }

    const { session } = sessionValidation;
    const { email, name } = session.user!;

    // Googleセッションでemailが提供されているかチェック
    if (!email) {
      throw new Error('Email not provided by Google OAuth');
    }

    // 2. ユーザー検索・作成
    const userResult = await findOrCreateGoogleUser(req, email, name);
    if (userResult.error) {
      return userResult.error;
    }

    const { user, isNew } = userResult;
    if (!user) {
      throw new Error('User creation failed');
    }

    // 3. トークン生成
    const token = generateAuthToken(user);

    // 4. Cookie設定
    const authResponse = await setAuthCookie(req, token);

    if (authResponse.ok) {
      // 5. 成功ログ記録
      await logSecurityEventDB(prisma, {
        type: SecurityEventType.OAUTH_LOGIN_SUCCESS,
        severity: SecurityEventSeverity.LOW,
        ipAddress: getSecureClientIP(req),
        userAgent: req.headers.get('user-agent') || undefined,
        resource: req.url,
        userId: user.id,
        details: {
          provider: 'google',
          email: user.email,
          loginType: isNew ? 'new_user' : 'returning_user',
        },
      });

      // 6. リダイレクト処理
      return handleSuccessRedirect(req, authResponse);
    }

    // Cookie設定失敗
    console.error('Failed to set auth cookie');

    await logSecurityEventDB(prisma, {
      type: SecurityEventType.OAUTH_LOGIN_FAILURE,
      severity: SecurityEventSeverity.MEDIUM,
      ipAddress: getSecureClientIP(req),
      userAgent: req.headers.get('user-agent') || undefined,
      resource: req.url,
      userId: user.id,
      details: {
        provider: 'google',
        reason: 'cookie_setting_failed',
        email: user.email,
      },
    });

    return NextResponse.redirect(`${req.nextUrl.origin}/login?error=auth_failed`);
  } catch (error) {
    console.error('Google OAuth sync error occurred');

    // システムエラーログ
    try {
      await logSecurityEventDB(prisma, {
        type: SecurityEventType.OAUTH_LOGIN_FAILURE,
        severity: SecurityEventSeverity.HIGH,
        ipAddress: getSecureClientIP(req),
        userAgent: req.headers.get('user-agent') || undefined,
        resource: req.url,
        details: {
          provider: 'google',
          reason: 'system_error',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    } catch (logError) {
      console.error('Failed to log OAuth error:', logError);
    }

    return NextResponse.redirect(`${req.nextUrl.origin}/login?error=server_error`);
  }
}

export async function GET(req: NextRequest) {
  // OAuth callback用のGETリクエスト - NextAuthがstate parameterで保護済み

  // レート制限チェック
  const rateLimit = createAuthRateLimit(prisma);
  const rateLimitResponse = await rateLimit(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  return handleGoogleSync(req);
}

export async function POST(req: NextRequest) {
  // レート制限チェック
  const rateLimit = createAuthRateLimit(prisma);
  const rateLimitResponse = await rateLimit(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  // POST requests need CSRF protection
  const csrfError = await csrfProtection(req, prisma);
  if (csrfError) {
    return csrfError;
  }

  return handleGoogleSync(req);
}
