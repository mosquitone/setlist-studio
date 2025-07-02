import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthPayload, RegisterInput, LoginInput } from '../types/Auth';
import {
  logAuthSuccessDB,
  logAuthFailureDB,
  SecurityEventType,
  SecurityEventSeverity,
  logSecurityEventDB,
} from '../../../security/security-logger-db';
import { DatabaseThreatDetection } from '../../../security/threat-detection-db';
// import { createPasswordResetRequest, executePasswordReset } from '../../password-reset' // 削除済み

interface Context {
  prisma: PrismaClient;
  req?: {
    headers: {
      authorization?: string;
      'user-agent'?: string;
      'x-forwarded-for'?: string;
      'x-real-ip'?: string;
    };
  };
}

// IP address extraction helper
function getClientIP(context: Context): string | undefined {
  const headers = context.req?.headers;
  if (!headers) return undefined;

  return headers['x-forwarded-for']?.split(',')[0] || headers['x-real-ip'] || 'unknown';
}

@Resolver()
export class AuthResolver {
  @Mutation(() => AuthPayload)
  async register(@Arg('input') input: RegisterInput, @Ctx() ctx: Context): Promise<AuthPayload> {
    const existingUser = await ctx.prisma.user.findFirst({
      where: {
        OR: [{ email: input.email }, { username: input.username }],
      },
    });

    if (existingUser) {
      // 登録失敗をログに記録（データベースベース）
      await logSecurityEventDB(ctx.prisma, {
        type: SecurityEventType.REGISTER_FAILURE,
        severity: SecurityEventSeverity.MEDIUM,
        ipAddress: getClientIP(ctx),
        userAgent: ctx.req?.headers['user-agent'],
        details: {
          email: input.email,
          username: input.username,
          reason: 'user_already_exists',
        },
      });
      throw new Error('登録に失敗しました。入力内容を確認してください');
    }

    const hashedPassword = await bcrypt.hash(input.password, 12);

    const user = await ctx.prisma.user.create({
      data: {
        email: input.email,
        username: input.username,
        password: hashedPassword,
      },
    });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not configured');
    }
    const token = jwt.sign({ userId: user.id }, jwtSecret, {
      expiresIn: '7d',
    });

    // 登録成功をログに記録（データベースベース）
    await logSecurityEventDB(ctx.prisma, {
      type: SecurityEventType.REGISTER_SUCCESS,
      severity: SecurityEventSeverity.LOW,
      userId: user.id,
      ipAddress: getClientIP(ctx),
      userAgent: ctx.req?.headers['user-agent'],
      details: {
        email: user.email,
        username: user.username,
      },
    });

    return {
      token,
      user,
    };
  }

  @Mutation(() => AuthPayload)
  async login(@Arg('input') input: LoginInput, @Ctx() ctx: Context): Promise<AuthPayload> {
    const user = await ctx.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      // ログイン失敗をログに記録（データベースベース）
      await logAuthFailureDB(
        ctx.prisma,
        input.email,
        'user_not_found',
        getClientIP(ctx),
        ctx.req?.headers?.['user-agent'] || 'unknown',
      );

      // 脅威検知分析（データベースベース）
      const threatDetection = new DatabaseThreatDetection(ctx.prisma);
      await threatDetection.analyzeLoginAttempt(
        input.email,
        false,
        getClientIP(ctx),
        ctx.req?.headers?.['user-agent'] || 'unknown',
      );

      throw new Error('メールアドレスまたはパスワードが正しくありません');
    }

    const isValidPassword = await bcrypt.compare(input.password, user.password);
    if (!isValidPassword) {
      // パスワード不正をログに記録（データベースベース）
      await logAuthFailureDB(
        ctx.prisma,
        input.email,
        'invalid_password',
        getClientIP(ctx),
        ctx.req?.headers?.['user-agent'] || 'unknown',
      );

      // 脅威検知分析（データベースベース）
      const threatDetection = new DatabaseThreatDetection(ctx.prisma);
      await threatDetection.analyzeLoginAttempt(
        input.email,
        false,
        getClientIP(ctx),
        ctx.req?.headers?.['user-agent'] || 'unknown',
      );

      throw new Error('メールアドレスまたはパスワードが正しくありません');
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not configured');
    }
    const token = jwt.sign({ userId: user.id }, jwtSecret, {
      expiresIn: '7d',
    });

    // ログイン成功をログに記録（データベースベース）
    await logAuthSuccessDB(ctx.prisma, user.id, getClientIP(ctx), ctx.req?.headers['user-agent']);

    // 成功時の脅威検知分析（異常なパターンがないかチェック）
    const threatDetection = new DatabaseThreatDetection(ctx.prisma);
    await threatDetection.analyzeLoginAttempt(
      input.email,
      true,
      getClientIP(ctx),
      ctx.req?.headers['user-agent'],
    );

    return {
      token,
      user,
    };
  }

  // パスワードリセット機能（将来実装予定）
  /*
  @Mutation(() => PasswordResetResponse)
  async requestPasswordReset(
    @Arg('input') input: PasswordResetRequestInput,
    @Ctx() ctx: Context
  ): Promise<PasswordResetResponse> {
    // TODO: パスワードリセット機能の実装
    return {
      success: false,
      message: 'パスワードリセット機能は現在実装中です',
      requestId: '',
    }
  }

  @Mutation(() => PasswordResetResponse)
  async resetPassword(
    @Arg('input') input: PasswordResetInput,
    @Ctx() ctx: Context
  ): Promise<PasswordResetResponse> {
    // TODO: パスワードリセット機能の実装
    return {
      success: false,
      message: 'パスワードリセット機能は現在実装中です',
      requestId: '',
    }
  }
  */
}
