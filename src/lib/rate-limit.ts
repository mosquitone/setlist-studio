import { NextRequest, NextResponse } from 'next/server'
import { logRateLimitExceeded } from './security-logger'
import { generateRateLimitKey } from './security-utils'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

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

    const now = Date.now()
    const resetTime = now + windowMs

    // Clean up expired entries
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

    // Check if rate limit exceeded
    if (store[rateLimitKey].count > maxRequests) {
      // レート制限違反をログに記録
      logRateLimitExceeded(rateLimitKey, request.url, request.headers.get('user-agent') || undefined)
      
      return NextResponse.json(
        { 
          error: message,
          retryAfter: Math.ceil((store[rateLimitKey].resetTime - now) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((store[rateLimitKey].resetTime - now) / 1000).toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(store[rateLimitKey].resetTime / 1000).toString(),
          }
        }
      )
    }

    // Add rate limit headers
    const remaining = Math.max(0, maxRequests - store[rateLimitKey].count)
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    response.headers.set('X-RateLimit-Reset', Math.ceil(store[rateLimitKey].resetTime / 1000).toString())

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