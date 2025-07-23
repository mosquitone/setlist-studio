import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Resolver, Mutation, Query, Arg, Ctx, UseMiddleware } from 'type-graphql';

import { I18nContext } from '../../../i18n/context';
import { createEmailRateLimit } from '../../../security/email-rate-limit';
import {
  logAuthSuccessDB,
  logAuthFailureDB,
  SecurityEventType,
  SecurityEventSeverity,
  logSecurityEventDB,
} from '../../../security/security-logger-db';
import { logSimpleAudit } from '../../../security/simple-audit-logger';
import { DatabaseThreatDetection } from '../../../security/threat-detection-db';
import { emailService } from '../../email/emailService';
import { AuthMiddleware } from '../middleware/jwt-auth-middleware';
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
  EmailChangeConfirmInput,
  ChangePasswordInput,
  ChangePasswordResponse,
  PasswordResetTokenInfo,
} from '../types/Auth';

import { EmailHistoryResolver } from './EmailHistoryResolver';

interface Context {
  prisma: PrismaClient;
  userId?: string;
  user?: {
    userId: string;
    email: string;
    username: string;
  };
  req?: {
    headers: {
      authorization?: string;
      'user-agent'?: string;
      'x-forwarded-for'?: string;
      'x-real-ip'?: string;
    };
  };
  request?: Request;
  i18n?: I18nContext;
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
    // メールアドレスの重複チェック
    const existingEmailUser = await ctx.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingEmailUser) {
      // 登録失敗をログに記録（データベースベース）
      await logSecurityEventDB(ctx.prisma, {
        type: SecurityEventType.REGISTER_FAILURE,
        severity: SecurityEventSeverity.MEDIUM,
        ipAddress: getClientIP(ctx),
        userAgent: ctx.req?.headers['user-agent'],
        details: {
          email: input.email,
          username: input.username,
          reason: 'email_already_exists',
        },
      });
      throw new Error(
        ctx.i18n?.messages.auth.emailAlreadyInUse || 'このメールアドレスは既に使用されています。',
      );
    }

    // ユーザー名重複チェックを削除（重複を許可するため）

    // 並列処理可能な部分を同時実行
    const [hashedPassword, { token: verificationToken, expires: verificationExpires }] =
      await Promise.all([
        bcrypt.hash(input.password, 10), // 12から10に削減してパフォーマンス改善
        Promise.resolve(emailService.generateSecureToken()), // トークン生成は高速なのでPromiseでラップ
      ]);

    const user = await ctx.prisma.user.create({
      data: {
        email: input.email,
        username: input.username,
        password: hashedPassword,
        authProvider: 'email',
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
      },
    });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error(
        ctx.i18n?.messages.auth.serverError ||
          'サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。',
      );
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

    // メール送信とログ記録を非同期で実行（レスポンスを待たない）
    // 失敗してもユーザー登録は成功として扱う
    setImmediate(async () => {
      try {
        // メール認証メールを送信
        const emailResult = await emailService.sendEmailVerificationWithDetails(
          user.email,
          user.username,
          verificationToken,
          ctx.i18n?.lang,
        );

        // メール送信結果をログに記録（失敗しても続行）
        try {
          await logSecurityEventDB(ctx.prisma, {
            type: SecurityEventType.REGISTER_SUCCESS,
            severity: SecurityEventSeverity.LOW,
            userId: user.id,
            ipAddress: getClientIP(ctx),
            userAgent: ctx.req?.headers['user-agent'],
            details: {
              email: user.email,
              username: user.username,
              emailSent: emailResult.success,
              emailAttempts: emailResult.attempts,
              emailMessageId: emailResult.messageId,
              emailError: emailResult.finalError?.message,
            },
          });
        } catch (logError) {
          console.error('Security log failed for user registration:', {
            userId: user.id,
            email: user.email,
            error: logError instanceof Error ? logError.message : String(logError),
          });
        }

        // メール送信失敗時の追加対応
        if (!emailResult.success) {
          console.error('Email verification failed for new user:', {
            userId: user.id,
            email: user.email,
            attempts: emailResult.attempts,
            error: emailResult.finalError?.message,
          });

          // TODO: 管理者通知やリトライキューへの追加などを検討
        }
      } catch (error) {
        console.error('Background task failed completely:', {
          userId: user.id,
          email: user.email,
          error: error instanceof Error ? error.message : String(error),
        });
      }
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

      // シンプルな監査ログを作成（失敗時）
      await logSimpleAudit(ctx.prisma, {
        id: 'temp',
        type: SecurityEventType.LOGIN_FAILURE,
        severity: SecurityEventSeverity.MEDIUM,
        timestamp: new Date(),
        ipAddress: getClientIP(ctx),
        userAgent: ctx.req?.headers?.['user-agent'],
        resource: '/auth/login',
        details: {
          email: input.email,
          reason: 'user_not_found',
        },
      });

      throw new Error(
        ctx.i18n?.messages.auth.invalidCredentials ||
          'メールアドレスまたはパスワードが正しくありません',
      );
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

      // シンプルな監査ログを作成（パスワード不正）
      await logSimpleAudit(ctx.prisma, {
        id: 'temp',
        type: SecurityEventType.LOGIN_FAILURE,
        severity: SecurityEventSeverity.MEDIUM,
        timestamp: new Date(),
        userId: user.id,
        ipAddress: getClientIP(ctx),
        userAgent: ctx.req?.headers?.['user-agent'],
        resource: '/auth/login',
        details: {
          email: input.email,
          reason: 'invalid_password',
        },
      });

      throw new Error(
        ctx.i18n?.messages.auth.invalidCredentials ||
          'メールアドレスまたはパスワードが正しくありません',
      );
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error(
        ctx.i18n?.messages.auth.serverError ||
          'サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。',
      );
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

    // シンプルな監査ログを作成
    await logSimpleAudit(ctx.prisma, {
      id: 'temp',
      type: SecurityEventType.LOGIN_SUCCESS,
      severity: SecurityEventSeverity.LOW,
      timestamp: new Date(),
      userId: user.id,
      ipAddress: getClientIP(ctx),
      userAgent: ctx.req?.headers['user-agent'],
      resource: '/auth/login',
      details: {
        email: input.email,
      },
    });

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
    @Arg('input', () => PasswordResetRequestInput) input: PasswordResetRequestInput,
    @Ctx() ctx: Context,
  ): Promise<PasswordResetResponse> {
    const emailRateLimit = createEmailRateLimit(ctx.prisma);
    const ipAddress = getClientIP(ctx);
    const userAgent = ctx.req?.headers['user-agent'];

    // レート制限チェック
    const rateLimitResult = await emailRateLimit.checkPasswordResetLimit(
      input.email,
      ipAddress,
      userAgent,
    );

    if (!rateLimitResult.success) {
      throw new Error(
        rateLimitResult.message ||
          ctx.i18n?.messages.auth.rateLimitExceeded ||
          'リクエスト回数が上限に達しました。',
      );
    }

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
        message:
          ctx.i18n?.messages.auth.passwordResetRequested ||
          'パスワードリセットの手順をメールで送信しました。',
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

    // メール送信（詳細版を使用）
    const emailResult = await emailService.sendPasswordResetEmailWithDetails(
      user.email,
      user.username,
      token,
      ctx.i18n?.lang,
    );

    await logSecurityEventDB(ctx.prisma, {
      type: SecurityEventType.PASSWORD_RESET_REQUEST,
      severity: SecurityEventSeverity.LOW,
      userId: user.id,
      ipAddress: getClientIP(ctx),
      userAgent: ctx.req?.headers['user-agent'],
      details: {
        email: user.email,
        emailSent: emailResult.success,
        emailAttempts: emailResult.attempts,
        emailMessageId: emailResult.messageId,
        emailError: emailResult.finalError?.message,
      },
    });

    return {
      success: true,
      message:
        ctx.i18n?.messages.auth.passwordResetRequested ||
        'パスワードリセットの手順をメールで送信しました。',
    };
  }

  /**
   * パスワードリセットを実行
   */
  @Mutation(() => PasswordResetResponse)
  async resetPassword(
    @Arg('input', () => PasswordResetInput) input: PasswordResetInput,
    @Ctx() ctx: Context,
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

      throw new Error(
        ctx.i18n?.messages.auth.invalidResetToken || 'リセットトークンが無効または期限切れです。',
      );
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
    await emailService.sendPasswordResetSuccessEmail(user.email, user.username, ctx.i18n?.lang);

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
      message:
        ctx.i18n?.messages.auth.passwordResetSuccess || 'パスワードが正常にリセットされました。',
    };
  }

  /**
   * メール認証を実行
   */
  @Mutation(() => EmailVerificationResponse)
  async verifyEmail(
    @Arg('input', () => EmailVerificationInput) input: EmailVerificationInput,
    @Ctx() ctx: Context,
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

      throw new Error(
        ctx.i18n?.messages.auth.invalidVerificationToken ||
          '認証トークンが無効または期限切れです。',
      );
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
      message: ctx.i18n?.messages.auth.emailVerified || 'メールアドレスが正常に認証されました。',
    };
  }

  /**
   * メールアドレス変更をリクエスト
   */
  @Mutation(() => EmailChangeResponse)
  @UseMiddleware(AuthMiddleware)
  async requestEmailChange(
    @Arg('input', () => EmailChangeInput) input: EmailChangeInput,
    @Ctx() ctx: Context,
  ): Promise<EmailChangeResponse> {
    // AuthMiddlewareにより認証済み
    const userId = ctx.userId!;

    const user = await ctx.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error(ctx.i18n?.messages.auth.userNotFound || 'ユーザーが見つかりません');
    }

    // 現在のパスワードを確認（Google認証ユーザーはスキップ）
    if (user.authProvider !== 'google') {
      if (!input.currentPassword) {
        throw new Error(
          ctx.i18n?.messages.auth.currentPasswordIncorrect || '現在のパスワードが正しくありません',
        );
      }
      const isValidPassword = await bcrypt.compare(input.currentPassword, user.password);
      if (!isValidPassword) {
        await logSecurityEventDB(ctx.prisma, {
          type: SecurityEventType.EMAIL_CHANGE_FAILURE,
          severity: SecurityEventSeverity.MEDIUM,
          userId: user.id,
          ipAddress: getClientIP(ctx),
          userAgent: ctx.req?.headers['user-agent'],
          details: {
            email: user.email,
            newEmail: input.newEmail,
            reason: 'invalid_current_password',
          },
        });

        throw new Error(
          ctx.i18n?.messages.auth.currentPasswordIncorrect || '現在のパスワードが正しくありません',
        );
      }
    }

    // 新しいメールアドレスが既に使用されているかチェック
    const existingUser = await ctx.prisma.user.findUnique({
      where: { email: input.newEmail },
    });

    if (existingUser && existingUser.id !== userId) {
      await logSecurityEventDB(ctx.prisma, {
        type: SecurityEventType.EMAIL_CHANGE_FAILURE,
        severity: SecurityEventSeverity.LOW,
        userId: user.id,
        ipAddress: getClientIP(ctx),
        userAgent: ctx.req?.headers['user-agent'],
        details: {
          email: user.email,
          newEmail: input.newEmail,
          reason: 'email_already_in_use',
        },
      });

      throw new Error(
        ctx.i18n?.messages.auth.emailAlreadyInUse || 'このメールアドレスは既に使用されています',
      );
    }

    // 現在のメールと同じ場合は何もしない（成功として扱う）
    if (user.email === input.newEmail) {
      return {
        success: true,
        message: '', // 空のメッセージで成功を返す
      };
    }

    // メールアドレス変更トークンを生成
    const { token, expires } = emailService.generateEmailChangeToken();

    // Google認証ユーザーの場合は新しいパスワードもハッシュ化して保存
    let pendingPassword: string | undefined;
    if (user.authProvider === 'google' && input.newPassword) {
      pendingPassword = await bcrypt.hash(input.newPassword, 12);
    }

    // ユーザー情報を更新（pendingEmailに新しいメールアドレスを設定）
    await ctx.prisma.user.update({
      where: { id: user.id },
      data: {
        pendingEmail: input.newEmail,
        emailChangeToken: token,
        emailChangeExpires: expires,
        pendingPassword,
      },
    });

    // 新しいメールアドレスに確認メールを送信
    const emailResult = await emailService.sendEmailChangeEmailWithDetails(
      input.newEmail,
      user.username,
      token,
      ctx.i18n?.lang,
    );

    await logSecurityEventDB(ctx.prisma, {
      type: SecurityEventType.EMAIL_CHANGE_REQUEST,
      severity: SecurityEventSeverity.LOW,
      userId: user.id,
      ipAddress: getClientIP(ctx),
      userAgent: ctx.req?.headers['user-agent'],
      details: {
        oldEmail: user.email,
        newEmail: input.newEmail,
        emailSent: emailResult.success,
        emailAttempts: emailResult.attempts,
        emailMessageId: emailResult.messageId,
        emailError: emailResult.finalError?.message,
      },
    });

    return {
      success: true,
      message:
        ctx.i18n?.messages.auth.emailChangeRequested ||
        'メールアドレス変更の確認メールを送信しました',
    };
  }

  /**
   * メールアドレス変更を確定
   */
  @Mutation(() => EmailChangeResponse)
  async confirmEmailChange(
    @Arg('input', () => EmailChangeConfirmInput) input: EmailChangeConfirmInput,
    @Ctx() ctx: Context,
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

      throw new Error(
        ctx.i18n?.messages.auth.invalidChangeToken || '変更トークンが無効または期限切れです。',
      );
    }

    // メールアドレスを変更（pendingPasswordがある場合はパスワードも更新）
    const updateData: Prisma.UserUpdateInput = {
      email: user.pendingEmail,
      pendingEmail: null,
      emailChangeToken: null,
      emailChangeExpires: null,
      emailVerified: true,
      authProvider: 'email', // メールアドレス変更後はemailユーザーとして扱う
    };

    if (user.pendingPassword) {
      updateData.password = user.pendingPassword;
      updateData.pendingPassword = null;
    }

    const oldEmail = user.email;
    const newEmail = user.pendingEmail;

    await ctx.prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    // メールアドレス変更履歴を記録
    await EmailHistoryResolver.recordEmailChange(
      ctx,
      user.id,
      oldEmail,
      newEmail,
      'verification', // 確認メール経由での変更
      updateData.authProvider as string,
    );

    await logSecurityEventDB(ctx.prisma, {
      type: SecurityEventType.EMAIL_CHANGE_SUCCESS,
      severity: SecurityEventSeverity.LOW,
      userId: user.id,
      ipAddress: getClientIP(ctx),
      userAgent: ctx.req?.headers['user-agent'],
      details: {
        oldEmail,
        newEmail,
      },
    });

    return {
      success: true,
      message:
        ctx.i18n?.messages.auth.emailChangedSuccess || 'メールアドレスが正常に変更されました。',
    };
  }

  /**
   * メール認証メールを再送信
   */
  @Mutation(() => EmailVerificationResponse)
  async resendVerificationEmail(
    @Arg('email', () => String) email: string,
    @Ctx() ctx: Context,
  ): Promise<EmailVerificationResponse> {
    const emailRateLimit = createEmailRateLimit(ctx.prisma);
    const ipAddress = getClientIP(ctx);
    const userAgent = ctx.req?.headers['user-agent'];

    // レート制限チェック
    const rateLimitResult = await emailRateLimit.checkVerificationEmailLimit(
      email,
      ipAddress,
      userAgent,
    );

    if (!rateLimitResult.success) {
      throw new Error(
        rateLimitResult.message ||
          ctx.i18n?.messages.auth.rateLimitExceeded ||
          'リクエスト回数が上限に達しました。',
      );
    }

    const user = await ctx.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // セキュリティ上同じメッセージを返す
      return {
        success: true,
        message: ctx.i18n?.messages.auth.emailSent || '認証メールを送信しました。',
      };
    }

    if (user.emailVerified) {
      return {
        success: true,
        message:
          ctx.i18n?.messages.auth.emailAlreadyVerified || 'メールアドレスは既に認証済みです。',
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

    // メール送信（詳細版を使用）
    const emailResult = await emailService.sendEmailVerificationWithDetails(
      user.email,
      user.username,
      token,
      ctx.i18n?.lang,
    );

    await logSecurityEventDB(ctx.prisma, {
      type: SecurityEventType.EMAIL_VERIFICATION_RESEND,
      severity: SecurityEventSeverity.LOW,
      userId: user.id,
      ipAddress: getClientIP(ctx),
      userAgent: ctx.req?.headers['user-agent'],
      details: {
        email: user.email,
        emailSent: emailResult.success,
        emailAttempts: emailResult.attempts,
        emailMessageId: emailResult.messageId,
        emailError: emailResult.finalError?.message,
      },
    });

    return {
      success: true,
      message: ctx.i18n?.messages.auth.emailSent || '認証メールを送信しました。',
    };
  }

  /**
   * パスワード変更（認証済みユーザー用）
   */
  @Mutation(() => ChangePasswordResponse)
  @UseMiddleware(AuthMiddleware)
  async changePassword(
    @Arg('input', () => ChangePasswordInput) input: ChangePasswordInput,
    @Ctx() ctx: Context,
  ): Promise<ChangePasswordResponse> {
    // AuthMiddlewareにより認証済み
    const userId = ctx.userId!;

    const user = await ctx.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error(ctx.i18n?.messages.auth.userNotFound || 'ユーザーが見つかりません');
    }

    // Google認証ユーザーはパスワード変更不可
    if (user.authProvider === 'google') {
      await logSecurityEventDB(ctx.prisma, {
        type: SecurityEventType.PASSWORD_CHANGE_FAILURE,
        severity: SecurityEventSeverity.MEDIUM,
        userId: user.id,
        ipAddress: getClientIP(ctx),
        userAgent: ctx.req?.headers['user-agent'],
        details: {
          email: user.email,
          reason: 'google_auth_user_password_change_denied',
        },
      });

      throw new Error(
        ctx.i18n?.messages.auth.googleUserPasswordChangeNotAllowed ||
          'Google認証ユーザーはパスワード変更できません',
      );
    }

    // 現在のパスワードを確認
    const isValidPassword = await bcrypt.compare(input.currentPassword, user.password);
    if (!isValidPassword) {
      await logSecurityEventDB(ctx.prisma, {
        type: SecurityEventType.PASSWORD_CHANGE_FAILURE,
        severity: SecurityEventSeverity.MEDIUM,
        userId: user.id,
        ipAddress: getClientIP(ctx),
        userAgent: ctx.req?.headers['user-agent'],
        details: {
          email: user.email,
          reason: 'invalid_current_password',
        },
      });

      throw new Error(
        ctx.i18n?.messages.auth.currentPasswordIncorrect || '現在のパスワードが正しくありません',
      );
    }

    // 新しいパスワードをハッシュ化
    const hashedNewPassword = await bcrypt.hash(input.newPassword, 12);

    // パスワードを更新
    await ctx.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedNewPassword,
      },
    });

    // 成功通知メール送信
    await emailService.sendPasswordResetSuccessEmail(user.email, user.username, ctx.i18n?.lang);

    // 成功ログを記録
    await logSecurityEventDB(ctx.prisma, {
      type: SecurityEventType.PASSWORD_CHANGE_SUCCESS,
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
      message:
        ctx.i18n?.messages.auth.passwordChangeSuccess || 'パスワードが正常に変更されました。',
    };
  }

  /**
   * パスワードリセットトークン情報を取得
   */
  @Query(() => PasswordResetTokenInfo)
  async getPasswordResetTokenInfo(
    @Arg('token', () => String) token: string,
    @Ctx() ctx: Context,
  ): Promise<PasswordResetTokenInfo> {
    const user = await ctx.prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return {
        email: '',
        isValid: false,
      };
    }

    // メールアドレスを一部マスク
    const maskedEmail = user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3');

    return {
      email: maskedEmail,
      isValid: true,
    };
  }
}
