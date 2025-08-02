import { useEffect } from 'react';

import { env } from '@/lib/config/environment';

export function useCSRF() {
  useEffect(() => {
    // Initialize CSRF token on app start
    const initializeCSRF = async () => {
      try {
        await fetch('/api/csrf', {
          method: 'GET',
          credentials: 'include',
        });
      } catch (error) {
        if (env.isDevelopment) {
          console.warn('Failed to initialize CSRF token:', error);
        }
      }
    };

    // Only initialize if we don't already have a token
    if (typeof window !== 'undefined') {
      const hasToken = document.cookie.includes('csrf_token=');
      if (!hasToken) {
        initializeCSRF();
      }
    }
  }, []);
}
