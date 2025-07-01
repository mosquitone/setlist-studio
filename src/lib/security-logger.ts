// セキュリティイベント監査ログシステム

export enum SecurityEventType {
  // 認証関連
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  REGISTER_SUCCESS = 'REGISTER_SUCCESS',
  REGISTER_FAILURE = 'REGISTER_FAILURE',
  LOGOUT = 'LOGOUT',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // アクセス制御
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  FORBIDDEN_ACCESS = 'FORBIDDEN_ACCESS',
  PRIVATE_SETLIST_ACCESS_DENIED = 'PRIVATE_SETLIST_ACCESS_DENIED',
  
  // セキュリティ攻撃
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  CSRF_TOKEN_INVALID = 'CSRF_TOKEN_INVALID',
  SUSPICIOUS_REQUEST = 'SUSPICIOUS_REQUEST',
  BRUTE_FORCE_ATTEMPT = 'BRUTE_FORCE_ATTEMPT',
  
  // データ操作
  SETLIST_CREATED = 'SETLIST_CREATED',
  SETLIST_UPDATED = 'SETLIST_UPDATED',
  SETLIST_DELETED = 'SETLIST_DELETED',
  SONG_CREATED = 'SONG_CREATED',
  SONG_UPDATED = 'SONG_UPDATED',
  SONG_DELETED = 'SONG_DELETED',
}

export enum SecurityEventSeverity {
  LOW = 'LOW',       // 通常操作
  MEDIUM = 'MEDIUM', // 注意が必要
  HIGH = 'HIGH',     // 警戒レベル
  CRITICAL = 'CRITICAL', // 緊急対応が必要
}

export interface SecurityEvent {
  id: string
  timestamp: Date
  type: SecurityEventType
  severity: SecurityEventSeverity
  userId?: string
  sessionId?: string
  ipAddress?: string
  userAgent?: string
  resource?: string
  details: Record<string, any>
  metadata?: {
    requestId?: string
    endpoint?: string
    method?: string
    statusCode?: number
  }
}

export interface SecurityLoggerConfig {
  enableConsoleLogging: boolean
  enableFileLogging: boolean
  enableDatabaseLogging: boolean
  logLevel: SecurityEventSeverity
  maxLogEntries: number
}

class SecurityLogger {
  private config: SecurityLoggerConfig
  private logBuffer: SecurityEvent[] = []

  constructor(config: Partial<SecurityLoggerConfig> = {}) {
    this.config = {
      enableConsoleLogging: process.env.NODE_ENV === 'development',
      enableFileLogging: false, // ファイルログは本番環境で有効化
      enableDatabaseLogging: true,
      logLevel: SecurityEventSeverity.LOW,
      maxLogEntries: 1000,
      ...config,
    }
  }

