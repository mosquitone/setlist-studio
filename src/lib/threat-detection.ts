// セキュリティ脅威検知システム

import { securityLogger, SecurityEventType, SecurityEventSeverity, logSecurityEvent } from './security-logger'

export enum ThreatType {
  BRUTE_FORCE_ATTACK = 'BRUTE_FORCE_ATTACK',
  SUSPICIOUS_IP_ACTIVITY = 'SUSPICIOUS_IP_ACTIVITY',
  RAPID_REQUEST_PATTERN = 'RAPID_REQUEST_PATTERN',
  UNUSUAL_ACCESS_PATTERN = 'UNUSUAL_ACCESS_PATTERN',
  CREDENTIAL_STUFFING = 'CREDENTIAL_STUFFING',
  BOT_DETECTION = 'BOT_DETECTION',
}

export enum ThreatSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface ThreatAlert {
  id: string
  type: ThreatType
  severity: ThreatSeverity
  timestamp: Date
  description: string
  ipAddress?: string
  userId?: string
  evidence: any[]
  recommendations: string[]
  autoMitigated: boolean
}

interface UserActivity {
  userId: string
  loginAttempts: number
  lastLoginTime?: Date
  ipAddresses: Set<string>
  userAgents: Set<string>
  failedAttempts: number
}

interface IPActivity {
  ip: string
  requestCount: number
  userIds: Set<string>
  lastActivity: Date
  suspiciousActivities: string[]
  isBlocked: boolean
}

class ThreatDetectionEngine {
  private userActivities = new Map<string, UserActivity>()
  private ipActivities = new Map<string, IPActivity>()
  private alertHistory: ThreatAlert[] = []
  
  // 設定可能な閾値
  private readonly thresholds = {
    maxFailedLogins: 5,            // 連続ログイン失敗回数
    maxLoginAttemptsPerHour: 10,   // 1時間あたりの最大ログイン試行
    maxRequestsPerMinute: 100,     // 1分あたりの最大リクエスト数
    maxUsersPerIP: 5,              // 1つのIPから同時利用できる最大ユーザー数
    suspiciousUserAgents: [        // 疑わしいUser-Agent
      'bot', 'crawler', 'spider', 'scraper', 'automated'
    ],
  }

  constructor() {
    // 定期的なクリーンアップを開始
    this.startPeriodicCleanup()
  }

  // ログイン試行の分析
  analyzeLoginAttempt(
    email: string,
    success: boolean,
    ipAddress?: string,
    userAgent?: string
  ): ThreatAlert[] {
    const alerts: ThreatAlert[] = []
    const now = new Date()

    // IPアクティビティの更新
    if (ipAddress) {
      this.updateIPActivity(ipAddress, userAgent)
      
      // IP関連の脅威検知
      const ipThreats = this.detectIPThreats(ipAddress)
      alerts.push(...ipThreats)
    }

    if (!success) {
      // 失敗したログイン試行の分析
      const bruteForceAlert = this.detectBruteForceAttack(email, ipAddress)
      if (bruteForceAlert) alerts.push(bruteForceAlert)

      const credentialStuffingAlert = this.detectCredentialStuffing(ipAddress)
      if (credentialStuffingAlert) alerts.push(credentialStuffingAlert)
    }

    // User-Agentの分析
    if (userAgent) {
      const botAlert = this.detectBotActivity(userAgent, ipAddress)
      if (botAlert) alerts.push(botAlert)
    }

    // アラートをログに記録
    alerts.forEach(alert => this.recordAlert(alert))

    return alerts
  }

  // ブルートフォース攻撃の検知
  private detectBruteForceAttack(email: string, ipAddress?: string): ThreatAlert | null {
    if (!ipAddress) return null

    const ipActivity = this.ipActivities.get(ipAddress)
    if (!ipActivity) return null

    // 短時間での複数回のログイン失敗
    const recentEvents = securityLogger.getEventsByTimeRange(
      new Date(Date.now() - 15 * 60 * 1000), // 15分間
      new Date()
    ).filter(event => 
      event.type === SecurityEventType.LOGIN_FAILURE &&
      event.ipAddress === ipAddress
    )

    if (recentEvents.length >= this.thresholds.maxFailedLogins) {
      return {
        id: this.generateAlertId(),
        type: ThreatType.BRUTE_FORCE_ATTACK,
        severity: ThreatSeverity.HIGH,
        timestamp: new Date(),
        description: `IP ${ipAddress} から15分間で${recentEvents.length}回のログイン失敗が検出されました`,
        ipAddress,
        evidence: recentEvents,
        recommendations: [
          '該当IPアドレスの一時的なブロックを検討',
          'ユーザーにパスワード変更を推奨',
          'アカウントロック機能の有効化'
        ],
        autoMitigated: false,
      }
    }

    return null
  }

