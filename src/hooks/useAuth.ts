import { useState, useEffect } from 'react'
import {
  TokenManager,
  UserManager,
  createStorageListener,
  createUserStorageListener,
  User,
} from '../lib/auth-utils'

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setIsLoggedIn(TokenManager.isValid())
    setUser(UserManager.get())
    setIsLoading(false)

    const tokenCleanup = createStorageListener(token => {
      setIsLoggedIn(!!token)
    })

    const userCleanup = createUserStorageListener(userData => {
      setUser(userData)
    })

    return () => {
      tokenCleanup()
      userCleanup()
    }
  }, [])

  const login = (token: string, userData: User) => {
    TokenManager.set(token)
    UserManager.set(userData)
    setIsLoggedIn(true)
    setUser(userData)
  }

  const logout = () => {
    TokenManager.remove()
    UserManager.remove()
    setIsLoggedIn(false)
    setUser(null)
    window.location.reload()
  }

  return { isLoggedIn, isLoading, user, login, logout }
}
