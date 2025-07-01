// セキュアな認証クライアント（HttpOnly Cookie使用）

export interface User {
  id: string
  email: string
  username: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
}

export interface AuthState {
  authenticated: boolean
  user: User | null
  loading: boolean
}

class SecureAuthClient {
  private listeners: Array<(state: AuthState) => void> = []
  private currentState: AuthState = {
    authenticated: false,
    user: null,
    loading: true,
  }

  constructor() {
    // 初期化時に認証状態をチェック
    this.checkAuthStatus()
  }

  // 認証状態の確認
  async checkAuthStatus(): Promise<AuthState> {
    try {
      const response = await fetch('/api/auth', {
        credentials: 'include', // HttpOnly Cookieを含める
      })

      if (response.ok) {
        const data = await response.json()
        this.updateState({
          authenticated: data.authenticated,
          user: data.user || null,
          loading: false,
        })
      } else {
        this.updateState({
          authenticated: false,
          user: null,
          loading: false,
        })
      }
    } catch (error) {
      console.error('Auth status check failed:', error)
      this.updateState({
        authenticated: false,
        user: null,
        loading: false,
      })
    }

    return this.currentState
  }

  // ログイン（JWT トークンをHttpOnly Cookieに移行）
  async login(token: string): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        this.updateState({
          authenticated: true,
          user: data.user,
          loading: false,
        })

        return { success: true, user: data.user }
      } else {
        return { success: false, error: data.error || 'Login failed' }
      }
    } catch (error) {
      console.error('Login failed:', error)
      return { success: false, error: 'Network error' }
    }
  }

  // ログアウト
  async logout(): Promise<void> {
    try {
      await fetch('/api/auth', {
        method: 'DELETE',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout request failed:', error)
    }

    // ローカル状態を更新
    this.updateState({
      authenticated: false,
      user: null,
      loading: false,
    })

    // レガシーのlocalStorageもクリア
    this.clearLegacyStorage()
  }

  // 状態の更新とリスナーへの通知
  private updateState(newState: AuthState): void {
    this.currentState = { ...newState }
    this.listeners.forEach(listener => listener(this.currentState))
  }

  // 状態変更リスナーの登録
  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener)
    // 現在の状態を即座に通知
    listener(this.currentState)

    // アンサブスクライブ関数を返す
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  // 現在の状態を取得
  getState(): AuthState {
    return { ...this.currentState }
  }

  // レガシーlocalStorageのクリア
  private clearLegacyStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      } catch (error) {
        console.warn('Failed to clear legacy storage:', error)
      }
    }
  }

  // localStorage から HttpOnly Cookie への移行
  async migrateLegacyAuth(): Promise<void> {
    if (typeof window === 'undefined') return

    try {
      const legacyToken = localStorage.getItem('token')
      if (legacyToken) {
        console.log('Migrating legacy token to secure cookie...')
        const result = await this.login(legacyToken)

        if (result.success) {
          // 成功した場合、legacyストレージをクリア
          this.clearLegacyStorage()
          console.log('Legacy token migration completed successfully')
        } else {
          console.warn('Legacy token migration failed:', result.error)
          // 無効なトークンの場合はクリア
          this.clearLegacyStorage()
        }
      }
    } catch (error) {
      console.error('Legacy token migration error:', error)
      this.clearLegacyStorage()
    }
  }
}

// シングルトンインスタンス
export const secureAuthClient = new SecureAuthClient()

// React Hook用のヘルパー
export function useSecureAuth(): [AuthState, typeof secureAuthClient] {
  // Note: 実際のReact Hookの実装は別ファイルで行う
  // ここでは型定義とクライアント参照のみ提供
  return [secureAuthClient.getState(), secureAuthClient]
}

// 既存コードからの移行用互換性レイヤー
export const TokenManagerSecure = {
  get: (): string | null => {
    console.warn('TokenManagerSecure.get() is deprecated. Use secureAuthClient instead.')
    return null // HttpOnly Cookieはクライアントサイドで読み取り不可
  },

  set: async (token: string): Promise<boolean> => {
    console.warn('TokenManagerSecure.set() is deprecated. Use secureAuthClient.login() instead.')
    const result = await secureAuthClient.login(token)
    return result.success
  },

  remove: async (): Promise<void> => {
    console.warn(
      'TokenManagerSecure.remove() is deprecated. Use secureAuthClient.logout() instead.',
    )
    await secureAuthClient.logout()
  },

  isValid: (): boolean => {
    console.warn(
      'TokenManagerSecure.isValid() is deprecated. Use secureAuthClient.getState() instead.',
    )
    return secureAuthClient.getState().authenticated
  },
}

// 初期化：レガシートークンの移行を自動実行
if (typeof window !== 'undefined') {
  // ページロード時に自動移行を実行
  secureAuthClient.migrateLegacyAuth()
}
