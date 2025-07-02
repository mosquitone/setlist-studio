import { NextRequest, NextResponse } from 'next/server';
import { randomBytes, timingSafeEqual, createHmac } from 'crypto';
import { SecurityEventType, SecurityEventSeverity } from './security-logger-db';
import { getSecureClientIP } from './security-utils';
import { PrismaClient } from '@prisma/client';

export interface CSRFTokens {
  token: string;
  cookieToken: string;
}

// CSRF秘密鍵の取得（環境変数から）
function getCSRFSecret(): string {
  const secret = process.env.CSRF_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('CSRF_SECRET or JWT_SECRET environment variable is required');
  }
  return secret;
}

// 暗号学的に安全なCSRFトークン生成
export function generateCSRFTokens(): CSRFTokens {
  const secret = getCSRFSecret();
  const timestamp = Date.now().toString();
  const randomValue = randomBytes(16).toString('hex');

  // ダブルサブミットクッキーパターン + HMAC署名
  const payload = `${timestamp}.${randomValue}`;
  const signature = createHmac('sha256', secret).update(payload).digest('hex');
  const token = `${payload}.${signature}`;

  return { token, cookieToken: token };
}

// タイミング攻撃耐性のあるトークン検証
export function verifyCSRFToken(request: NextRequest): boolean {
  const headerToken = request.headers.get('x-csrf-token');
  const cookieToken = request.cookies.get('csrf_token')?.value;

  if (!headerToken || !cookieToken) {
    return false;
  }

  try {
    // トークンの形式検証
    const headerParts = headerToken.split('.');
    const cookieParts = cookieToken.split('.');

    if (headerParts.length !== 3 || cookieParts.length !== 3) {
      return false;
    }

    // トークンの同一性をタイミング攻撃耐性で検証
    const headerBuffer = Buffer.from(headerToken, 'utf8');
    const cookieBuffer = Buffer.from(cookieToken, 'utf8');

    if (headerBuffer.length !== cookieBuffer.length) {
      return false;
    }

    // タイミング攻撃耐性のある比較
    const tokensMatch = timingSafeEqual(headerBuffer, cookieBuffer);

    if (!tokensMatch) {
      return false;
    }

    // HMAC署名の検証
    const secret = getCSRFSecret();
    const [timestamp, randomValue, signature] = headerParts;
    const payload = `${timestamp}.${randomValue}`;
    const expectedSignature = createHmac('sha256', secret).update(payload).digest('hex');

    const signatureBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');

    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }

    const signatureValid = timingSafeEqual(signatureBuffer, expectedBuffer);

    if (!signatureValid) {
      return false;
    }

    // トークンの有効期限チェック（1時間）
    const tokenTimestamp = parseInt(timestamp, 10);
    const currentTime = Date.now();
    const oneHour = 60 * 60 * 1000;

    if (currentTime - tokenTimestamp > oneHour) {
      return false;
    }

    return true;
  } catch {
    // エラーは常にfalseを返す（情報漏洩防止）
    return false;
  }
}

export function setCSRFCookie(response: NextResponse, token: string): void {
  response.cookies.set('csrf_token', token, {
    httpOnly: false, // CSRFトークンはクライアントサイドでアクセス可能である必要がある
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60, // 1時間（トークンの有効期限と一致）
  });
}

export async function csrfProtection(
  request: NextRequest,
  prisma?: PrismaClient,
): Promise<NextResponse | null> {
  // Skip CSRF protection for GET requests (GraphQL introspection, etc.)
  if (request.method === 'GET') {
    return null;
  }

  // Check for state-changing operations in GraphQL
  const requestClone = request.clone();
  const body = await requestClone.text();

  // より厳密なGraphQL判定: mutationが含まれる場合のみCSRF保護を適用
  const isMutation =
    /mutation\s*\{/.test(body.toLowerCase()) || /mutation\s*[\w\s]*\s*\(/.test(body.toLowerCase());

  // Skip CSRF for queries without mutations
  if (!isMutation) {
    return null;
  }

  // Verify CSRF token for mutations
  if (!verifyCSRFToken(request)) {
    // CSRF攻撃をログに記録
    const ip = getSecureClientIP(request);

    // データベースベースログ（Prismaが利用可能な場合）
    if (prisma) {
      const { logSecurityEventDB } = await import('./security-logger-db');
      await logSecurityEventDB(prisma, {
        type: SecurityEventType.CSRF_TOKEN_INVALID,
        severity: SecurityEventSeverity.HIGH,
        ipAddress: ip,
        userAgent: request.headers.get('user-agent') || undefined,
        resource: request.url,
        details: {
          csrfAttack: true,
          endpoint: request.url,
          method: request.method,
        },
      });
    } else {
      // フォールバック：コンソールログ
      console.error('🚨 CSRF Attack Detected:', {
        ip,
        endpoint: request.url,
        method: request.method,
        userAgent: request.headers.get('user-agent'),
      });
    }

    return NextResponse.json(
      {
        error: 'CSRF token validation failed',
        code: 'CSRF_TOKEN_INVALID',
      },
      { status: 403 },
    );
  }

  return null; // Allow request to proceed
}

// Utility function to generate CSRF token endpoint
export function createCSRFTokenResponse(): NextResponse {
  const { token } = generateCSRFTokens();
  const response = NextResponse.json({ csrfToken: token });

  setCSRFCookie(response, token);

  return response;
}
