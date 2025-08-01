import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // リクエストごとにランダムなnonceを生成
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // 開発環境かどうかをチェック
  const isDev = process.env.NODE_ENV === 'development';

  // 現在のパスが静的ページかどうかを判定
  const pathname = request.nextUrl.pathname;
  const isStaticPage = [
    '/login',
    '/register',
    '/guide',
    '/privacy-policy',
    '/terms-of-service',
    '/auth/',
  ].some((path) => pathname.startsWith(path));

  // Vercelプレビュー環境の検出
  const isVercelPreview = process.env.VERCEL_ENV === 'preview';

  // ページタイプに基づいてCSPヘッダーを構築
  const scriptSrc = isStaticPage
    ? `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ''} https://accounts.google.com ${isVercelPreview ? 'https://vercel.live' : ''}`
    : `script-src 'self' 'nonce-${nonce}' ${isDev ? "'unsafe-eval'" : "'wasm-unsafe-eval'"} 'strict-dynamic' https://accounts.google.com ${isVercelPreview ? 'https://vercel.live' : ''}`;

  const cspHeader = [
    "default-src 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'", // Material-UIのため保持
    "img-src 'self' data: https: blob:", // 画像生成とQRコードのため
    "font-src 'self' data:",
    `connect-src 'self' https://accounts.google.com ${isVercelPreview ? 'https://vercel.live wss://ws-us3.pusher.com https://sockjs-us3.pusher.com' : ''}`, // NextAuth Google認証用 + Vercelライブフィードバック
    `frame-src https://accounts.google.com ${isVercelPreview ? 'https://vercel.live' : ''}`, // Google認証ポップアップのため + Vercelプレビュー
    "object-src 'none'", // プラグイン無効化
    "base-uri 'self'", // base要素制限
    "form-action 'self'", // フォーム送信先制限
    "frame-ancestors 'none'", // クリックジャッキング対策
    // Production環境でのみHTTPS強制を適用
    ...(process.env.NODE_ENV === 'production'
      ? [
          'block-all-mixed-content', // HTTPS強制
          'upgrade-insecure-requests', // HTTP→HTTPS自動アップグレード
        ]
      : []),
  ].join('; ');

  // 動的ページの場合はヘッダーでnonceを渡す
  const requestHeaders = new Headers(request.headers);
  if (!isStaticPage) {
    requestHeaders.set('x-nonce', nonce);
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // CSPヘッダーを設定
  response.headers.set('Content-Security-Policy', cspHeader);

  // デバッグ用ヘッダー
  response.headers.set('X-Middleware-Applied', 'true');
  response.headers.set('X-CSP-Nonce', isStaticPage ? 'static-page' : nonce);

  // その他のセキュリティヘッダー
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  );

  // プレビューデプロイメントのnoindex設定
  if (process.env.VERCEL_ENV !== 'production') {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
}

// Middleware configuration
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
