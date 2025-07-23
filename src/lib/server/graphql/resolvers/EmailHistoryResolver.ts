import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  UseMiddleware,
  FieldResolver,
  Root,
} from 'type-graphql';

import { getMessages } from '../../../i18n/messages';
import {
  logSecurityEventDB,
  SecurityEventType,
  SecurityEventSeverity,
} from '../../../security/security-logger-db';
import { hashIP } from '../../../security/security-utils';
import { emailService } from '../../email/emailService';
import { AuthMiddleware } from '../middleware/jwt-auth-middleware';
import { EmailHistory, EmailOwnershipVerificationResponse } from '../types/EmailHistory';
import { User } from '../types/User';

// AuthResolverと同じContext型を使用
interface Context {
  prisma: import('@prisma/client').PrismaClient;
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
  i18n?: {
    lang: 'ja' | 'en';
  };
}

@Resolver(() => EmailHistory)
export class EmailHistoryResolver {
  // メールアドレス変更履歴を取得
  @Query(() => [EmailHistory])
  @UseMiddleware(AuthMiddleware)
  async getEmailHistory(@Ctx() ctx: Context): Promise<EmailHistory[]> {
    const userId = ctx.userId!;

    const histories = await ctx.prisma.emailHistory.findMany({
      where: { userId },
      orderBy: { changedAt: 'desc' },
      take: 20, // 最大20件
    });

    return histories as EmailHistory[];
  }

  // 過去のメールアドレスへの復帰時の所有権確認
  @Mutation(() => EmailOwnershipVerificationResponse)
  @UseMiddleware(AuthMiddleware)
  async verifyEmailOwnershipForReturn(
    @Arg('email', () => String) email: string,
    @Ctx() ctx: Context,
  ): Promise<EmailOwnershipVerificationResponse> {
    const userId = ctx.userId!;
    const userAgent = ctx.req?.headers['user-agent'] || '';
    const clientIP =
      ctx.req?.headers['x-forwarded-for'] || ctx.req?.headers['x-real-ip'] || 'unknown';
    const hashedIP = hashIP(clientIP);
    const messages = getMessages(ctx.i18n?.lang || 'ja');

    // 現在のユーザーを取得
    const currentUser = await ctx.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      throw new Error(messages.auth.userNotFound);
    }

    // 同じメールアドレスの場合はエラー
    if (currentUser.email === email) {
      return {
        success: false,
        message: messages.auth.emailCurrentlySame,
        verificationRequired: false,
      };
    }

    // 過去にこのメールアドレスを使用したことがあるかチェック
    const pastUsage = await ctx.prisma.emailHistory.findFirst({
      where: {
        userId,
        OR: [{ oldEmail: email }, { newEmail: email }],
      },
      orderBy: { changedAt: 'desc' },
    });

    if (!pastUsage) {
      return {
        success: false,
        message: messages.auth.noEmailHistoryFound,
        verificationRequired: false,
      };
    }

    // クールダウン期間中かチェック
    if (pastUsage.cooldownUntil && pastUsage.cooldownUntil > new Date()) {
      return {
        success: false,
        message: messages.auth.emailCooldownActive,
        verificationRequired: false,
      };
    }

    // 他のユーザーが現在使用中かチェック
    const existingUser = await ctx.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== userId) {
      return {
        success: false,
        message: messages.auth.emailInUseByOther,
        verificationRequired: false,
      };
    }

    try {
      // 所有権確認メールを送信
      await emailService.sendEmailOwnershipVerificationEmail(
        email,
        currentUser.username,
        userId,
        ctx.i18n?.lang,
      );

      // 履歴を更新（確認メール送信済みフラグ）
      await ctx.prisma.emailHistory.update({
        where: { id: pastUsage.id },
        data: {
          verificationSent: true,
          lastUsedAt: new Date(),
        },
      });

      // セキュリティログ記録
      await logSecurityEventDB(ctx.prisma, {
        type: SecurityEventType.EMAIL_VERIFICATION_RESEND,
        severity: SecurityEventSeverity.LOW,
        userId,
        ipAddress: hashedIP,
        details: {
          email,
          action: 'ownership_verification_for_return',
          userAgent,
        },
      });

      return {
        success: true,
        message: messages.auth.emailOwnershipVerificationSent,
        verificationRequired: true,
      };
    } catch (error) {
      console.error('Email ownership verification error:', error);
      return {
        success: false,
        message: messages.auth.emailOwnershipVerificationFailed,
        verificationRequired: false,
      };
    }
  }

  // EmailHistory.user FieldResolver
  @FieldResolver(() => User)
  async user(@Root() emailHistory: EmailHistory, @Ctx() ctx: Context): Promise<User> {
    const user = await ctx.prisma.user.findUnique({
      where: { id: emailHistory.userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // メールアドレス変更履歴を記録する内部メソッド
  static async recordEmailChange(
    ctx: Context,
    userId: string,
    oldEmail: string,
    newEmail: string,
    changeMethod: string,
    authProvider?: string,
    cooldownHours: number = 72, // デフォルト3日間のクールダウン
  ): Promise<EmailHistory> {
    const userAgent = ctx.req?.headers['user-agent'] || '';
    const clientIP =
      ctx.req?.headers['x-forwarded-for'] || ctx.req?.headers['x-real-ip'] || 'unknown';

    const cooldownUntil = new Date();
    cooldownUntil.setHours(cooldownUntil.getHours() + cooldownHours);

    const emailHistory = await ctx.prisma.emailHistory.create({
      data: {
        userId,
        oldEmail,
        newEmail,
        changeMethod,
        ipAddress: clientIP,
        userAgent,
        authProvider,
        cooldownUntil,
        verificationSent: false,
      },
    });

    return emailHistory as EmailHistory;
  }
}
