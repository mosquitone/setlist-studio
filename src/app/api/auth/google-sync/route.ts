import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextauth';
import { prisma } from '@/lib/server/prisma';
import jwt from 'jsonwebtoken';

async function handleGoogleSync(req: NextRequest) {
  try {
    // NextAuthセッションを確認
    const session = await getServerSession(authOptions);

    console.log('Google sync - session:', session); // デバッグ用

    if (!session?.user?.email) {
      console.log('Google sync - no session or email'); // デバッグ用
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ユーザーを取得または作成
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      // 新規ユーザーの場合は作成
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          username: session.user.name || session.user.email.split('@')[0],
          password: '', // Google認証なのでパスワードは空
          emailVerified: true,
        },
      });
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
      // 認証成功、ホームページにリダイレクト
      const redirectResponse = NextResponse.redirect(`${req.nextUrl.origin}/`);

      // Cookieを転送
      const setCookieHeader = authResponse.headers.get('set-cookie');
      if (setCookieHeader) {
        redirectResponse.headers.set('set-cookie', setCookieHeader);
      }

      return redirectResponse;
    } else {
      console.error('Failed to set auth cookie');
      return NextResponse.redirect(`${req.nextUrl.origin}/login?error=auth_failed`);
    }
  } catch (error) {
    console.error('Google sync error:', error);
    return NextResponse.redirect(`${req.nextUrl.origin}/login?error=server_error`);
  }
}

export async function GET(req: NextRequest) {
  return handleGoogleSync(req);
}

export async function POST(req: NextRequest) {
  return handleGoogleSync(req);
}