  // 認証情報スタッフィング攻撃の検知
  private detectCredentialStuffing(ipAddress?: string): ThreatAlert | null {
    if (!ipAddress) return null

    const ipActivity = this.ipActivities.get(ipAddress)
    if (!ipActivity && ipActivity!.userIds.size < 3) return null

    // 1つのIPから複数の異なるアカウントへのログイン試行
    const recentEvents = securityLogger.getEventsByTimeRange(
      new Date(Date.now() - 30 * 60 * 1000), // 30分間
      new Date()
    ).filter(event => 
      event.type === SecurityEventType.LOGIN_FAILURE &&
      event.ipAddress === ipAddress
    )

    const uniqueEmails = new Set(recentEvents.map(event => event.details.email))

    if (uniqueEmails.size >= 5 && recentEvents.length >= 10) {
      return {
        id: this.generateAlertId(),
        type: ThreatType.CREDENTIAL_STUFFING,
        severity: ThreatSeverity.CRITICAL,
        timestamp: new Date(),
        description: `IP ${ipAddress} から${uniqueEmails.size}個の異なるアカウントに対する認証情報スタッフィング攻撃を検出`,
        ipAddress,
        evidence: recentEvents,
        recommendations: [
          '該当IPアドレスの即座のブロック',
          '影響を受けた可能性のあるユーザーへの通知',
          'CAPTCHAの導入検討'
        ],
        autoMitigated: true,
      }
    }

    return null
  }

  // ボット活動の検知
  private detectBotActivity(userAgent: string, ipAddress?: string): ThreatAlert | null {
    const lowerUA = userAgent.toLowerCase()
    
    const isSuspicious = this.thresholds.suspiciousUserAgents.some(
      pattern => lowerUA.includes(pattern)
    )

    if (isSuspicious) {
      return {
        id: this.generateAlertId(),
        type: ThreatType.BOT_DETECTION,
        severity: ThreatSeverity.MEDIUM,
        timestamp: new Date(),
        description: `疑わしいUser-Agent「${userAgent}」によるボット活動を検出`,
        ipAddress,
        evidence: [{ userAgent, detectedPatterns: this.thresholds.suspiciousUserAgents }],
        recommendations: [
          'User-Agentベースのフィルタリング強化',
          'CAPTCHAまたはreCAPTCHAの導入',
          '該当IPの監視強化'
        ],
        autoMitigated: false,
      }
    }

    return null
  }

  // IP関連脅威の検知
  private detectIPThreats(ipAddress: string): ThreatAlert[] {
    const alerts: ThreatAlert[] = []
    const ipActivity = this.ipActivities.get(ipAddress)
    
    if (!ipActivity) return alerts

    // 異常に多いリクエスト数
    if (ipActivity.requestCount > this.thresholds.maxRequestsPerMinute) {
      alerts.push({
        id: this.generateAlertId(),
        type: ThreatType.RAPID_REQUEST_PATTERN,
        severity: ThreatSeverity.HIGH,
        timestamp: new Date(),
        description: `IP ${ipAddress} から1分間で${ipActivity.requestCount}件の異常に多いリクエストを検出`,
        ipAddress,
        evidence: [{ requestCount: ipActivity.requestCount, timeWindow: '1分' }],
        recommendations: [
          'レート制限の強化',
          '該当IPの一時的な制限',
          'DDoS対策の確認'
        ],
        autoMitigated: false,
      })
    }

    // 1つのIPから複数ユーザーアクセス
    if (ipActivity.userIds.size > this.thresholds.maxUsersPerIP) {
      alerts.push({
        id: this.generateAlertId(),
        type: ThreatType.SUSPICIOUS_IP_ACTIVITY,
        severity: ThreatSeverity.MEDIUM,
        timestamp: new Date(),
        description: `IP ${ipAddress} から${ipActivity.userIds.size}個の異なるユーザーアカウントへのアクセスを検出`,
        ipAddress,
        evidence: [{ userCount: ipActivity.userIds.size, threshold: this.thresholds.maxUsersPerIP }],
        recommendations: [
          '共有環境または企業ネットワークの可能性を確認',
          '該当IPの監視継続',
          '必要に応じて追加認証の要求'
        ],
        autoMitigated: false,
      })
    }

    return alerts
  }

