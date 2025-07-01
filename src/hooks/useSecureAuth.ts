import { useState, useEffect } from 'react'
import { secureAuthClient, AuthState, User } from '../lib/secure-auth-client'

export interface UseSecureAuthReturn {
  user: User | null
  authenticated: boolean
  loading: boolean
  login: (token: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export function useSecureAuth(): UseSecureAuthReturn {
  const [authState, setAuthState] = useState<AuthState>(() => secureAuthClient.getState())

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = secureAuthClient.subscribe((newState) => {
      setAuthState(newState)
    })

    // Initial auth check if not already done
    if (authState.loading) {
      secureAuthClient.checkAuthStatus()
    }

    return unsubscribe
  }, [])

  const login = async (token: string) => {
    return await secureAuthClient.login(token)
  }

  const logout = async () => {
    await secureAuthClient.logout()
  }

  const checkAuth = async () => {
    await secureAuthClient.checkAuthStatus()
  }

  return {
    user: authState.user,
    authenticated: authState.authenticated,
    loading: authState.loading,
    login,
    logout,
    checkAuth,
  }
}