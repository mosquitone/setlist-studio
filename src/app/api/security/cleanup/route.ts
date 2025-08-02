// Vercel Cron Job用：セキュリティデータベースクリーンアップ

import { NextRequest, NextResponse } from 'next/server';

import { config, env } from '../../../../lib/config/environment';
import { cleanupExpiredRateLimits } from '../../../../lib/security/rate-limit-db';
import { cleanupOldSecurityEvents } from '../../../../lib/security/security-logger-db';
import { cleanupOldThreatActivities } from '../../../../lib/security/threat-detection-db';
import { cleanupExpiredTokens } from '../../../../lib/security/token-manager';
import { cleanupExpiredUsedTokens } from '../../../../lib/security/used-token-manager';
import { prisma } from '../../../../lib/server/prisma-optimized';

// Vercel Cron Job: 0 2 * * * (毎日午前2時に実行)
export async function GET(request: NextRequest) {
  // 認証確認：Vercel環境変数でCronジョブからのアクセスを確認
  const authHeader = request.headers.get('authorization');
  const cronSecret = config.cronSecret;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: '認証に失敗しました' }, { status: 401 });
  }

  try {
    const startTime = Date.now();

    // 並行してクリーンアップ実行
    const [
      rateLimitCleanup,
      threatActivityCleanup,
      securityEventCleanup,
      tokenCleanup,
      usedTokenCleanup,
    ] = await Promise.all([
      cleanupExpiredRateLimits(prisma),
      cleanupOldThreatActivities(prisma),
      cleanupOldSecurityEvents(prisma),
      cleanupExpiredTokens(prisma),
      cleanupExpiredUsedTokens(prisma),
    ]);

    const endTime = Date.now();
    const duration = endTime - startTime;

    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      cleaned: {
        rateLimitEntries: rateLimitCleanup,
        threatActivities: threatActivityCleanup,
        securityEvents: securityEventCleanup,
        tokens: tokenCleanup,
        usedTokens: usedTokenCleanup,
      },
    };

    console.log('Security cleanup completed:', result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Security cleanup error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'クリーンアップに失敗しました',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

// 手動実行用（開発・テスト時）
export async function POST(request: NextRequest) {
  // 開発環境でのみ許可
  if (!env.isDevelopment) {
    return NextResponse.json({ error: '本番環境では利用できません' }, { status: 403 });
  }

  try {
    const result = await GET(request);
    return result;
  } catch {
    return NextResponse.json({ error: '手動クリーンアップに失敗しました' }, { status: 500 });
  }
}
