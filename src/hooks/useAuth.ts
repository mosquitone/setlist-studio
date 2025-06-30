import { useState, useEffect } from 'react'
import { TokenManager, createStorageListener } from '../lib/auth-utils'

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoggedIn(TokenManager.isValid())
    setIsLoading(false)

    const cleanup = createStorageListener(token => {
      setIsLoggedIn(!!token)
    })

    return cleanup
  }, [])

  const login = (token: string) => {
    TokenManager.set(token)
    setIsLoggedIn(true)
  }

  const logout = () => {
    TokenManager.remove()
    setIsLoggedIn(false)
    window.location.reload()
  }

  return { isLoggedIn, isLoading, login, logout }
}
