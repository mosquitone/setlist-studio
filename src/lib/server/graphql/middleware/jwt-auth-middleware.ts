import { MiddlewareFn } from 'type-graphql'
import jwt from 'jsonwebtoken'

interface Context {
  req: {
    cookies: {
      [key: string]: string
    }
    headers: {
      [key: string]: string
    }
  }
  prisma: any
  userId?: string
}

export const AuthMiddleware: MiddlewareFn<Context> = async ({ context }, next) => {
  // 安全性チェック：cookiesオブジェクトの存在確認
  if (!context.req || !context.req.cookies) {
    console.error('AuthMiddleware: req.cookies is undefined')
    throw new Error('Not authenticated')
  }

  // HttpOnly Cookieから認証トークンを取得
  const token = context.req.cookies.auth_token

  if (!token) {
    throw new Error('Not authenticated')
  }

  try {
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not configured')
    }
    const payload = jwt.verify(token, jwtSecret) as { userId: string }
    context.userId = payload.userId
  } catch (error) {
    console.error('AuthMiddleware: JWT verification failed:', error)
    throw new Error('Not authenticated')
  }

  return next()
}