  async logEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): Promise<void> {
    const fullEvent: SecurityEvent = {
      id: this.generateEventId(),
      timestamp: new Date(),
      ...event,
    }

    // 重要度フィルタリング
    if (!this.shouldLog(event.severity)) {
      return
    }

    // バッファに追加
    this.logBuffer.push(fullEvent)
    
    // バッファサイズ制限
    if (this.logBuffer.length > this.config.maxLogEntries) {
      this.logBuffer.shift()
    }

    // 各種ログ出力
    await Promise.all([
      this.logToConsole(fullEvent),
      this.logToFile(fullEvent),
      this.logToDatabase(fullEvent),
    ])

    // 緊急度が高い場合は即座に通知
    if (event.severity === SecurityEventSeverity.CRITICAL) {
      await this.sendCriticalAlert(fullEvent)
    }
  }

  private generateEventId(): string {
    return `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private shouldLog(severity: SecurityEventSeverity): boolean {
    const severityLevels = {
      [SecurityEventSeverity.LOW]: 0,
      [SecurityEventSeverity.MEDIUM]: 1,
      [SecurityEventSeverity.HIGH]: 2,
      [SecurityEventSeverity.CRITICAL]: 3,
    }

    return severityLevels[severity] >= severityLevels[this.config.logLevel]
  }

  private async logToConsole(event: SecurityEvent): Promise<void> {
    if (!this.config.enableConsoleLogging) return

    const logLevel = event.severity === SecurityEventSeverity.CRITICAL ? 'error' :
                    event.severity === SecurityEventSeverity.HIGH ? 'warn' :
                    'info'

    console[logLevel]('🔒 Security Event:', {
      id: event.id,
      type: event.type,
      severity: event.severity,
      timestamp: event.timestamp.toISOString(),
      userId: event.userId,
      ipAddress: event.ipAddress,
      resource: event.resource,
      details: event.details,
    })
  }

  private async logToFile(event: SecurityEvent): Promise<void> {
    if (!this.config.enableFileLogging) return
    
    // ファイルログは本番環境での実装時に追加
    // 現在は開発環境のためスキップ
  }

  private async logToDatabase(event: SecurityEvent): Promise<void> {
    if (!this.config.enableDatabaseLogging) return

    try {
      // 将来的にはPrismaを使用してデータベースに保存
      // 現在は開発のためメモリ内保存
      // await prisma.securityLog.create({ data: event })
    } catch (error) {
      console.error('Failed to log security event to database:', error)
    }
  }

  private async sendCriticalAlert(event: SecurityEvent): Promise<void> {
    // 緊急アラートの送信（メール、Slack、webhook等）
    console.error('🚨 CRITICAL SECURITY EVENT:', {
      type: event.type,
      details: event.details,
      timestamp: event.timestamp.toISOString(),
    })
  }

  // 統計情報取得
  getEventStatistics(): {
    totalEvents: number
    eventsByType: Record<string, number>
    eventsBySeverity: Record<string, number>
    recentEvents: SecurityEvent[]
  } {
    const eventsByType: Record<string, number> = {}
    const eventsBySeverity: Record<string, number> = {}

    this.logBuffer.forEach(event => {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1
    })

    return {
      totalEvents: this.logBuffer.length,
      eventsByType,
      eventsBySeverity,
      recentEvents: this.logBuffer.slice(-10), // 最新10件
    }
  }

  // 特定期間のイベント取得
  getEventsByTimeRange(startTime: Date, endTime: Date): SecurityEvent[] {
    return this.logBuffer.filter(
      event => event.timestamp >= startTime && event.timestamp <= endTime
    )
  }

  // 特定ユーザーのイベント取得
  getEventsByUser(userId: string): SecurityEvent[] {
    return this.logBuffer.filter(event => event.userId === userId)
  }

  // セキュリティダッシュボード用データ
  getSecurityDashboardData(): {
    criticalEvents: number
    recentFailedLogins: number
    rateLimitViolations: number
    unauthorizedAccess: number
    topRiskyIPs: string[]
  } {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const recentEvents = this.getEventsByTimeRange(oneHourAgo, now)

    const criticalEvents = recentEvents.filter(
      e => e.severity === SecurityEventSeverity.CRITICAL
    ).length

    const recentFailedLogins = recentEvents.filter(
      e => e.type === SecurityEventType.LOGIN_FAILURE
    ).length

    const rateLimitViolations = recentEvents.filter(
      e => e.type === SecurityEventType.RATE_LIMIT_EXCEEDED
    ).length

    const unauthorizedAccess = recentEvents.filter(
      e => e.type === SecurityEventType.UNAUTHORIZED_ACCESS || 
          e.type === SecurityEventType.FORBIDDEN_ACCESS
    ).length

    // 頻繁にアクセスしているIPアドレスを特定
    const ipCounts: Record<string, number> = {}
    recentEvents.forEach(event => {
      if (event.ipAddress) {
        ipCounts[event.ipAddress] = (ipCounts[event.ipAddress] || 0) + 1
      }
    })

    const topRiskyIPs = Object.entries(ipCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([ip]) => ip)

    return {
      criticalEvents,
      recentFailedLogins,
      rateLimitViolations,
      unauthorizedAccess,
      topRiskyIPs,
    }
  }
}

// シングルトンインスタンス
export const securityLogger = new SecurityLogger()

// 便利なヘルパー関数
export const logSecurityEvent = securityLogger.logEvent.bind(securityLogger)

// 認証関連のログヘルパー
export const logAuthSuccess = (userId: string, ipAddress?: string, userAgent?: string) =>
  logSecurityEvent({
    type: SecurityEventType.LOGIN_SUCCESS,
    severity: SecurityEventSeverity.LOW,
    userId,
    ipAddress,
    userAgent,
    details: { success: true },
  })

export const logAuthFailure = (email: string, reason: string, ipAddress?: string, userAgent?: string) =>
  logSecurityEvent({
    type: SecurityEventType.LOGIN_FAILURE,
    severity: SecurityEventSeverity.MEDIUM,
    ipAddress,
    userAgent,
    details: { email, reason, failed: true },
  })

export const logRateLimitExceeded = (ipAddress?: string, endpoint?: string, userAgent?: string) =>
  logSecurityEvent({
    type: SecurityEventType.RATE_LIMIT_EXCEEDED,
    severity: SecurityEventSeverity.HIGH,
    ipAddress,
    userAgent,
    resource: endpoint,
    details: { rateLimitExceeded: true },
  })

export const logUnauthorizedAccess = (
  userId?: string,
  resource?: string,
  ipAddress?: string,
  userAgent?: string
) =>
  logSecurityEvent({
    type: SecurityEventType.UNAUTHORIZED_ACCESS,
    severity: SecurityEventSeverity.HIGH,
    userId,
    ipAddress,
    userAgent,
    resource,
    details: { unauthorized: true },
  })