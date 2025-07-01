import { NextRequest, NextResponse } from 'next/server'
import { logRateLimitExceeded } from './security-logger'

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
    // Get client IP address
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ip = forwarded?.split(',')[0] ?? realIp ?? 'unknown'

    const now = Date.now()
    const resetTime = now + windowMs

    // Clean up expired entries
    Object.keys(store).forEach(key => {
      if (store[key].resetTime < now) {
        delete store[key]
      }
    })

    // Initialize or update rate limit data
    if (!store[ip]) {
      store[ip] = {
        count: 1,
        resetTime,
      }
    } else if (store[ip].resetTime < now) {
      store[ip] = {
        count: 1,
        resetTime,
      }
    } else {
      store[ip].count++
    }

    // Check if rate limit exceeded
    if (store[ip].count > maxRequests) {
      // レート制限違反をログに記録
      logRateLimitExceeded(ip, request.url, request.headers.get('user-agent') || undefined)
      
      return NextResponse.json(
        { 
          error: message,
          retryAfter: Math.ceil((store[ip].resetTime - now) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((store[ip].resetTime - now) / 1000).toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(store[ip].resetTime / 1000).toString(),
          }
        }
      )
    }

    // Add rate limit headers
    const remaining = Math.max(0, maxRequests - store[ip].count)
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    response.headers.set('X-RateLimit-Reset', Math.ceil(store[ip].resetTime / 1000).toString())

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