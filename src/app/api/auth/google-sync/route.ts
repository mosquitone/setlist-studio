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

async function handleGoogleSync(req: NextRequest) {
  try {
    // NextAuthセッションを確認
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      // OAuth認証失敗をログに記録
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

      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ユーザーを取得または作成
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      // 改善されたユーザー名生成（日本語名対応 + 重複処理）
      const username = await generateSafeUsername(session.user.name, session.user.email);

      // 新規ユーザーの場合は作成
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          username,
          password: '', // Google認証なのでパスワードは空
          authProvider: AUTH_PROVIDERS.GOOGLE,
          emailVerified: true,
        },
      });

      // 新規OAuth ユーザー作成をログに記録
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
    } else {
      // 既存アカウント（メール認証またはGoogle認証）が存在する場合
      // 重複登録を防止し、適切なログインを促す
      return await handleExistingAccountDetection(
        req,
        session.user.email,
        user.authProvider as AuthProvider,
        user.authProvider === AUTH_PROVIDERS.GOOGLE ? user.id : undefined,
      );
    }

    // JWTトークンを生成（既存のシステムと同じ形式）
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' },
    );

    // 既存のauth APIを使ってCookieを設定
    const authResponse = await fetch(`${req.nextUrl.origin}/api/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (authResponse.ok) {
      // OAuth認証成功をログに記録
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
        },
      });

      // セッションストレージまたはクエリパラメータから元のページを取得
      // プロフィール画面からの認証かどうかを判定
      const cookieHeader = req.headers.get('cookie') || '';
      const profileContext = cookieHeader.includes('profile-auth-context=true');

      const redirectUrl = profileContext
        ? `${req.nextUrl.origin}/profile`
        : `${req.nextUrl.origin}/`;

      const redirectResponse = NextResponse.redirect(redirectUrl);

      // プロフィールコンテキストCookieをクリア
      if (profileContext) {
        redirectResponse.cookies.set('profile-auth-context', '', {
          path: '/',
          maxAge: 0, // 即座に削除
        });
      }

      // Cookieを転送
      const setCookieHeader = authResponse.headers.get('set-cookie');
      if (setCookieHeader) {
        redirectResponse.headers.set('set-cookie', setCookieHeader);
      }

      return redirectResponse;
    } else {
      // エラーログ（本番環境でも記録、ただし詳細は控える）
      console.error('Failed to set auth cookie');

      // Cookie設定失敗をログに記録
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
    }
  } catch (error) {
    console.error('Google OAuth sync error occurred');

    // システムエラーをログに記録
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
