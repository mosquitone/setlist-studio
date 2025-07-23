// Vercel互換性のためのデータベースベース脅威検知

import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';

import { StringArray, Timestamp } from '@/types/common';

import { getSecureClientIP } from './security-utils';

export enum ThreatType {
  BRUTE_FORCE_ATTACK = 'BRUTE_FORCE_ATTACK',
  SUSPICIOUS_IP_ACTIVITY = 'SUSPICIOUS_IP_ACTIVITY',
  RAPID_REQUEST_PATTERN = 'RAPID_REQUEST_PATTERN',
  CREDENTIAL_STUFFING = 'CREDENTIAL_STUFFING',
  BOT_DETECTION = 'BOT_DETECTION',
}

export enum ThreatSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface ThreatEvidence {
  timestamp: Timestamp;
  action: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  failedAttempts?: number;
  uniqueUsers?: number;
  requestCount?: number;
  timeWindow?: string;
  totalAttempts?: number;
}

export interface ThreatAlert {
  id: string;
  type: ThreatType;
  severity: ThreatSeverity;
  timestamp: Timestamp;
  description: string;
  ipAddress?: string;
  userId?: string;
  evidence: ThreatEvidence[];
  recommendations: StringArray;
  autoMitigated: boolean;
}

// Vercel互換性：データベースベースの脅威検知エンジン
export class DatabaseThreatDetection {
  private prisma: PrismaClient;
  private readonly thresholds = {
    maxFailedLogins: 5, // 連続ログイン失敗回数
    maxLoginAttemptsPerHour: 10, // 1時間あたりの最大ログイン試行
    maxRequestsPerMinute: 100, // 1分あたりの最大リクエスト数
    maxUsersPerIP: 5, // 1つのIPから同時利用できる最大ユーザー数
    suspiciousUserAgents: ['bot', 'crawler', 'spider', 'scraper', 'automated'],
  };

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // NextRequestからの脅威分析
  async analyzeRequest(
    request: NextRequest,
    email?: string,
    success?: boolean,
  ): Promise<ThreatAlert[]> {
    const ipAddress = getSecureClientIP(request);
    const userAgent = request.headers.get('user-agent') || undefined;

    if (email !== undefined && success !== undefined) {
      return this.analyzeLoginAttempt(email, success, ipAddress, userAgent);
    }

    // 一般的なリクエスト分析
    const alerts: ThreatAlert[] = [];

    if (ipAddress) {
      await this.recordIPActivity(ipAddress, 'request', undefined, userAgent);
      const ipThreats = await this.detectIPThreats(ipAddress);
      alerts.push(...ipThreats);
    }

    return alerts;
  }