  // IPアクティビティの更新
  private updateIPActivity(ipAddress: string, userAgent?: string): void {
    const existing = this.ipActivities.get(ipAddress)
    
    if (existing) {
      existing.requestCount++
      existing.lastActivity = new Date()
    } else {
      this.ipActivities.set(ipAddress, {
        ip: ipAddress,
        requestCount: 1,
        userIds: new Set(),
        lastActivity: new Date(),
        suspiciousActivities: [],
        isBlocked: false,
      })
    }
  }

  // アラートの記録
  private async recordAlert(alert: ThreatAlert): Promise<void> {
    this.alertHistory.push(alert)
    
    // セキュリティログにも記録
    await logSecurityEvent({
      type: SecurityEventType.SUSPICIOUS_REQUEST,
      severity: this.mapThreatSeverityToSecuritySeverity(alert.severity),
      ipAddress: alert.ipAddress,
      details: {
        threatType: alert.type,
        threatSeverity: alert.severity,
        description: alert.description,
        evidence: alert.evidence,
        autoMitigated: alert.autoMitigated,
      },
    })

    // 重要度が高い場合は即座に処理
    if (alert.severity === ThreatSeverity.CRITICAL) {
      await this.handleCriticalThreat(alert)
    }
  }

  // 重要な脅威への対応
  private async handleCriticalThreat(alert: ThreatAlert): Promise<void> {
    console.error('🚨 CRITICAL THREAT DETECTED:', alert)
    
    // 自動的な軽減措置
    if (alert.ipAddress && alert.autoMitigated) {
      await this.blockIP(alert.ipAddress, '自動的な脅威軽減')
    }
    
    // 管理者への通知（実装予定）
    // await this.notifyAdministrators(alert)
  }

  // IPブロック機能
  private async blockIP(ipAddress: string, reason: string): Promise<void> {
    const ipActivity = this.ipActivities.get(ipAddress)
    if (ipActivity) {
      ipActivity.isBlocked = true
      ipActivity.suspiciousActivities.push(reason)
    }
    
    console.warn(`🚫 IP ${ipAddress} がブロックされました: ${reason}`)
  }

  // ユーティリティ関数
  private generateAlertId(): string {
    return `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private mapThreatSeverityToSecuritySeverity(severity: ThreatSeverity): SecurityEventSeverity {
    switch (severity) {
      case ThreatSeverity.LOW: return SecurityEventSeverity.LOW
      case ThreatSeverity.MEDIUM: return SecurityEventSeverity.MEDIUM
      case ThreatSeverity.HIGH: return SecurityEventSeverity.HIGH
      case ThreatSeverity.CRITICAL: return SecurityEventSeverity.CRITICAL
    }
  }

  // 定期クリーンアップ（古いデータの削除）
  private startPeriodicCleanup(): void {
    setInterval(() => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      
      // 古いIPアクティビティの削除
      for (const [ip, activity] of this.ipActivities.entries()) {
        if (activity.lastActivity < oneHourAgo) {
          this.ipActivities.delete(ip)
        }
      }
      
      // 古いアラートの削除（直近100件を保持）
      if (this.alertHistory.length > 100) {
        this.alertHistory = this.alertHistory.slice(-100)
      }
    }, 15 * 60 * 1000) // 15分ごとに実行
  }

  // 統計情報の取得
  getSecurityStatistics(): {
    totalAlerts: number
    alertsByType: Record<string, number>
    alertsBySeverity: Record<string, number>
    blockedIPs: string[]
    recentThreats: ThreatAlert[]
  } {
    const alertsByType: Record<string, number> = {}
    const alertsBySeverity: Record<string, number> = {}
    
    this.alertHistory.forEach(alert => {
      alertsByType[alert.type] = (alertsByType[alert.type] || 0) + 1
      alertsBySeverity[alert.severity] = (alertsBySeverity[alert.severity] || 0) + 1
    })
    
    const blockedIPs = Array.from(this.ipActivities.entries())
      .filter(([, activity]) => activity.isBlocked)
      .map(([ip]) => ip)
    
    return {
      totalAlerts: this.alertHistory.length,
      alertsByType,
      alertsBySeverity,
      blockedIPs,
      recentThreats: this.alertHistory.slice(-10),
    }
  }
}

// シングルトンインスタンス
export const threatDetection = new ThreatDetectionEngine()

// 便利なヘルパー関数
export const analyzeLoginAttempt = threatDetection.analyzeLoginAttempt.bind(threatDetection)
export const getSecurityStatistics = threatDetection.getSecurityStatistics.bind(threatDetection)