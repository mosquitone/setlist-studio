// セキュアなパスワードリセット機能

import { randomBytes, createHash } from 'crypto'
import { logSecurityEvent, SecurityEventType, SecurityEventSeverity } from './security-logger'

export interface PasswordResetRequest {
  id: string
  email: string
  tokenHash: string
  expiresAt: Date
  createdAt: Date
  used: boolean
  ipAddress?: string
  userAgent?: string
}

export interface PasswordResetResult {
  success: boolean
  message: string
  requestId?: string
}

class PasswordResetManager {
  private resetRequests = new Map<string, PasswordResetRequest>()
  private readonly TOKEN_EXPIRY_HOURS = 1 // 1時間で有効期限切れ
  private readonly MAX_REQUESTS_PER_EMAIL = 3 // メールアドレスあたりの最大リクエスト数
  private readonly MAX_REQUESTS_PER_IP = 5 // IPアドレスあたりの最大リクエスト数

  constructor() {
    // 定期的に期限切れのリクエストをクリーンアップ
    this.startPeriodicCleanup()
  }

  // パスワードリセットリクエストの作成
  async createResetRequest(
    email: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<PasswordResetResult> {
    try {
      // レート制限チェック
      const rateLimitResult = this.checkRateLimit(email, ipAddress)
      if (!rateLimitResult.allowed) {
        await this.logSecurityEvent('RATE_LIMIT_EXCEEDED', email, ipAddress, userAgent, {
          reason: rateLimitResult.reason,
          email,
        })
        return {
          success: false,
          message: 'リクエスト制限に達しました。しばらく時間をおいてから再試行してください',
        }
      }

      // リセットトークンの生成
      const token = this.generateSecureToken()
      const tokenHash = this.hashToken(token)
      
      const request: PasswordResetRequest = {
        id: this.generateRequestId(),
        email,
        tokenHash,
        expiresAt: new Date(Date.now() + this.TOKEN_EXPIRY_HOURS * 60 * 60 * 1000),
        createdAt: new Date(),
        used: false,
        ipAddress,
        userAgent,
      }

      // 既存の未使用リクエストを無効化
      this.invalidateExistingRequests(email)

      // 新しいリクエストを保存
      this.resetRequests.set(request.id, request)

      // セキュリティログ記録
      await this.logSecurityEvent('PASSWORD_RESET_REQUESTED', email, ipAddress, userAgent, {
        requestId: request.id,
        expiresAt: request.expiresAt,
      })

      // 実際の実装では、ここでメール送信を行う
      await this.sendResetEmail(email, token, request.id)

      return {
        success: true,
        message: 'パスワードリセットのメールを送信しました。メールをご確認ください',
        requestId: request.id,
      }

    } catch (error) {
      await this.logSecurityEvent('PASSWORD_RESET_ERROR', email, ipAddress, userAgent, {
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      
      return {
        success: false,
        message: 'リクエストの処理中にエラーが発生しました',
      }
    }
  }

  // トークンの検証
  async validateResetToken(token: string, requestId: string): Promise<{
    valid: boolean
    email?: string
    message: string
  }> {
    const request = this.resetRequests.get(requestId)

    if (!request) {
      return {
        valid: false,
        message: '無効なリセットリンクです',
      }
    }

    if (request.used) {
      return {
        valid: false,
        message: 'このリセットリンクは既に使用されています',
      }
    }

    if (request.expiresAt < new Date()) {
      await this.logSecurityEvent('PASSWORD_RESET_EXPIRED', request.email, undefined, undefined, {
        requestId,
        expiredAt: request.expiresAt,
      })
      
      return {
        valid: false,
        message: 'リセットリンクの有効期限が切れています',
      }
    }

    const tokenHash = this.hashToken(token)
    if (tokenHash !== request.tokenHash) {
      await this.logSecurityEvent('PASSWORD_RESET_INVALID_TOKEN', request.email, undefined, undefined, {
        requestId,
        attemptedToken: 'REDACTED',
      })
      
      return {
        valid: false,
        message: '無効なリセットリンクです',
      }
    }

    return {
      valid: true,
      email: request.email,
      message: 'トークンが有効です',
    }
  }

  // パスワードリセットの実行
  async executePasswordReset(
    token: string,
    requestId: string,
    newPassword: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<PasswordResetResult> {
    // トークン検証
    const validation = await this.validateResetToken(token, requestId)
    if (!validation.valid) {
      return {
        success: false,
        message: validation.message,
      }
    }

    const request = this.resetRequests.get(requestId)!
    
    try {
      // パスワード強度チェック（既存の検証ルールを使用）
      const passwordValidation = this.validatePasswordStrength(newPassword)
      if (!passwordValidation.valid) {
        return {
          success: false,
          message: passwordValidation.message,
        }
      }

      // リクエストを使用済みにマーク
      request.used = true

      // セキュリティログ記録
      await this.logSecurityEvent('PASSWORD_RESET_COMPLETED', request.email, ipAddress, userAgent, {
        requestId,
        completedAt: new Date(),
      })

      // 実際の実装では、ここでデータベースのパスワードを更新
      // await this.updateUserPassword(request.email, newPassword)

      return {
        success: true,
        message: 'パスワードが正常にリセットされました',
        requestId,
      }

    } catch (error) {
      await this.logSecurityEvent('PASSWORD_RESET_UPDATE_ERROR', request.email, ipAddress, userAgent, {
        requestId,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      
      return {
        success: false,
        message: 'パスワードの更新中にエラーが発生しました',
      }
    }
  }

  // レート制限チェック
  private checkRateLimit(email: string, ipAddress?: string): {
    allowed: boolean
    reason?: string
  } {
    const now = new Date()
    const oneHour = 60 * 60 * 1000

    // メールアドレス別の制限
    const emailRequests = Array.from(this.resetRequests.values()).filter(
      req => req.email === email && 
             req.createdAt.getTime() > now.getTime() - oneHour
    )

    if (emailRequests.length >= this.MAX_REQUESTS_PER_EMAIL) {
      return {
        allowed: false,
        reason: 'MAX_REQUESTS_PER_EMAIL_EXCEEDED',
      }
    }

    // IPアドレス別の制限
    if (ipAddress) {
      const ipRequests = Array.from(this.resetRequests.values()).filter(
        req => req.ipAddress === ipAddress && 
               req.createdAt.getTime() > now.getTime() - oneHour
      )

      if (ipRequests.length >= this.MAX_REQUESTS_PER_IP) {
        return {
          allowed: false,
          reason: 'MAX_REQUESTS_PER_IP_EXCEEDED',
        }
      }
    }

    return { allowed: true }
  }

  // セキュアトークンの生成
  private generateSecureToken(): string {
    return randomBytes(32).toString('hex')
  }

  // トークンのハッシュ化
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex')
  }

  // リクエストIDの生成
  private generateRequestId(): string {
    return `reset_${Date.now()}_${randomBytes(8).toString('hex')}`
  }

  // 既存のリクエストの無効化
  private invalidateExistingRequests(email: string): void {
    for (const [id, request] of this.resetRequests.entries()) {
      if (request.email === email && !request.used) {
        request.used = true
      }
    }
  }

  // パスワード強度検証
  private validatePasswordStrength(password: string): {
    valid: boolean
    message: string
  } {
    if (password.length < 8) {
      return {
        valid: false,
        message: 'パスワードは8文字以上である必要があります',
      }
    }

    const hasLowercase = /[a-z]/.test(password)
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecialChar = /[@$!%*?&]/.test(password)

    if (!hasLowercase || !hasUppercase || !hasNumber || !hasSpecialChar) {
      return {
        valid: false,
        message: 'パスワードは大文字・小文字・数字・特殊文字（@$!%*?&）を含む必要があります',
      }
    }

    return {
      valid: true,
      message: 'パスワードは有効です',
    }
  }

  // セキュリティイベントのログ記録
  private async logSecurityEvent(
    eventType: string,
    email: string,
    ipAddress?: string,
    userAgent?: string,
    details: any = {}
  ): Promise<void> {
    const securityEventType = eventType as any // 型の制限を回避
    const severity = eventType.includes('ERROR') || eventType.includes('INVALID') 
      ? SecurityEventSeverity.HIGH 
      : SecurityEventSeverity.LOW

    await logSecurityEvent({
      type: securityEventType,
      severity,
      ipAddress,
      userAgent,
      details: {
        email,
        ...details,
      },
    })
  }

  // メール送信（実装予定）
  private async sendResetEmail(email: string, token: string, requestId: string): Promise<void> {
    // 実際の実装では、メール送信サービスを使用
    console.log(`パスワードリセットメール送信:
      To: ${email}
      Reset Link: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}&id=${requestId}
      有効期限: ${this.TOKEN_EXPIRY_HOURS}時間
    `)
  }

  // 定期クリーンアップ
  private startPeriodicCleanup(): void {
    setInterval(() => {
      const now = new Date()
      
      for (const [id, request] of this.resetRequests.entries()) {
        // 期限切れまたは使用済みのリクエストを削除
        if (request.expiresAt < now || request.used) {
          this.resetRequests.delete(id)
        }
      }
    }, 30 * 60 * 1000) // 30分ごとに実行
  }

  // 統計情報取得
  getResetStatistics(): {
    totalRequests: number
    activeRequests: number
    expiredRequests: number
    usedRequests: number
    recentRequests: PasswordResetRequest[]
  } {
    const now = new Date()
    const requests = Array.from(this.resetRequests.values())
    
    return {
      totalRequests: requests.length,
      activeRequests: requests.filter(r => !r.used && r.expiresAt > now).length,
      expiredRequests: requests.filter(r => !r.used && r.expiresAt <= now).length,
      usedRequests: requests.filter(r => r.used).length,
      recentRequests: requests
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 10),
    }
  }
}

// シングルトンインスタンス
export const passwordResetManager = new PasswordResetManager()

// 便利なヘルパー関数
export const createPasswordResetRequest = passwordResetManager.createResetRequest.bind(passwordResetManager)
export const validatePasswordResetToken = passwordResetManager.validateResetToken.bind(passwordResetManager)
export const executePasswordReset = passwordResetManager.executePasswordReset.bind(passwordResetManager)
export const getPasswordResetStatistics = passwordResetManager.getResetStatistics.bind(passwordResetManager)