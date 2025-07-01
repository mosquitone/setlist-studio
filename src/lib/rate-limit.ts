import { NextRequest, NextResponse } from 'next/server'
import { logRateLimitExceeded } from './security-logger'
import { generateRateLimitKey } from './security-utils'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
    mutex?: boolean // Race condition防止用のミューテックス
  }
}

const store: RateLimitStore = {}

// Race condition防止のための非同期ミューテックス
const mutexes = new Map<string, Promise<void>>()

async function withMutex<T>(key: string, operation: () => T | Promise<T>): Promise<T> {
  // 既存のミューテックスがある場合は待機
  while (mutexes.has(key)) {
    await mutexes.get(key)
  }
  
  // 新しいミューテックスを作成
  let resolve: () => void
  const mutex = new Promise<void>((res) => {
    resolve = res
  })
  mutexes.set(key, mutex)
  
  try {
    const result = await operation()
    return result
  } finally {
    // ミューテックスを解放
    mutexes.delete(key)
    resolve!()
  }
}

interface RateLimitOptions {
  windowMs: number
  maxRequests: number
  message?: string
}

export function rateLimit(options: RateLimitOptions) {
  const { windowMs, maxRequests, message = 'Too many requests' } = options

  return async (request: NextRequest): Promise<NextResponse | null> => {
    // Generate secure rate limit key (IP + User-Agent hash)
    const rateLimitKey = generateRateLimitKey(request)

    // Race condition防止：ミューテックスを使用してアトミックな操作を保証
    const result = await withMutex(rateLimitKey, () => {
      const now = Date.now()
      const resetTime = now + windowMs

      // Clean up expired entries (バックグラウンドタスクに移すべき)
      Object.keys(store).forEach(key => {
        if (store[key].resetTime < now) {
          delete store[key]
        }
      })

      // Initialize or update rate limit data
      if (!store[rateLimitKey]) {
        store[rateLimitKey] = {
          count: 1,
          resetTime,
        }
      } else if (store[rateLimitKey].resetTime < now) {
        store[rateLimitKey] = {
          count: 1,
          resetTime,
        }
      } else {
        store[rateLimitKey].count++
      }

      // 現在のカウントを返す
      return {
        count: store[rateLimitKey].count,
        resetTime: store[rateLimitKey].resetTime,
        exceeded: store[rateLimitKey].count > maxRequests
      }
    })

    // Check if rate limit exceeded
    if (result.exceeded) {
      // レート制限違反をログに記録
      logRateLimitExceeded(rateLimitKey, request.url, request.headers.get('user-agent') || undefined)
      
      const now = Date.now()
      return NextResponse.json(
        { 
          error: message,
          retryAfter: Math.ceil((result.resetTime - now) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((result.resetTime - now) / 1000).toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
          }
        }
      )
    }

    // Add rate limit headers
    const remaining = Math.max(0, maxRequests - result.count)
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    response.headers.set('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000).toString())

    return null // Allow request to continue
  }
}

// プリセット設定
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  maxRequests: 5, // 認証試行回数制限
  message: '認証試行回数が上限に達しました。しばらく時間をおいてから再試行してください'
})

export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1分
  maxRequests: 60, // 一般API制限
  message: 'リクエスト数が上限に達しました。しばらく時間をおいてから再試行してください'
})