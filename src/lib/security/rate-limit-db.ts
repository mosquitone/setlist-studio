// Vercel互換性のためのデータベースベースレート制限

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateRateLimitKey } from './security-utils';
import { logRateLimitExceededDB } from './security-logger-db';

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  message?: string;
}

interface RateLimitResult {
  success: boolean;
  count: number;
  remaining: number;
  resetTime: Date;
}

// Vercel互換性：データベースベースのレート制限
export class DatabaseRateLimit {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async checkRateLimit(key: string, options: RateLimitOptions): Promise<RateLimitResult> {
    const { windowMs, maxRequests } = options;
    const now = new Date();
    const resetTime = new Date(now.getTime() + windowMs);

    try {
      // トランザクションでアトミックな操作を保証
      const result = await this.prisma.$transaction(async (tx) => {
        // 本番環境では期限切れエントリの削除を5%の確率で実行（パフォーマンス最適化）
        const isProduction = process.env.NODE_ENV === 'production';
        if (!isProduction || Math.random() < 0.05) {
          await tx.rateLimitEntry.deleteMany({
            where: {
              resetTime: {
                lt: now,
              },
            },
          });
        }

        // 既存エントリの確認・更新
        const existingEntry = await tx.rateLimitEntry.findUnique({
          where: { key },
        });

        if (!existingEntry) {
          // 新規エントリ作成
          const newEntry = await tx.rateLimitEntry.create({
            data: {
              key,
              count: 1,
              resetTime,
            },
          });

          return {
            count: newEntry.count,
            resetTime: newEntry.resetTime,
          };
        } else if (existingEntry.resetTime < now) {
          // 期限切れエントリの更新
          const updatedEntry = await tx.rateLimitEntry.update({
            where: { key },
            data: {
              count: 1,
              resetTime,
            },
          });

          return {
            count: updatedEntry.count,
            resetTime: updatedEntry.resetTime,
          };
        } else {
          // カウンターのインクリメント
          const updatedEntry = await tx.rateLimitEntry.update({
            where: { key },
            data: {
              count: {
                increment: 1,
              },
            },
          });

          return {
            count: updatedEntry.count,
            resetTime: updatedEntry.resetTime,
          };
        }
      });

      const remaining = Math.max(0, maxRequests - result.count);
      const success = result.count <= maxRequests;

      return {
        success,
        count: result.count,
        remaining,
        resetTime: result.resetTime,
      };
    } catch (error) {
      console.error('Database rate limit error:', error);
      // データベースエラー時は制限を通す（fail-open approach）
      return {
        success: true,
        count: 0,
        remaining: maxRequests,
        resetTime,
      };
    }
  }

  // 定期的なクリーンアップ（Vercelの場合は手動実行）
  async cleanup(): Promise<void> {
    try {
      const result = await this.prisma.rateLimitEntry.deleteMany({
        where: {
          resetTime: {
            lt: new Date(),
          },
        },
      });
      console.log(`Cleaned up ${result.count} expired rate limit entries`);
    } catch (error) {
      console.error('Rate limit cleanup error:', error);
    }
  }
}

// Vercel Function対応のレート制限ミドルウェア
export function createDatabaseRateLimit(prisma: PrismaClient, options: RateLimitOptions) {
  const rateLimiter = new DatabaseRateLimit(prisma);

  return async (request: NextRequest): Promise<NextResponse | null> => {
    const rateLimitKey = generateRateLimitKey(request);
    const result = await rateLimiter.checkRateLimit(rateLimitKey, options);

    if (!result.success) {
      // レート制限違反をログに記録（データベースベース）
      await logRateLimitExceededDB(
        prisma,
        rateLimitKey,
        request.url,
        request.headers.get('user-agent') || undefined,
      );

      const retryAfter = Math.ceil((result.resetTime.getTime() - Date.now()) / 1000);

      return NextResponse.json(
        {
          error: options.message || 'Too many requests',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': options.maxRequests.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': Math.ceil(result.resetTime.getTime() / 1000).toString(),
          },
        },
      );
    }

    // 成功時のヘッダー設定
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', options.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set(
      'X-RateLimit-Reset',
      Math.ceil(result.resetTime.getTime() / 1000).toString(),
    );

    return null; // Allow request to continue
  };
}

// プリセット設定（Vercel対応）
export function createAuthRateLimit(prisma: PrismaClient) {
  // 開発環境では制限を緩和
  const isDevelopment = process.env.NODE_ENV === 'development';

  return createDatabaseRateLimit(prisma, {
    windowMs: isDevelopment ? 5 * 60 * 1000 : 15 * 60 * 1000, // 開発: 5分, 本番: 15分
    maxRequests: isDevelopment ? 20 : 5, // 開発: 20回, 本番: 5回
    message: '認証試行回数が上限に達しました。しばらく時間をおいてから再試行してください',
  });
}

export function createApiRateLimit(prisma: PrismaClient) {
  // 本番環境では制限を大幅に緩和してパフォーマンスを優先
  const isProduction = process.env.NODE_ENV === 'production';

  return createDatabaseRateLimit(prisma, {
    windowMs: isProduction ? 10 * 60 * 1000 : 60 * 1000, // 本番: 10分, 開発: 1分
    maxRequests: isProduction ? 500 : 60, // 本番: 500回, 開発: 60回
    message: 'リクエスト数が上限に達しました。しばらく時間をおいてから再試行してください',
  });
}

// バックグラウンドクリーンアップ用（Vercel Cronジョブで実行可能）
export async function cleanupExpiredRateLimits(prisma: PrismaClient): Promise<number> {
  try {
    const result = await prisma.rateLimitEntry.deleteMany({
      where: {
        resetTime: {
          lt: new Date(),
        },
      },
    });
    return result.count;
  } catch (error) {
    console.error('Rate limit cleanup error:', error);
    return 0;
  }
}
