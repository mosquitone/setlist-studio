import { Resolver, Mutation, Arg, Ctx } from 'type-graphql'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AuthPayload, RegisterInput, LoginInput, PasswordResetRequestInput, PasswordResetInput, PasswordResetResponse } from '../types/Auth'
import { logAuthSuccess, logAuthFailure, SecurityEventType, SecurityEventSeverity, logSecurityEvent } from '../../security-logger'
import { analyzeLoginAttempt } from '../../threat-detection'
import { createPasswordResetRequest, executePasswordReset } from '../../password-reset'

interface Context {
  prisma: PrismaClient
  req?: {
    headers: {
      authorization?: string
      'user-agent'?: string
      'x-forwarded-for'?: string
      'x-real-ip'?: string
    }
  }
}

// IP address extraction helper
function getClientIP(context: Context): string | undefined {
  const headers = context.req?.headers
  if (!headers) return undefined
  
  return headers['x-forwarded-for']?.split(',')[0] || 
         headers['x-real-ip'] || 
         'unknown'
}

@Resolver()
export class AuthResolver {
  @Mutation(() => AuthPayload)
  async register(@Arg('input') input: RegisterInput, @Ctx() ctx: Context): Promise<AuthPayload> {
    const existingUser = await ctx.prisma.user.findFirst({
      where: {
        OR: [{ email: input.email }, { username: input.username }],
      },
    })

    if (existingUser) {
      // 登録失敗をログに記録
      await logSecurityEvent({
        type: SecurityEventType.REGISTER_FAILURE,
        severity: SecurityEventSeverity.MEDIUM,
        ipAddress: getClientIP(ctx),
        userAgent: ctx.req?.headers['user-agent'],
        details: { 
          email: input.email,
          username: input.username,
          reason: 'user_already_exists'
        },
      })
      throw new Error('登録に失敗しました。入力内容を確認してください')
    }

    const hashedPassword = await bcrypt.hash(input.password, 12)

    const user = await ctx.prisma.user.create({
      data: {
        email: input.email,
        username: input.username,
        password: hashedPassword,
      },
    })

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not configured')
    }
    const token = jwt.sign({ userId: user.id }, jwtSecret, {
      expiresIn: '7d',
    })

    // 登録成功をログに記録
    await logSecurityEvent({
      type: SecurityEventType.REGISTER_SUCCESS,
      severity: SecurityEventSeverity.LOW,
      userId: user.id,
      ipAddress: getClientIP(ctx),
      userAgent: ctx.req?.headers['user-agent'],
      details: { 
        email: user.email,
        username: user.username
      },
    })

    return {
      token,
      user,
    }
  }

  @Mutation(() => AuthPayload)
  async login(@Arg('input') input: LoginInput, @Ctx() ctx: Context): Promise<AuthPayload> {
    const user = await ctx.prisma.user.findUnique({
      where: { email: input.email },
    })

    if (!user) {
      // ログイン失敗をログに記録
      await logAuthFailure(input.email, 'user_not_found', getClientIP(ctx), ctx.req?.headers['user-agent'])
      
      // 脅威検知分析
      const threats = analyzeLoginAttempt(
        input.email,
        false,
        getClientIP(ctx),
        ctx.req?.headers['user-agent']
      )
      
      throw new Error('メールアドレスまたはパスワードが正しくありません')
    }

    const isValidPassword = await bcrypt.compare(input.password, user.password)
    if (!isValidPassword) {
      // パスワード不正をログに記録
      await logAuthFailure(input.email, 'invalid_password', getClientIP(ctx), ctx.req?.headers['user-agent'])
      
      // 脅威検知分析
      const threats = analyzeLoginAttempt(
        input.email,
        false,
        getClientIP(ctx),
        ctx.req?.headers['user-agent']
      )
      
      throw new Error('メールアドレスまたはパスワードが正しくありません')
    }

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not configured')
    }
    const token = jwt.sign({ userId: user.id }, jwtSecret, {
      expiresIn: '7d',
    })

    // ログイン成功をログに記録
    await logAuthSuccess(user.id, getClientIP(ctx), ctx.req?.headers['user-agent'])
    
    // 成功時の脅威検知分析（異常なパターンがないかチェック）
    const threats = analyzeLoginAttempt(
      input.email,
      true,
      getClientIP(ctx),
      ctx.req?.headers['user-agent']
    )

    return {
      token,
      user,
    }
  }

  @Mutation(() => PasswordResetResponse)
  async requestPasswordReset(
    @Arg('input') input: PasswordResetRequestInput,
    @Ctx() ctx: Context
  ): Promise<PasswordResetResponse> {
    const result = await createPasswordResetRequest(
      input.email,
      getClientIP(ctx),
      ctx.req?.headers['user-agent']
    )

    return {
      success: result.success,
      message: result.message,
      requestId: result.requestId,
    }
  }

  @Mutation(() => PasswordResetResponse)
  async resetPassword(
    @Arg('input') input: PasswordResetInput,
    @Ctx() ctx: Context
  ): Promise<PasswordResetResponse> {
    const result = await executePasswordReset(
      input.token,
      input.requestId,
      input.newPassword,
      getClientIP(ctx),
      ctx.req?.headers['user-agent']
    )

    if (result.success) {
      // 実際にパスワードを更新する処理
      // パスワードリセット機能を使用する場合は、以下のコメントアウトを外してください
      /*
      const hashedPassword = await bcrypt.hash(input.newPassword, 12)
      await ctx.prisma.user.update({
        where: { email: validation.email },
        data: { password: hashedPassword }
      })
      */
    }

    return {
      success: result.success,
      message: result.message,
      requestId: result.requestId,
    }
  }
}
