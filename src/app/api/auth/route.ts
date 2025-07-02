import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

interface AuthCookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  path: string;
  maxAge: number;
}

// セキュアなAuth Cookie設定
function getAuthCookieOptions(): AuthCookieOptions {
  return {
    httpOnly: true, // XSS攻撃を防ぐ
    secure: process.env.NODE_ENV === 'production', // HTTPSでのみ送信
    sameSite: 'strict', // CSRF攻撃を防ぐ
    path: '/',
    maxAge: 24 * 60 * 60, // 24時間（秒単位）
  };
}

// JWTトークンの検証
function verifyToken(token: string): any {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}

// GET /api/auth - 現在の認証状態を確認
export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    // 無効なトークンの場合、クッキーをクリア
    const response = NextResponse.json({ authenticated: false }, { status: 401 });
    response.cookies.delete('auth_token');
    return response;
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: decoded.userId,
      email: decoded.email,
      username: decoded.username,
    },
  });
}

// POST /api/auth - JWT トークンをHttpOnly Cookieに設定
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // トークンの有効性を検証
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        username: decoded.username,
      },
    });

    // HttpOnly Cookieとしてトークンを設定
    const cookieOptions = getAuthCookieOptions();
    response.cookies.set('auth_token', token, cookieOptions);

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// DELETE /api/auth - ログアウト（クッキーをクリア）
export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('auth_token');
  return response;
}
