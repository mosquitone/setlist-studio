import { MiddlewareFn } from 'type-graphql'
import jwt from 'jsonwebtoken'

interface Context {
  req: {
    headers: {
      authorization?: string
    }
  }
  userId?: string
}

export const AuthMiddleware: MiddlewareFn<Context> = async ({ context }, next) => {
  const authorization = context.req.headers.authorization

  if (!authorization) {
    throw new Error('Not authenticated')
  }

  try {
    const token = authorization.replace('Bearer ', '')
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not configured')
    }
    const payload = jwt.verify(token, jwtSecret) as { userId: string }
    context.userId = payload.userId
  } catch {
    throw new Error('Not authenticated')
  }

  return next()
}
