# Google OAuth連携ログイン実装ガイド

このガイドは、Setlist StudioでのGoogle OAuth実装の実際のコードとアーキテクチャを説明します。

## 実装アーキテクチャ

### 統合方式
- **NextAuth**: Google OAuth認証の処理（セッション管理は最小限）
- **既存システム**: JWT + HttpOnly Cookie認証システムを維持
- **統合**: Google認証後、自動リダイレクトで既存JWTシステムに統合

## 実装手順

### 1. パッケージインストール

```bash
pnpm add next-auth
```

**注意**: `@auth/prisma-adapter`は不要です（JWT戦略使用のため）

### 2. NextAuth設定

`src/lib/auth/nextauth.ts`:

```typescript
import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account }) {
      // Google認証でメールアドレスが存在する場合のみ許可
      return account?.provider === 'google' && !!user.email;
    },
    async redirect({ baseUrl }) {
      // 認証成功後、google-syncエンドポイントに自動リダイレクト
      return `${baseUrl}/api/auth/google-sync`;
    },
  },
};
```

### 3. API Route

`src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth/nextauth';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

### 4. Google→既存システム統合API

`src/app/api/auth/google-sync/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextauth';
import { prisma } from '@/lib/server/prisma';
import jwt from 'jsonwebtoken';
import { generateSafeUsername } from '@/lib/server/auth/username-generator';
import { logSecurityEventDB, SecurityEventType, SecurityEventSeverity } from '@/lib/security/security-logger-db';
import { getSecureClientIP } from '@/lib/security/security-utils';

