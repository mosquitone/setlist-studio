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
