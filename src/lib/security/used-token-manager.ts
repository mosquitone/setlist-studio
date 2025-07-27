import crypto from 'crypto';

import { Prisma } from '@prisma/client';

/**
 * 使用済みトークン管理システム
 * トークンの使用履歴を保存し、無効なトークンでもユーザーIDを追跡可能にする
 */

// トークンタイプの定義
export enum TokenType {
  EMAIL_CHANGE = 'emailChange',
  PASSWORD_RESET = 'passwordReset',
  EMAIL_VERIFICATION = 'emailVerification',
  JWT = 'jwt',
}

// トークンをハッシュ化（セキュリティ向上のため）
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// トークンの最初の8文字（プレフィックス）を取得
export function getTokenPrefix(token: string): string {
  return token.substring(0, 8);
}

interface SaveUsedTokenParams {
  token: string;
  tokenType: TokenType;
  userId: string | null;
  success: boolean;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt?: Date;
  caller?: string; // 呼び出し元の識別子（デバッグ用）
}

/**
 * 使用済みトークンを保存
 */
export async function saveUsedToken(
  tx: Prisma.TransactionClient,
  params: SaveUsedTokenParams,
): Promise<void> {
  const { token, tokenType, userId, success, reason, ipAddress, userAgent, caller } = params;

  // デフォルトは90日後、カスタム期限も設定可能
  const expiresAt = params.expiresAt || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

  try {
    await tx.usedToken.create({
      data: {
        token: hashToken(token), // ハッシュ化して保存
        tokenType,
        userId,
        success,
        reason,
        ipAddress,
        userAgent,
        expiresAt,
      },
    });
  } catch (error) {
    // エラーログを記録するが、処理は継続
    const prefix = caller || 'UsedTokenManager';
    console.error(`[${prefix}] Failed to save used token:`, {
      tokenType,
      userId,
      success,
      reason,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    // エラーを再スローしない（監査ログは重要だが、メイン処理を止めるほどではない）
  }
}

/**
 * トークンからユーザーIDを推定
 * 無効なトークンでも、過去の使用履歴からユーザーIDを特定する
 */
export async function inferUserIdFromToken(
  tx: Prisma.TransactionClient,
  token: string,
  tokenType: TokenType,
): Promise<string | null> {
  // まず完全一致で検索
  const hashedToken = hashToken(token);
  const usedToken = await tx.usedToken.findFirst({
    where: {
      token: hashedToken,
      tokenType,
    },
    orderBy: {
      usedAt: 'desc',
    },
  });

  if (usedToken?.userId) {
    return usedToken.userId;
  }

  // トークンプレフィックスで検索（部分一致攻撃の可能性）
  const prefix = getTokenPrefix(token);
  const recentTokens = await tx.usedToken.findMany({
    where: {
      tokenType,
      token: {
        startsWith: prefix,
      },
      usedAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24時間以内
      },
    },
    orderBy: {
      usedAt: 'desc',
    },
    take: 5,
  });

  // 最も頻繁に出現するuserIdを返す
  const userIdCounts = recentTokens.reduce(
    (acc, token) => {
      if (token.userId) {
        acc[token.userId] = (acc[token.userId] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const mostFrequentUserId = Object.entries(userIdCounts).sort(([, a], [, b]) => b - a)[0]?.[0];

  return mostFrequentUserId || null;
}

/**
 * 期限切れの使用済みトークンをクリーンアップ
 */
export async function cleanupExpiredUsedTokens(prisma: Prisma.TransactionClient): Promise<number> {
  try {
    const result = await prisma.usedToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  } catch (error) {
    console.error('Failed to cleanup expired used tokens:', error);
    return 0;
  }
}

/**
 * トークン使用パターンの分析（セキュリティ監視用）
 */
export async function analyzeTokenUsagePattern(
  tx: Prisma.TransactionClient,
  userId: string,
  tokenType: TokenType,
  hours: number = 24,
): Promise<{
  totalAttempts: number;
  failedAttempts: number;
  uniqueIpAddresses: number;
  suspiciousActivity: boolean;
}> {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const tokens = await tx.usedToken.findMany({
    where: {
      userId,
      tokenType,
      usedAt: {
        gte: since,
      },
    },
  });

  const failedAttempts = tokens.filter((t) => !t.success).length;
  const uniqueIps = new Set(tokens.map((t) => t.ipAddress).filter(Boolean)).size;

  // 疑わしいアクティビティの判定
  const suspiciousActivity =
    failedAttempts > 10 || // 10回以上の失敗
    uniqueIps > 5 || // 5つ以上の異なるIPアドレス
    failedAttempts / tokens.length > 0.8; // 80%以上が失敗

  return {
    totalAttempts: tokens.length,
    failedAttempts,
    uniqueIpAddresses: uniqueIps,
    suspiciousActivity,
  };
}