async function handleGoogleSync(req: NextRequest) {
  try {
    // NextAuthセッションを確認
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      await logSecurityEventDB(prisma, {
        type: SecurityEventType.OAUTH_LOGIN_FAILURE,
        severity: SecurityEventSeverity.MEDIUM,
        ipAddress: getSecureClientIP(req),
        userAgent: req.headers.get('user-agent') || undefined,
        resource: req.url,
        details: { provider: 'google', reason: 'no_session_or_email' },
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ユーザーを取得または作成
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      // 日本語名対応のユーザー名生成
      const username = await generateSafeUsername(session.user.name, session.user.email);

      user = await prisma.user.create({
        data: {
          email: session.user.email,
          username,
          password: '', // Google認証なのでパスワードは空
          authProvider: 'google', // 認証プロバイダーを記録
          emailVerified: true,
        },
      });

      // 新規ユーザー作成をログに記録
      await logSecurityEventDB(prisma, {
        type: SecurityEventType.OAUTH_USER_CREATED,
        severity: SecurityEventSeverity.LOW,
        ipAddress: getSecureClientIP(req),
        userAgent: req.headers.get('user-agent') || undefined,
        resource: req.url,
        userId: user.id,
        details: { provider: 'google', email: user.email, username: user.username },
      });
    }

    // JWTトークンを生成
    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );

    // 既存のauth APIを使ってCookieを設定
    const authResponse = await fetch(`${req.nextUrl.origin}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (authResponse.ok) {
      // 認証成功ログ
      await logSecurityEventDB(prisma, {
        type: SecurityEventType.OAUTH_LOGIN_SUCCESS,
        severity: SecurityEventSeverity.LOW,
        ipAddress: getSecureClientIP(req),
        userAgent: req.headers.get('user-agent') || undefined,
        resource: req.url,
        userId: user.id,
        details: { provider: 'google', email: user.email },
      });

      // ホームページにリダイレクト（Cookieを転送）
      const redirectResponse = NextResponse.redirect(`${req.nextUrl.origin}/`);
      const setCookieHeader = authResponse.headers.get('set-cookie');
      if (setCookieHeader) {
        redirectResponse.headers.set('set-cookie', setCookieHeader);
      }
      return redirectResponse;
    } else {
      // エラー処理
      console.error('Failed to set auth cookie');
      return NextResponse.redirect(`${req.nextUrl.origin}/login?error=auth_failed`);
    }
  } catch (error) {
    console.error('Google OAuth sync error occurred');
    return NextResponse.redirect(`${req.nextUrl.origin}/login?error=server_error`);
  }
}

export async function GET(req: NextRequest) {
  return handleGoogleSync(req);
}

export async function POST(req: NextRequest) {
  return handleGoogleSync(req);
}
```

### 5. GoogleAuthButtonコンポーネント

`src/components/auth/GoogleAuthButton.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/common/ui/Button';
import GoogleColorIcon from '@/components/common/icons/GoogleColorIcon';
import { signIn } from 'next-auth/react';
import { useI18n } from '@/hooks/useI18n';

interface GoogleAuthButtonProps {
  onError?: (error: string) => void;
  disabled?: boolean;
  variant?: 'contained' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  sx?: object;
  mode?: 'signin' | 'signup';
}

export default function GoogleAuthButton({
  onError,
  disabled = false,
  variant = 'outlined',
  size = 'large',
  fullWidth = true,
  sx,
  mode = 'signin',
}: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false);
  const { messages } = useI18n();

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      // NextAuthでGoogle認証（自動的にgoogle-syncにリダイレクト）
      await signIn('google');
    } catch (error) {
      console.error('Google auth error:', error);
      const errorMessage = messages.auth.googleAuthError || 'Google認証でエラーが発生しました';
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      fullWidth={fullWidth}
      variant={variant}
      size={size}
      startIcon={<GoogleColorIcon />}
      onClick={handleGoogleAuth}
      disabled={disabled || loading}
      sx={sx}
    >
      {loading
        ? mode === 'signup'
          ? messages.auth.signingUp || 'アカウント作成中...'
          : messages.auth.signingIn || 'サインイン中...'
        : mode === 'signup'
          ? messages.auth.signUpWithGoogle || 'Googleでアカウント作成'
          : messages.auth.signInWithGoogle || 'Googleでログイン'}
    </Button>
  );
}
```

### 6. ログイン/登録ページ統合

`src/app/login/LoginClient.tsx`と`src/app/register/RegisterClient.tsx`:

```typescript
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';

export default function LoginClient() {
  // ... 既存のコード

  return (
    <div>
      {/* 通常のメール認証フォーム */}
      
      {/* Google認証ボタン */}
      <GoogleAuthButton onError={setError} sx={{ mb: 2 }} />
      
      {/* または区切り線 */}
    </div>
  );
}
```

### 7. NextAuthProvider統合

`src/components/providers/NextAuthProvider.tsx`:

```typescript
'use client';

import { SessionProvider } from 'next-auth/react';

export default function NextAuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

`src/app/layout.tsx`:

```typescript
import NextAuthProvider from '@/components/providers/NextAuthProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NextAuthProvider>
          {/* 既存のProviders: MUIProvider, ApolloProvider, AuthProvider など */}
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
```

## 動作フロー

1. **「Googleでログイン」クリック** → `signIn('google')` (GoogleAuthButton)
2. **Google認証完了** → NextAuthセッション作成
3. **自動リダイレクト** → `/api/auth/google-sync` (redirect callback)
4. **セッション確認** → NextAuth getServerSession()
5. **ユーザー作成/取得** → Prisma + authProvider記録
6. **JWTトークン生成** → 既存認証システムと統合
7. **HttpOnly Cookie設定** → `/api/auth` 経由
8. **ホーム画面へリダイレクト** → Cookie転送で認証完了

## 簡素化された理由

### 元のガイドから削除したもの
- **PrismaAdapter**: JWT戦略では不要
- **OAuthAccountモデル**: 既存システム統合なら不要
- **複雑なCallback処理**: シンプルな統合で十分

### 実装の利点
- **既存システム維持**: GraphQL APIなど既存コードは無変更
- **最小限の変更**: NextAuthは認証のみ、あとは既存フロー
- **メンテナンス性**: シンプルな統合で理解しやすい

## 環境変数

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# NextAuth（既存のJWT_SECRETと同じ値を使用）
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-jwt-secret-same-as-jwt_secret

# 既存の設定はそのまま
JWT_SECRET=your-jwt-secret
```

この実装により、最小限の変更で既存の認証システムとGoogle OAuthが統合できます。