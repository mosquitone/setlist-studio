import { useState, useEffect } from 'react'

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      try {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token')
          setIsLoggedIn(!!token)
        }
      } catch {
        setIsLoggedIn(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    if (typeof window !== 'undefined') {
      const handleStorageChange = () => checkAuth()
      window.addEventListener('storage', handleStorageChange)
      return () => window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    window.location.reload()
  }

  return { isLoggedIn, isLoading, logout }
}
