import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { 
  AuthPayload, 
  RegisterInput, 
  LoginInput,
  PasswordResetRequestInput,
  PasswordResetInput,
  PasswordResetResponse,
  EmailVerificationInput,
  EmailVerificationResponse,
  EmailChangeInput,
  EmailChangeResponse,
  EmailChangeConfirmInput
} from '../types/Auth';
import {
  logAuthSuccessDB,
  logAuthFailureDB,
  SecurityEventType,
  SecurityEventSeverity,
  logSecurityEventDB,
} from '../../../security/security-logger-db';
import { DatabaseThreatDetection } from '../../../security/threat-detection-db';
import { emailService } from '../../email/emailService';
import crypto from 'crypto';

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
  /**
   * 新規ユーザー登録
   * @param input - 登録用入力データ（email, username, password）
   * @param ctx - GraphQLコンテキスト
   * @returns 認証トークンとユーザー情報
   */
  @Mutation(() => AuthPayload)
  async register(
    @Arg('input', () => RegisterInput) input: RegisterInput,
    @Ctx() ctx: Context,
  ): Promise<AuthPayload> {
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
      throw new Error('サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。');
    }
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
      },
      jwtSecret,
      {
        expiresIn: '2h',
      },
    );

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

  /**
   * ユーザーログイン認証
   * @param input - ログイン用入力データ（email, password）
   * @param ctx - GraphQLコンテキスト
   * @returns 認証トークンとユーザー情報
   */
  @Mutation(() => AuthPayload)
  async login(
    @Arg('input', () => LoginInput) input: LoginInput,
    @Ctx() ctx: Context,
  ): Promise<AuthPayload> {
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
      throw new Error('サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。');
    }
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        username: user.username,
      },
      jwtSecret,
      {
        expiresIn: '2h',
      },
    );

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

  /**
   * パスワードリセットメール送信をリクエスト
   */
  @Mutation(() => PasswordResetResponse)
  async requestPasswordReset(
    @Arg('input') input: PasswordResetRequestInput,
    @Ctx() ctx: Context
  ): Promise<PasswordResetResponse> {
    const user = await ctx.prisma.user.findUnique({
      where: { email: input.email },
    });

    // ユーザーが存在しない場合でもセキュリティ上同じメッセージを返す
    if (!user) {
      await logSecurityEventDB(ctx.prisma, {
        type: SecurityEventType.PASSWORD_RESET_REQUEST,
        severity: SecurityEventSeverity.LOW,
        ipAddress: getClientIP(ctx),
        userAgent: ctx.req?.headers['user-agent'],
        details: {
          email: input.email,
          reason: 'user_not_found',
        },
      });
      
      return {
        success: true,
        message: 'パスワードリセットの手順をメールで送信しました。',
      };
    }

    // トークン生成
    const { token, expires } = emailService.generatePasswordResetToken();

    // ユーザー情報を更新
    await ctx.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: token,
        passwordResetExpires: expires,
      },
    });

    // メール送信
    const emailSent = await emailService.sendPasswordResetEmail(
      user.email,
      user.username,
      token
    );

    await logSecurityEventDB(ctx.prisma, {
      type: SecurityEventType.PASSWORD_RESET_REQUEST,
      severity: SecurityEventSeverity.LOW,
      userId: user.id,
      ipAddress: getClientIP(ctx),
      userAgent: ctx.req?.headers['user-agent'],
      details: {
        email: user.email,
        emailSent,
      },
    });

    return {
      success: true,
      message: 'パスワードリセットの手順をメールで送信しました。',
    };
  }

  /**
   * パスワードリセットを実行
   */
  @Mutation(() => PasswordResetResponse)
  async resetPassword(
    @Arg('input') input: PasswordResetInput,
    @Ctx() ctx: Context
  ): Promise<PasswordResetResponse> {
    const user = await ctx.prisma.user.findFirst({
      where: {
        passwordResetToken: input.token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      await logSecurityEventDB(ctx.prisma, {
        type: SecurityEventType.PASSWORD_RESET_FAILURE,
        severity: SecurityEventSeverity.MEDIUM,
        ipAddress: getClientIP(ctx),
        userAgent: ctx.req?.headers['user-agent'],
        details: {
          token: input.token,
          reason: 'invalid_or_expired_token',
        },
      });
      
      throw new Error('リセットトークンが無効または期限切れです。');
    }

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(input.newPassword, 12);

    // ユーザー情報を更新
    await ctx.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    // 成功通知メール送信
    await emailService.sendPasswordResetSuccessEmail(user.email, user.username);

    await logSecurityEventDB(ctx.prisma, {
      type: SecurityEventType.PASSWORD_RESET_SUCCESS,
      severity: SecurityEventSeverity.LOW,
      userId: user.id,
      ipAddress: getClientIP(ctx),
      userAgent: ctx.req?.headers['user-agent'],
      details: {
        email: user.email,
      },
    });

    return {
      success: true,
      message: 'パスワードが正常にリセットされました。',
    };
  }

  /**
   * メール認証を実行
   */
  @Mutation(() => EmailVerificationResponse)
  async verifyEmail(
    @Arg('input') input: EmailVerificationInput,
    @Ctx() ctx: Context
  ): Promise<EmailVerificationResponse> {
    const user = await ctx.prisma.user.findFirst({
      where: {
        emailVerificationToken: input.token,
        emailVerificationExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      await logSecurityEventDB(ctx.prisma, {
        type: SecurityEventType.EMAIL_VERIFICATION_FAILURE,
        severity: SecurityEventSeverity.MEDIUM,
        ipAddress: getClientIP(ctx),
        userAgent: ctx.req?.headers['user-agent'],
        details: {
          token: input.token,
          reason: 'invalid_or_expired_token',
        },
      });
      
      throw new Error('認証トークンが無効または期限切れです。');
    }

    // メール認証を完了
    await ctx.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    await logSecurityEventDB(ctx.prisma, {
      type: SecurityEventType.EMAIL_VERIFICATION_SUCCESS,
      severity: SecurityEventSeverity.LOW,
      userId: user.id,
      ipAddress: getClientIP(ctx),
      userAgent: ctx.req?.headers['user-agent'],
      details: {
        email: user.email,
      },
    });

    return {
      success: true,
      message: 'メールアドレスが正常に認証されました。',
    };
  }

  /**
   * メールアドレス変更をリクエスト
   */
  @Mutation(() => EmailChangeResponse)
  async requestEmailChange(
    @Arg('input') input: EmailChangeInput,
    @Ctx() ctx: Context
  ): Promise<EmailChangeResponse> {
    // TODO: 認証ユーザーからユーザーIDを取得する必要がある
    // 現在はAuthミドルウェアが実装されていないため、一時的にスキップ
    throw new Error('認証ユーザーのみ利用できます。');
  }

  /**
   * メールアドレス変更を確定
   */
  @Mutation(() => EmailChangeResponse)
  async confirmEmailChange(
    @Arg('input') input: EmailChangeConfirmInput,
    @Ctx() ctx: Context
  ): Promise<EmailChangeResponse> {
    const user = await ctx.prisma.user.findFirst({
      where: {
        emailChangeToken: input.token,
        emailChangeExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user || !user.pendingEmail) {
      await logSecurityEventDB(ctx.prisma, {
        type: SecurityEventType.EMAIL_CHANGE_FAILURE,
        severity: SecurityEventSeverity.MEDIUM,
        ipAddress: getClientIP(ctx),
        userAgent: ctx.req?.headers['user-agent'],
        details: {
          token: input.token,
          reason: 'invalid_or_expired_token',
        },
      });
      
      throw new Error('変更トークンが無効または期限切れです。');
    }

    // メールアドレスを変更
    await ctx.prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.pendingEmail,
        pendingEmail: null,
        emailChangeToken: null,
        emailChangeExpires: null,
        emailVerified: true,
      },
    });

    await logSecurityEventDB(ctx.prisma, {
      type: SecurityEventType.EMAIL_CHANGE_SUCCESS,
      severity: SecurityEventSeverity.LOW,
      userId: user.id,
      ipAddress: getClientIP(ctx),
      userAgent: ctx.req?.headers['user-agent'],
      details: {
        oldEmail: user.email,
        newEmail: user.pendingEmail,
      },
    });

    return {
      success: true,
      message: 'メールアドレスが正常に変更されました。',
    };
  }

  /**
   * メール認証メールを再送信
   */
  @Mutation(() => EmailVerificationResponse)
  async resendVerificationEmail(
    @Arg('email') email: string,
    @Ctx() ctx: Context
  ): Promise<EmailVerificationResponse> {
    const user = await ctx.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // セキュリティ上同じメッセージを返す
      return {
        success: true,
        message: '認証メールを送信しました。',
      };
    }

    if (user.emailVerified) {
      return {
        success: true,
        message: 'メールアドレスは既に認証済みです。',
      };
    }

    // 新しいトークン生成
    const { token, expires } = emailService.generateSecureToken();

    // ユーザー情報を更新
    await ctx.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: token,
        emailVerificationExpires: expires,
      },
    });

    // メール送信
    await emailService.sendEmailVerification(user.email, user.username, token);

    await logSecurityEventDB(ctx.prisma, {
      type: SecurityEventType.EMAIL_VERIFICATION_RESEND,
      severity: SecurityEventSeverity.LOW,
      userId: user.id,
      ipAddress: getClientIP(ctx),
      userAgent: ctx.req?.headers['user-agent'],
      details: {
        email: user.email,
      },
    });

    return {
      success: true,
      message: '認証メールを送信しました。',
    };
  }
}
