# Google OAuth連携ログイン実装ガイド（実装版）

このガイドは、Setlist StudioでのGoogle OAuth実装の実際のコードとアーキテクチャを説明します。

## 実装アーキテクチャ

### 統合方式
- **NextAuth**: Google OAuth認証のみ
- **既存システム**: JWT認証システムを維持
- **統合**: Google認証後、既存JWTトークンを生成してログイン

## 実装手順

### 1. パッケージインストール

```bash
pnpm add next-auth
```

**注意**: `@auth/prisma-adapter`は不要です（JWT戦略使用のため）

### 2. NextAuth設定（簡素化版）

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
  session: {
    strategy: 'jwt', // 既存のJWT認証と統合
  },
  jwt: {
    secret: process.env.JWT_SECRET, // 既存のJWT_SECRETを使用
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log('NextAuth signIn:', { email: user.email, provider: account?.provider });
      return true;
    },
    async jwt({ token, user }) {
      // 初回ログイン時にユーザー情報を保存
      if (user) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      // セッションにユーザー情報を追加
      if (session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
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
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextauth';
import { prisma } from '@/lib/server/prisma';
import jwt from 'jsonwebtoken';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ユーザーを取得または作成
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          username: session.user.name || session.user.email.split('@')[0],
          password: '', // Google認証なのでパスワードは空
          emailVerified: true,
        },
      });
    }

    // 既存システム用JWTトークン生成
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Google sync error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### 5. Google認証後の自動ログインフック

`src/hooks/useGoogleAuth.ts`:

```typescript
'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';

export function useGoogleAuth() {
  const { data: session, status } = useSession();
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleGoogleAuth = async () => {
      if (session?.user && status === 'authenticated') {
        try {
          const response = await fetch('/api/auth/google-sync', {
            method: 'POST',
            credentials: 'include',
          });

          if (response.ok) {
            const { token } = await response.json();
            await login(token); // 既存システムにログイン
            router.push('/');
          }
        } catch (error) {
          console.error('Google sync error:', error);
        }
      }
    };

    if (status !== 'loading') {
      handleGoogleAuth();
    }
  }, [session, status, login, router]);

  return { session, status };
}
```

### 6. ログインページ統合

`src/app/login/LoginClient.tsx`に追加:

```typescript
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { signIn } from 'next-auth/react';

export default function LoginClient() {
  useGoogleAuth(); // Google認証後の自動ログイン処理
  
  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    // 既存のフォーム...
    <Button
      fullWidth
      variant="outlined"
      startIcon={<GoogleIcon />}
      onClick={handleGoogleLogin}
    >
      Googleでログイン
    </Button>
  );
}
```

### 7. SessionProvider追加

`src/app/layout.tsx`:

```typescript
import NextAuthProvider from '@/components/providers/NextAuthProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NextAuthProvider>
          {/* 既存のProviders */}
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
```

## 動作フロー

1. **「Googleでログイン」クリック** → `signIn('google')`
2. **Google認証完了** → NextAuthセッション作成
3. **`useGoogleAuth`が検知** → `/api/auth/google-sync`呼び出し
4. **既存JWTトークン生成** → 既存AuthProviderにログイン
5. **ホーム画面へリダイレクト**

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