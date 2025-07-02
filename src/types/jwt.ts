import jwt from 'jsonwebtoken';

export interface JWTPayload {
  userId: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

// ランタイム型ガード関数
export function isValidJWTPayload(payload: unknown): payload is JWTPayload {
  if (typeof payload !== 'object' || payload === null) {
    return false;
  }

  const obj = payload as Record<string, unknown>;

  return (
    typeof obj.userId === 'string' &&
    obj.userId.length > 0 &&
    typeof obj.email === 'string' &&
    obj.email.length > 0 &&
    typeof obj.username === 'string' &&
    obj.username.length > 0 &&
    typeof obj.iat === 'number' &&
    typeof obj.exp === 'number'
  );
}

// 安全なJWT検証関数
export function verifyAndValidateJWT(token: string, secret: string): JWTPayload {
  try {
    const payload = jwt.verify(token, secret);

    if (!isValidJWTPayload(payload)) {
      console.error('JWT payload validation failed:', payload);
      throw new Error('Invalid JWT payload structure');
    }

    return payload;
  } catch (error) {
    console.error('JWT verification error:', error);
    throw new Error('JWT verification failed');
  }
}