  // ログイン試行の分析
  async analyzeLoginAttempt(
    email: string,
    success: boolean,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<ThreatAlert[]> {
    const alerts: ThreatAlert[] = [];

    // 脅威活動を記録
    if (ipAddress) {
      await this.recordIPActivity(
        ipAddress,
        success ? 'login_success' : 'login_failure',
        email,
        userAgent,
      );

      // IP関連の脅威検知
      const ipThreats = await this.detectIPThreats(ipAddress);
      alerts.push(...ipThreats);
    }

    if (!success) {
      // 失敗したログイン試行の分析
      const bruteForceAlert = await this.detectBruteForceAttack(email, ipAddress);
      if (bruteForceAlert) alerts.push(bruteForceAlert);

      const credentialStuffingAlert = await this.detectCredentialStuffing(ipAddress);
      if (credentialStuffingAlert) alerts.push(credentialStuffingAlert);
    }

    return alerts;
  }

  // IP活動の記録
  private async recordIPActivity(
    ipAddress: string,
    activityType: string,
    userId?: string,
    userAgent?: string,
  ): Promise<void> {
    try {
      await this.prisma.threatActivity.create({
        data: {
          ipAddress,
          activityType,
          userId,
          userAgent,
          metadata: userAgent ? { userAgent } : undefined,
        },
      });
    } catch (error) {
      console.error('Failed to record IP activity:', error);
    }
  }

  // ブルートフォース攻撃の検知
  private async detectBruteForceAttack(
    email: string,
    ipAddress?: string,
  ): Promise<ThreatAlert | null> {
    if (!ipAddress) return null;

    try {
      // 過去1時間の失敗ログイン数を確認
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      const failedAttempts = await this.prisma.threatActivity.count({
        where: {
          ipAddress,
          activityType: 'login_failure',
          timestamp: {
            gte: oneHourAgo,
          },
        },
      });

      if (failedAttempts >= this.thresholds.maxFailedLogins) {
        return {
          id: this.generateAlertId(),
          type: ThreatType.BRUTE_FORCE_ATTACK,
          severity: ThreatSeverity.HIGH,
          timestamp: new Date(),
          description: `IP ${ipAddress} から${failedAttempts}回の連続ログイン失敗を検出`,
          ipAddress,
          evidence: [
            {
              timestamp: new Date(),
              action: 'login_attempt',
              details: {},
              failedAttempts,
              timeWindow: '1hour',
            },
          ],
          recommendations: [
            '該当IPアドレスの一時的なブロック',
            'CAPTCHAの導入',
            'アカウントロックの検討',
          ],
          autoMitigated: false,
        };
      }
    } catch (error) {
      console.error('Brute force detection error:', error);
    }

    return null;
  }

  // 認証情報スタッフィング攻撃の検知
  private async detectCredentialStuffing(ipAddress?: string): Promise<ThreatAlert | null> {
    if (!ipAddress) return null;

    try {
      // 過去30分間の活動を分析
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

      const activities = await this.prisma.threatActivity.findMany({
        where: {
          ipAddress,
          activityType: 'login_failure',
          timestamp: {
            gte: thirtyMinutesAgo,
          },
        },
        select: {
          userId: true,
        },
      });

      const uniqueUsers = new Set(activities.map((a) => a.userId).filter(Boolean));

      if (uniqueUsers.size >= 5 && activities.length >= 10) {
        return {
          id: this.generateAlertId(),
          type: ThreatType.CREDENTIAL_STUFFING,
          severity: ThreatSeverity.CRITICAL,
          timestamp: new Date(),
          description: `IP ${ipAddress} から${uniqueUsers.size}個の異なるアカウントに対する認証情報スタッフィング攻撃を検出`,
          ipAddress,
          evidence: [
            {
              timestamp: new Date(),
              action: 'credential_stuffing',
              details: {},
              uniqueUsers: uniqueUsers.size,
              totalAttempts: activities.length,
              timeWindow: '30minutes',
            },
          ],
          recommendations: [
            '該当IPアドレスの即座のブロック',
            '影響を受けた可能性のあるユーザーへの通知',
            'CAPTCHAの導入検討',
          ],
          autoMitigated: true,
        };
      }
    } catch (error) {
      console.error('Credential stuffing detection error:', error);
    }

    return null;
  }

  // IP関連の脅威検知
  private async detectIPThreats(ipAddress: string): Promise<ThreatAlert[]> {
    const alerts: ThreatAlert[] = [];

    try {
      // 過去1時間のリクエスト数確認
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      const recentActivity = await this.prisma.threatActivity.count({
        where: {
          ipAddress,
          timestamp: {
            gte: oneHourAgo,
          },
        },
      });

      if (recentActivity > this.thresholds.maxRequestsPerMinute) {
        alerts.push({
          id: this.generateAlertId(),
          type: ThreatType.RAPID_REQUEST_PATTERN,
          severity: ThreatSeverity.MEDIUM,
          timestamp: new Date(),
          description: `IP ${ipAddress} から過去1時間で${recentActivity}件の大量リクエストを検出`,
          ipAddress,
          evidence: [
            {
              timestamp: new Date(),
              action: 'rapid_requests',
              details: {},
              requestCount: recentActivity,
              timeWindow: '1hour',
            },
          ],
          recommendations: ['レート制限の強化', 'DDoS攻撃の可能性を調査'],
          autoMitigated: false,
        });
      }
    } catch (error) {
      console.error('IP threat detection error:', error);
    }

    return alerts;
  }

  // セキュリティダッシュボード用データ
  async getSecurityDashboardData(): Promise<{
    criticalEvents: number;
    recentFailedLogins: number;
    rateLimitViolations: number;
    topRiskyIPs: StringArray;
  }> {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      const [recentFailedLogins, rateLimitViolations, ipActivities] = await Promise.all([
        this.prisma.threatActivity.count({
          where: {
            activityType: 'login_failure',
            timestamp: { gte: oneHourAgo },
          },
        }),
        this.prisma.threatActivity.count({
          where: {
            activityType: 'rate_limit_hit',
            timestamp: { gte: oneHourAgo },
          },
        }),
        this.prisma.threatActivity.groupBy({
          by: ['ipAddress'],
          where: {
            timestamp: { gte: oneHourAgo },
          },
          _count: {
            ipAddress: true,
          },
          orderBy: {
            _count: {
              ipAddress: 'desc',
            },
          },
          take: 5,
        }),
      ]);

      return {
        criticalEvents: 0, // SecurityEventテーブルから取得予定
        recentFailedLogins,
        rateLimitViolations,
        topRiskyIPs: ipActivities.map((activity) => activity.ipAddress),
      };
    } catch (error) {
      console.error('Security dashboard data error:', error);
      return {
        criticalEvents: 0,
        recentFailedLogins: 0,
        rateLimitViolations: 0,
        topRiskyIPs: [],
      };
    }
  }

  // 定期的なクリーンアップ
  async cleanup(): Promise<void> {
    try {
      // 30日以上古い脅威活動を削除
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const result = await this.prisma.threatActivity.deleteMany({
        where: {
          timestamp: {
            lt: thirtyDaysAgo,
          },
        },
      });

      console.log(`Cleaned up ${result.count} old threat activities`);
    } catch (error) {
      console.error('Threat detection cleanup error:', error);
    }
  }

  private generateAlertId(): string {
    return `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// バックグラウンドクリーンアップ用（Vercel Cronジョブで実行可能）
export async function cleanupOldThreatActivities(prisma: PrismaClient): Promise<number> {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const result = await prisma.threatActivity.deleteMany({
      where: {
        timestamp: {
          lt: thirtyDaysAgo,
        },
      },
    });

    return result.count;
  } catch (error) {
    console.error('Threat activity cleanup error:', error);
    return 0;
  }
}
