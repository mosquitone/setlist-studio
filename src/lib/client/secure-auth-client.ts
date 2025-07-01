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

      // 認証状態をクリア
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

}

// シングルトンインスタンス
export const secureAuthClient = new SecureAuthClient()

