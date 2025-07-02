// ログインジェクション攻撃対策

/**
 * ログインジェクション攻撃を防ぐためのサニタイゼーション関数
 * 改行文字、制御文字、およびログ解析を妨害する可能性のある文字を除去
 */
export function sanitizeForLog(input: string | undefined | null): string {
  if (!input) return '';

  return (
    input
      // 改行文字を除去（ログインジェクション攻撃の主要ベクター）
      .replace(/[\r\n\t]/g, ' ')
      // 制御文字を除去
      .replace(/[\x00-\x1f\x7f-\x9f]/g, '')
      // ログ解析を妨害する可能性のある文字を制限
      .replace(/[|&;`$(){}[\]\\<>]/g, '_')
      // 過度に長い文字列を切り詰め（DoS攻撃防止）
      .substring(0, 500)
      // 前後の空白を除去
      .trim()
  );
}

/**
 * メールアドレス専用のサニタイゼーション
 * より厳格な検証とフォーマット化
 */
export function sanitizeEmailForLog(email: string | undefined | null): string {
  if (!email) return '';

  const sanitized = sanitizeForLog(email);

  // メールアドレスの基本的な形式チェック
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return '[INVALID_EMAIL_FORMAT]';
  }

  // 最大長制限（通常のメールアドレスは254文字以下）
  if (sanitized.length > 254) {
    return '[EMAIL_TOO_LONG]';
  }

  return sanitized;
}

/**
 * User-Agent専用のサニタイゼーション
 * ブラウザ識別情報を保持しつつセキュリティを確保
 */
export function sanitizeUserAgentForLog(userAgent: string | undefined | null): string {
  if (!userAgent) return '[NO_USER_AGENT]';

  const sanitized = sanitizeForLog(userAgent);

  // User-Agentが疑わしい場合は詳細をマスク
  const suspiciousPatterns = [
    /script/i,
    /javascript/i,
    /vbscript/i,
    /onload/i,
    /onerror/i,
    /<[^>]*>/g, // HTMLタグ
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(sanitized)) {
      return '[SUSPICIOUS_USER_AGENT]';
    }
  }

  // 長すぎるUser-Agentは切り詰め
  if (sanitized.length > 200) {
    return sanitized.substring(0, 200) + '[TRUNCATED]';
  }

  return sanitized;
}

/**
 * IPアドレス専用のサニタイゼーション
 * プライバシー保護とフォーマット検証
 */
export function sanitizeIPForLog(ip: string | undefined | null): string {
  if (!ip) return '[NO_IP]';

  const sanitized = sanitizeForLog(ip);

  // IPv4形式の検証
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  // IPv6形式の簡易検証
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

  if (!ipv4Regex.test(sanitized) && !ipv6Regex.test(sanitized)) {
    return '[INVALID_IP_FORMAT]';
  }

  return sanitized;
}

/**
 * リソースURL/パス専用のサニタイゼーション
 * パス情報を保持しつつセキュリティを確保
 */
export function sanitizeResourceForLog(resource: string | undefined | null): string {
  if (!resource) return '';

  const sanitized = sanitizeForLog(resource);

  // URLエンコードされた危険な文字をデコード後に再チェック
  try {
    const decoded = decodeURIComponent(sanitized);
    const reEncoded = sanitizeForLog(decoded);

    // パス長制限
    if (reEncoded.length > 1000) {
      return reEncoded.substring(0, 1000) + '[TRUNCATED]';
    }

    return reEncoded;
  } catch (error) {
    // デコードに失敗した場合は元の文字列を返す
    return sanitized.substring(0, 1000);
  }
}

/**
 * 汎用オブジェクトのサニタイゼーション
 * ログに出力されるオブジェクトの全フィールドをサニタイズ
 */
export function sanitizeObjectForLog(obj: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const sanitizedKey = sanitizeForLog(key);

    if (typeof value === 'string') {
      sanitized[sanitizedKey] = sanitizeForLog(value);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      sanitized[sanitizedKey] = value;
    } else if (value === null || value === undefined) {
      sanitized[sanitizedKey] = value;
    } else if (Array.isArray(value)) {
      sanitized[sanitizedKey] = value.map(item =>
        typeof item === 'string' ? sanitizeForLog(item) : item,
      );
    } else if (typeof value === 'object') {
      // 再帰的にサニタイズ（深さ制限あり）
      sanitized[sanitizedKey] = sanitizeObjectForLog(value);
    } else {
      // その他の型は文字列化してサニタイズ
      sanitized[sanitizedKey] = sanitizeForLog(String(value));
    }
  }

  return sanitized;
}

/**
 * ログエントリ全体の最終検証
 * 最終的なログ出力前の安全性チェック
 */
export function validateLogEntry(logEntry: string): boolean {
  // 改行文字や制御文字が残っていないかチェック
  if (/[\r\n\t\x00-\x1f\x7f-\x9f]/.test(logEntry)) {
    return false;
  }

  // 極端に長いログエントリを拒否
  if (logEntry.length > 10000) {
    return false;
  }

  return true;
}

/**
 * セキュリティログ専用のフォーマッター
 * 構造化ログ形式でのセキュアな出力
 */
export function formatSecurityLog(data: {
  timestamp: Date;
  level: string;
  type: string;
  message: string;
  metadata?: Record<string, any>;
}): string {
  const sanitizedData = {
    timestamp: data.timestamp.toISOString(),
    level: sanitizeForLog(data.level),
    type: sanitizeForLog(data.type),
    message: sanitizeForLog(data.message),
    metadata: data.metadata ? sanitizeObjectForLog(data.metadata) : undefined,
  };

  const logEntry = JSON.stringify(sanitizedData);

  if (!validateLogEntry(logEntry)) {
    return JSON.stringify({
      timestamp: data.timestamp.toISOString(),
      level: 'ERROR',
      type: 'LOG_SANITIZATION_FAILED',
      message: 'Log entry failed security validation',
      metadata: { originalLength: logEntry.length },
    });
  }

  return logEntry;
}
