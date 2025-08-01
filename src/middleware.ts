import { NextRequest, NextResponse } from 'next/server';

// 型定義
interface VercelDomains {
  scripts: string;
  assets: string;
  fonts: string;
  websockets: string;
  currentUrl: string;
}

interface CSPConfig {
  isDev: boolean;
  isProd: boolean;
  isVercelPreview: boolean;
  isStaticPage: boolean;
  nonce: string;
  vercelDomains: VercelDomains | null;
}

// 定数
const GOOGLE_AUTH_DOMAINS =
  'https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com';

const STATIC_PAGE_PATHS = [
  '/login',
  '/register',
  '/guide',
  '/privacy-policy',
  '/terms-of-service',
  '/auth/',
];

// Vercelドメイン設定を取得
function getVercelDomains(isVercelPreview: boolean, vercelUrl: string): VercelDomains | null {
  if (!isVercelPreview) return null;

  return {
    scripts: 'https://vercel.live https://vercel.com https://*.setlist-studio.com',
    assets: 'https://assets.vercel.com',
    fonts: 'https://vercel.live/fonts',
    websockets: 'wss://ws-us3.pusher.com https://sockjs-us3.pusher.com',
    currentUrl: vercelUrl, // 空文字列の場合はそのまま保持
  };
}

// Script-srcディレクティブを構築
function buildScriptSrc(config: CSPConfig): string {
  const { isDev, isVercelPreview, isStaticPage, nonce, vercelDomains } = config;
  const baseSrc = "'self'";

  // 静的ページ: 認証ページなのでunsafe-inlineが必要
  if (isStaticPage) {
    const evalDirective = isDev ? " 'unsafe-eval'" : '';
    const vercelScripts = isVercelPreview && vercelDomains ? ` ${vercelDomains.scripts}` : '';
    return `${baseSrc} 'unsafe-inline'${evalDirective}${vercelScripts} ${GOOGLE_AUTH_DOMAINS}`;
  }

  // プレビュー環境の動的ページ: Vercelツールバー対応
  if (isVercelPreview && vercelDomains) {
    const evalDirective = isDev ? " 'unsafe-eval'" : '';
    const vercelScripts = vercelDomains.scripts;
    const vercelUrl = vercelDomains.currentUrl ? ` ${vercelDomains.currentUrl}` : '';

    // プレビュー環境では開発の利便性のため 'strict-dynamic' を追加
    return `${baseSrc} 'nonce-${nonce}'${evalDirective} 'strict-dynamic' ${vercelScripts}${vercelUrl} ${GOOGLE_AUTH_DOMAINS}`;
  }

  // 本番/開発環境の動的ページ: 最高セキュリティ
  const evalDirective = isDev ? " 'unsafe-eval'" : " 'wasm-unsafe-eval'";
  return `${baseSrc} 'nonce-${nonce}'${evalDirective} 'strict-dynamic' ${GOOGLE_AUTH_DOMAINS}`;
}

// Vercel関連のCSPソースを追加
function appendVercelSources(
  base: string,
  vercelDomains: VercelDomains | null,
  ...domainKeys: (keyof VercelDomains)[]
): string {
  if (!vercelDomains) return base;

  const additionalSources = domainKeys
    .map((key) => vercelDomains[key])
    .filter(Boolean)
    .join(' ');

  return additionalSources ? `${base} ${additionalSources}` : base;
}

// CSPディレクティブを構築
function buildCSPDirectives(config: CSPConfig): Record<string, string> {
  const { isProd, vercelDomains } = config;

  return {
    'default-src': "'self'",
    'script-src': buildScriptSrc(config),
    'style-src': appendVercelSources("'self' 'unsafe-inline'", vercelDomains, 'fonts'),
    'img-src': appendVercelSources(
      "'self' data: https: blob:",
      vercelDomains,
      'scripts',
      'currentUrl',
    ),
    'font-src': appendVercelSources("'self' data:", vercelDomains, 'scripts', 'assets'),
    'connect-src':
      `'self' ${GOOGLE_AUTH_DOMAINS}` +
      (vercelDomains
        ? ` ${appendVercelSources('', vercelDomains, 'scripts', 'currentUrl', 'websockets')}`
        : ''),
    'frame-src':
      `'self' ${GOOGLE_AUTH_DOMAINS}` +
      (vercelDomains ? ` ${appendVercelSources('', vercelDomains, 'scripts', 'currentUrl')}` : ''),
    'object-src': "'none'",
    'base-uri': "'self'",
    'form-action': "'self'",
    'frame-ancestors': "'none'",
    // Production環境でのみHTTPS強制を適用
    ...(isProd && {
      'block-all-mixed-content': '',
      'upgrade-insecure-requests': '',
    }),
  };
}

// セキュリティヘッダーを構築
function buildSecurityHeaders(
  isStaticPage: boolean,
  nonce: string,
  isProd: boolean,
): Record<string, string> {
  return {
    'X-Middleware-Applied': 'true',
    'X-CSP-Nonce': isStaticPage ? 'static-page' : nonce,
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-XSS-Protection': '1; mode=block',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    // プレビューデプロイメントのnoindex設定
    ...(!isProd && { 'X-Robots-Tag': 'noindex, nofollow' }),
  };
}

export function middleware(request: NextRequest) {
  // リクエストごとにランダムなnonceを生成
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // 環境設定
  const isDev = process.env.NODE_ENV === 'development';
  const isProd = process.env.NODE_ENV === 'production';
  const isVercelPreview = process.env.VERCEL_ENV === 'preview';
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';

  // 現在のパスが静的ページかどうかを判定
  const pathname = request.nextUrl.pathname;
  const isStaticPage = STATIC_PAGE_PATHS.some((path) => pathname.startsWith(path));

  // Vercel関連ドメインを取得
  const vercelDomains = getVercelDomains(isVercelPreview, vercelUrl);

  // CSP設定を構築
  const config: CSPConfig = {
    isDev,
    isProd,
    isVercelPreview,
    isStaticPage,
    nonce,
    vercelDomains,
  };

  // CSPディレクティブを構築
  const cspDirectives = buildCSPDirectives(config);

  // CSPヘッダー文字列の生成（空白の正規化）
  const cspHeader = Object.entries(cspDirectives)
    .map(([key, value]) => (value ? `${key} ${value}` : key))
    .join('; ')
    .replace(/\s+/g, ' '); // 連続する空白を1つに

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

  // その他のセキュリティヘッダーを設定
  const securityHeaders = buildSecurityHeaders(isStaticPage, nonce, isProd);
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

// Middleware configuration
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
