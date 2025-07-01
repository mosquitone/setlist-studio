import { useState, useEffect } from 'react'
import { secureAuthClient, User } from '../lib/client/secure-auth-client'

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // 既存の認証状態を取得（重複APIコールを避けるため）
    const currentState = secureAuthClient.getState()
    setIsLoggedIn(currentState.authenticated)
    setUser(currentState.user)
    setIsLoading(currentState.loading)

    // 認証状態の変更をリッスン
    const unsubscribe = secureAuthClient.subscribe(authState => {
      setIsLoggedIn(authState.authenticated)
      setUser(authState.user)
      setIsLoading(authState.loading)
    })

    return unsubscribe
  }, [])

  const login = async (token: string, userData: User) => {
    const result = await secureAuthClient.login(token)
    if (result.success) {
      setIsLoggedIn(true)
      setUser(result.user || userData)
    }
    return result
  }

  const logout = async () => {
    await secureAuthClient.logout()
    setIsLoggedIn(false)
    setUser(null)
    window.location.reload()
  }

  return { isLoggedIn, isLoading, user, login, logout }
}
