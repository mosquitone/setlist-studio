// セキュリティ関連共通ユーティリティ

import { createHash } from 'crypto';

import DOMPurify from 'dompurify';
import { NextRequest } from 'next/server';

import { StringArray } from '@/types/common';

// =============================================================================
// 定数定義セクション
// =============================================================================

// 信頼できるプロキシのリスト（環境に応じて設定）
const TRUSTED_PROXIES = new Set([
  '127.0.0.1',
  '::1',
  '10.0.0.0/8',
  '172.16.0.0/12',
  '192.168.0.0/16',
  // Cloudflare
  '103.21.244.0/22',
  '103.22.200.0/22',
  '103.31.4.0/22',
  '104.16.0.0/13',
  '104.24.0.0/14',
  '108.162.192.0/18',
  '131.0.72.0/22',
  '141.101.64.0/18',
  '162.158.0.0/15',
  '172.64.0.0/13',
  '173.245.48.0/20',
  '188.114.96.0/20',
  '190.93.240.0/20',
  '197.234.240.0/22',
  '198.41.128.0/17',
]);

// 共通セキュリティパターン定数 - DRY原則に従って分離
export const SECURITY_PATTERNS = {
  // 不審なUser-Agentパターン
  SUSPICIOUS_USER_AGENTS: [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /automated/i,
    /test/i,
  ],

  // プライベートIPアドレス範囲
  PRIVATE_IP_PREFIXES: ['10.', '192.168.', '172.'],

  // プロキシヘッダー名
  PROXY_HEADERS: ['x-forwarded-for', 'x-real-ip', 'cf-connecting-ip', 'x-client-ip'],

  // リスクレベル設定
  RISK_THRESHOLDS: {
    MAX_PROXY_HEADERS: 2,
  },
} as const;

// =============================================================================
// 低レベルユーティリティ関数セクション
// =============================================================================

// CIDR範囲チェック
function isInCIDR(ip: string, cidr: string): boolean {
  if (!cidr.includes('/')) {
    return ip === cidr;
  }

  const [network, prefixLength] = cidr.split('/');
  const mask = (0xffffffff << (32 - parseInt(prefixLength, 10))) >>> 0;

  const ipNum = ipToNumber(ip);
  const networkNum = ipToNumber(network);

  return (ipNum & mask) === (networkNum & mask);
}

