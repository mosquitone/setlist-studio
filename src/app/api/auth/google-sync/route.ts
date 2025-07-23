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
import { getSecureClientIP, hashIP } from '@/lib/security/security-utils';
import { generateSafeUsername } from '@/lib/server/auth/username-generator';
import { emailService } from '@/lib/server/email/emailService';
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

// メールアドレス変更処理
async function handleEmailChange(req: NextRequest, currentUserId: string, newEmail: string) {
  // 現在のユーザーを取得
  const currentUser = await prisma.user.findUnique({
    where: { id: currentUserId },
  });

  if (!currentUser) {
    throw new Error('Current user not found');
  }

  // 同じメールアドレスの場合はエラー
  if (currentUser.email === newEmail) {
    return {
      success: false,
      error: NextResponse.redirect(
        `${req.nextUrl.origin}/profile?error=same_email&message=${encodeURIComponent('現在のメールアドレスと同じです')}`,
      ),
    };
  }

  // 他のユーザーが使用中かチェック
  const existingUser = await prisma.user.findUnique({
    where: { email: newEmail },
  });

  if (existingUser && existingUser.id !== currentUserId) {
    return {
      success: false,
      error: NextResponse.redirect(
        `${req.nextUrl.origin}/profile?error=email_in_use&message=${encodeURIComponent('このメールアドレスは既に使用されています')}`,
      ),
    };
  }

  // メールアドレスを更新（認証方法もGoogleに戻す）
  const updatedUser = await prisma.user.update({
    where: { id: currentUserId },
    data: {
      email: newEmail,
      emailVerified: true, // Google認証により検証済み
      authProvider: AUTH_PROVIDERS.GOOGLE, // Google認証に戻す
    },
  });

  // メールアドレス変更履歴を記録
  const userAgent = req.headers.get('user-agent') || '';
  const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

  await prisma.emailHistory.create({
    data: {
      userId: currentUserId,
      oldEmail: currentUser.email,
      newEmail: newEmail,
      changeMethod: 'google_oauth',
      ipAddress: clientIP,
      userAgent,
      authProvider: updatedUser.authProvider,
      verificationSent: false,
    },
  });

  // 通知メール送信
  await emailService.sendEmailChangeNotificationEmail(
    currentUser.email,
    currentUser.username || 'ユーザー',
    newEmail,
  );
  await emailService.sendEmailChangeSuccessEmail(newEmail, currentUser.username || 'ユーザー');

  // セキュリティログ記録
  await logSecurityEventDB(prisma, {
    type: SecurityEventType.EMAIL_CHANGE_SUCCESS,
    severity: SecurityEventSeverity.LOW,
    userId: currentUserId,
    ipAddress: hashIP(clientIP),
    details: {
      oldEmail: currentUser.email,
      newEmail: newEmail,
      method: 'google_oauth_profile',
      authProvider: updatedUser.authProvider,
    },
  });

  return { success: true, user: updatedUser };
}

// 成功時のリダイレクト処理
function handleSuccessRedirect(
  req: NextRequest,
  authResponse: Response,
  isEmailChange: boolean = false,
) {
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = cookieHeader.split(';').map((c) => c.trim());
  const profileContext = cookies.some((cookie) => cookie === 'profile-auth-context=true');

  let redirectUrl = profileContext ? `${req.nextUrl.origin}/profile` : `${req.nextUrl.origin}/`;

  // メールアドレス変更の場合は成功メッセージを追加
  if (isEmailChange) {
    redirectUrl = `${req.nextUrl.origin}/profile?success=email_changed&message=${encodeURIComponent('Google認証によりメールアドレスが正常に変更されました')}`;
  }

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

    // プロフィールからのメールアドレス変更コンテキストをチェック
    const cookieHeader = req.headers.get('cookie') || '';
    const cookies = cookieHeader.split(';').map((c) => c.trim());
    const profileContext = cookies.some((cookie) => cookie === 'profile-auth-context=true');

    // current-user-id Cookieから現在のユーザーIDを取得
    const currentUserIdCookie = cookies.find((cookie) => cookie.startsWith('current-user-id='));
    const currentUserId = currentUserIdCookie?.split('=')[1];

    let user;
    let isNew = false;
    let isEmailChange = false;

    // メールアドレス変更コンテキストの場合
    if (profileContext && currentUserId) {
      const emailChangeResult = await handleEmailChange(req, currentUserId, email);
      if (!emailChangeResult.success) {
        return emailChangeResult.error;
      }
      user = emailChangeResult.user;
      isEmailChange = true;
    }

    // 通常のユーザー検索・作成の場合（メールアドレス変更以外）
    if (!profileContext || !currentUserId) {
      const userResult = await findOrCreateGoogleUser(req, email, name);
      if (userResult.error) {
        return userResult.error;
      }

      user = userResult.user;
      isNew = userResult.isNew;
      if (!user) {
        throw new Error('User creation failed');
      }
    }

    // 3. トークン生成
    if (!user) {
      throw new Error('User not found after operation');
    }
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
          loginType: isEmailChange ? 'email_change' : isNew ? 'new_user' : 'returning_user',
        },
      });

      // 6. リダイレクト処理
      // current-user-id Cookieをクリア（メール変更の場合）
      const response = handleSuccessRedirect(req, authResponse, isEmailChange);
      if (isEmailChange) {
        response.cookies.set('current-user-id', '', {
          path: '/',
          maxAge: 0,
        });
      }
      return response;
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
