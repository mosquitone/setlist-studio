import { NextResponse } from 'next/server';

export function middleware() {
  // Generate a random nonce for each request
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  const cspHeader = [
    "default-src 'self'",
    `script-src 'self' 'wasm-unsafe-eval' 'nonce-${nonce}' https://accounts.google.com`,
    "style-src 'self' 'unsafe-inline'", // Material-UIのため保持
    "img-src 'self' data: https: blob:", // 画像生成とQRコードのため
    "font-src 'self' data:",
    "connect-src 'self' https://accounts.google.com", // NextAuth Google認証用
    'frame-src https://accounts.google.com', // Google認証ポップアップのため
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

  const response = NextResponse.next();

  // CSPヘッダーを設定
  response.headers.set('Content-Security-Policy', cspHeader);

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

  // nonceをヘッダーに追加（Next.jsが自動的にScriptコンポーネントで使用）
  response.headers.set('X-Nonce', nonce);

  // キャッシュヘッダーの設定（静的アセット用）
  const pathname = new URL(response.url).pathname;
  if (pathname.match(/\.(js|css|webp|png|jpg|jpeg|svg|gif|ico|woff|woff2|ttf|otf)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (pathname.startsWith('/api/')) {
    // APIルートはキャッシュしない
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap.xml, robots.txt (SEO files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
