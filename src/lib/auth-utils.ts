export interface User {
  id: string
  email: string
  username: string
  createdAt: string
  updatedAt: string
}

export const TokenManager = {
  get: (): string | null => {
    if (typeof window === 'undefined') return null
    try {
      return localStorage.getItem('token')
    } catch {
      return null
    }
  },

  set: (token: string): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem('token', token)
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'token',
          newValue: token,
          storageArea: localStorage,
        }),
      )
    } catch {
      // Handle storage errors silently
    }
  },

  remove: (): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem('token')
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'token',
          newValue: null,
          storageArea: localStorage,
        }),
      )
    } catch {
      // Handle storage errors silently
    }
  },

  isValid: (): boolean => {
    return !!TokenManager.get()
  },
}

export const UserManager = {
  get: (): User | null => {
    if (typeof window === 'undefined') return null
    try {
      const userData = localStorage.getItem('user')
      return userData ? JSON.parse(userData) : null
    } catch {
      return null
    }
  },

  set: (user: User): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem('user', JSON.stringify(user))
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'user',
          newValue: JSON.stringify(user),
          storageArea: localStorage,
        }),
      )
    } catch {
      // Handle storage errors silently
    }
  },

  remove: (): void => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem('user')
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'user',
          newValue: null,
          storageArea: localStorage,
        }),
      )
    } catch {
      // Handle storage errors silently
    }
  },
}

export const createStorageListener = (callback: (token: string | null) => void) => {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'token') {
      callback(e.newValue)
    }
  }

  window.addEventListener('storage', handleStorage)
  return () => window.removeEventListener('storage', handleStorage)
}

export const createUserStorageListener = (callback: (user: User | null) => void) => {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'user') {
      try {
        const user = e.newValue ? JSON.parse(e.newValue) : null
        callback(user)
      } catch {
        callback(null)
      }
    }
  }

  window.addEventListener('storage', handleStorage)
  return () => window.removeEventListener('storage', handleStorage)
}