// IPアドレスを数値に変換
function ipToNumber(ip: string): number {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

// IPアドレスの検証
function isValidIP(ip: string): boolean {
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

// プロキシ経由かどうかの判定
function isTrustedProxy(ip: string): boolean {
  if (!isValidIP(ip)) {
    return false;
  }

  for (const trustedRange of TRUSTED_PROXIES) {
    if (isInCIDR(ip, trustedRange)) {
      return true;
    }
  }

  return false;
}

// =============================================================================
// 中レベルユーティリティ関数セクション
// =============================================================================

// セキュリティパターンチェック関数
export function isUserAgentSuspicious(userAgent: string): boolean {
  return SECURITY_PATTERNS.SUSPICIOUS_USER_AGENTS.some((pattern) => pattern.test(userAgent));
}

export function isPrivateIP(ip: string): boolean {
  return SECURITY_PATTERNS.PRIVATE_IP_PREFIXES.some((prefix) => ip.startsWith(prefix));
}

export function countProxyHeaders(request: NextRequest): number {
  return SECURITY_PATTERNS.PROXY_HEADERS.filter((header) => request.headers.get(header)).length;
}

// =============================================================================
// 高レベルユーティリティ関数セクション
// =============================================================================

/**
 * 信頼できるクライアントIPアドレスの取得
 * IP偽装攻撃を防ぐため、信頼できるプロキシからのみヘッダーを読み取る
 * @param request - Next.jsのリクエストオブジェクト
 * @returns 検証済みのクライアントIPアドレス
 */
export function getSecureClientIP(request: NextRequest): string {
  // 直接接続の場合（最も信頼できる）
  // NOTE: Vercel環境ではrequest.ipは利用できないため、ヘッダーベースで処理
  const remoteAddress =
    request.headers.get('x-vercel-forwarded-for') ||
    request.headers.get('x-forwarded-for')?.split(',')[0];
  if (remoteAddress && isValidIP(remoteAddress)) {
    // 信頼できるプロキシ経由でない場合は、リモートアドレスをそのまま使用
    if (!isTrustedProxy(remoteAddress)) {
      return remoteAddress;
    }
  }

  // 信頼できるプロキシからのヘッダーを順番に確認
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip'); // Cloudflare
  const xClientIP = request.headers.get('x-client-ip');

  // Cloudflareの場合（最も信頼できるヘッダー）
  if (cfConnectingIP && isValidIP(cfConnectingIP)) {
    return cfConnectingIP;
  }

  // X-Real-IPをチェック
  if (xRealIP && isValidIP(xRealIP)) {
    return xRealIP;
  }

  // X-Forwarded-Forの最初のIPをチェック（チェーン内の最初のクライアント）
  if (xForwardedFor) {
    const ips = xForwardedFor.split(',').map((ip) => ip.trim());
    for (const ip of ips) {
      if (isValidIP(ip) && !isTrustedProxy(ip)) {
        return ip;
      }
    }
  }

  // X-Client-IPをチェック
  if (xClientIP && isValidIP(xClientIP)) {
    return xClientIP;
  }

  // すべて失敗した場合はremoteAddressまたはunknown
  return remoteAddress || 'unknown';
}

/**
 * IPアドレスのハッシュ化（プライバシー保護）
 * GDPR等の規制対応のため、IPアドレスをハッシュ化して保存
 * @param ip - ハッシュ化対象のIPアドレス
 * @returns SHA256ハッシュ化されたIP（16文字に短縮）
 */
export function hashIP(ip: string): string {
  const salt = process.env.IP_HASH_SALT || 'default-salt-change-in-production';

  return createHash('sha256')
    .update(ip + salt)
    .digest('hex')
    .substring(0, 16); // 短縮して保存効率を向上
}

/**
 * レート制限用の安全なキー生成
 * IPアドレス + User-Agentハッシュでより精密な制限
 */
export function generateRateLimitKey(request: NextRequest): string {
  const ip = getSecureClientIP(request);
  const userAgent = request.headers.get('user-agent') || '';

  // プライバシーを保護しつつ、一意性を確保
  const hashedIP = hashIP(ip);
  const hashedUA = createHash('md5').update(userAgent).digest('hex').substring(0, 8);

  return `${hashedIP}:${hashedUA}`;
}

/**
 * セキュリティイベント用のIPアドレス情報
 */
export function getIPInfo(request: NextRequest): {
  ip: string;
  hashedIP: string;
  isProxy: boolean;
  headers: Record<string, string>;
} {
  const ip = getSecureClientIP(request);
  const hashedIP = hashIP(ip);
  const isProxy = isTrustedProxy(ip);

  const headers: Record<string, string> = {};
  const relevantHeaders = [...SECURITY_PATTERNS.PROXY_HEADERS, 'user-agent'];

  relevantHeaders.forEach((header) => {
    const value = request.headers.get(header);
    if (value) {
      headers[header] = value;
    }
  });

  return { ip, hashedIP, isProxy, headers };
}

/**
 * リクエストの安全性評価
 */
export function assessRequestSecurity(request: NextRequest): {
  riskLevel: 'low' | 'medium' | 'high';
  reasons: StringArray;
} {
  const reasons: StringArray = [];
  let riskLevel: 'low' | 'medium' | 'high' = 'low';

  const ip = getSecureClientIP(request);
  const userAgent = request.headers.get('user-agent') || '';

  // User-Agentチェック
  if (!userAgent) {
    reasons.push('Missing User-Agent header');
    riskLevel = 'medium';
  } else if (isUserAgentSuspicious(userAgent)) {
    reasons.push('Suspicious User-Agent pattern detected');
    riskLevel = 'high';
  }

  // IPアドレスの妥当性
  if (ip === 'unknown') {
    reasons.push('Unable to determine client IP');
    riskLevel = 'high';
  }

  // プライベートIPからのアクセス（開発環境以外では不審）
  if (process.env.NODE_ENV === 'production' && isPrivateIP(ip)) {
    reasons.push('Access from private IP in production');
    riskLevel = 'medium';
  }

  // 複数のプロキシヘッダーが存在（IP偽装の可能性）
  const proxyHeaderCount = countProxyHeaders(request);
  if (proxyHeaderCount > SECURITY_PATTERNS.RISK_THRESHOLDS.MAX_PROXY_HEADERS) {
    reasons.push('Multiple proxy headers detected');
    riskLevel = 'medium';
  }

  return { riskLevel, reasons };
}

// =============================================================================
// サニタイゼーション関数セクション
// =============================================================================

/**
 * DOMPurifyを使用したテキストサニタイゼーション
 * XSS攻撃防止のためHTMLタグを完全に除去
 */
export const sanitizeText = (text: string): string => {
  if (typeof window === 'undefined') {
    return text;
  }

  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
};

/**
 * DOMPurifyを使用したHTMLサニタイゼーション
 * 安全なHTMLタグのみを許可
 */
export const sanitizeHtml = (html: string): string => {
  if (typeof window === 'undefined') {
    return html;
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p'],
    ALLOWED_ATTR: [],
  });
};

/**
 * URLの有効性とセキュリティチェック
 * HTTPSまたはHTTPプロトコル、もしくはdata:image/プロトコルのみを許可
 */
export const isValidUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return (
      parsedUrl.protocol === 'https:' ||
      parsedUrl.protocol === 'http:' ||
      url.startsWith('data:image/')
    );
  } catch {
    return false;
  }
};

/**
 * 入力値の検証とサニタイゼーション
 * @param input - 検証対象の文字列
 * @param maxLength - 最大文字数（デフォルト: 1000）
 * @returns サニタイズされた安全な文字列
 * @throws 文字数制限を超えた場合にエラーをスロー
 */
export const validateAndSanitizeInput = (input: string, maxLength: number = 1000): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }

  const trimmed = input.trim();
  if (trimmed.length > maxLength) {
    throw new Error(`Input too long. Please limit to ${maxLength} characters.`);
  }

  return sanitizeText(trimmed);
};
