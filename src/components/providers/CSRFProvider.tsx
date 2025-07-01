'use client'

import { useCSRF } from '@/hooks/useCSRF'

export default function CSRFProvider({ children }: { children: React.ReactNode }) {
  useCSRF()
  return <>{children}</>
}