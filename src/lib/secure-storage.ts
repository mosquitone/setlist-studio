// セキュアなトークン管理ユーティリティ

export interface TokenStorage {
  getToken(): string | null
  setToken(token: string): void
  removeToken(): void
}

// 現在のlocalStorage実装（後方互換性のため）
export class LocalStorageTokenManager implements TokenStorage {
  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
  }

  setToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('token', token)
  }

  removeToken(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('token')
  }
}

// セキュアCookie実装（将来的な移行用）
export class SecureCookieTokenManager implements TokenStorage {
  private readonly cookieName = 'auth_token'

  getToken(): string | null {
    if (typeof window === 'undefined') return null
    
    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name === this.cookieName) {
        return decodeURIComponent(value)
      }
    }
    
    return null
  }

  setToken(token: string): void {
    if (typeof window === 'undefined') return
    
    // HttpOnly Cookieはサーバーサイドでのみ設定可能
    // クライアントサイドでは一時的にJavaScriptアクセス可能なCookieを使用
    const expires = new Date()
    expires.setDate(expires.getDate() + 7) // 7日間有効
    
    document.cookie = `${this.cookieName}=${encodeURIComponent(token)}; ` +
                     `expires=${expires.toUTCString()}; ` +
                     `path=/; ` +
                     `${window.location.protocol === 'https:' ? 'secure; ' : ''}` +
                     `samesite=strict`
  }

  removeToken(): void {
    if (typeof window === 'undefined') return
    
    document.cookie = `${this.cookieName}=; ` +
                     `expires=Thu, 01 Jan 1970 00:00:00 UTC; ` +
                     `path=/`
  }
}

// 設定可能なトークン管理システム
class TokenManager {
  private storage: TokenStorage

  constructor() {
    // 環境変数やフィーチャーフラグに基づいて選択
    // 現在はlocalStorageを使用、将来的にはCookieに移行可能
    this.storage = new LocalStorageTokenManager()
  }

  // ストレージタイプを切り替える（デバッグ・テスト用）
  setStorageType(type: 'localStorage' | 'secureCookie'): void {
    switch (type) {
      case 'localStorage':
        this.storage = new LocalStorageTokenManager()
        break
      case 'secureCookie':
        this.storage = new SecureCookieTokenManager()
        break
    }
  }

  getToken(): string | null {
    return this.storage.getToken()
  }

  setToken(token: string): void {
    this.storage.setToken(token)
  }

  removeToken(): void {
    this.storage.removeToken()
  }
}

// シングルトンインスタンス
export const tokenManager = new TokenManager()

// 既存コードとの互換性のためのエクスポート
export const TokenManagerCompat = {
  get: () => tokenManager.getToken(),
  set: (token: string) => tokenManager.setToken(token),
  remove: () => tokenManager.removeToken(),
}

// セキュリティレベル評価用の関数
export function getSecurityInfo(): {
  storageType: string
  isSecure: boolean
  recommendations: string[]
} {
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:'
  const recommendations: string[] = []
  
  if (!isHttps) {
    recommendations.push('HTTPS環境での運用を推奨します')
  }
  
  recommendations.push('本格的な本番運用時はHttpOnly Cookieの実装を検討してください')
  
  return {
    storageType: 'localStorage (with Cookie migration ready)',
    isSecure: isHttps,
    recommendations,
  }
}