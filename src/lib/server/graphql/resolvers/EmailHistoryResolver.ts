import { Resolver, Query, Ctx, UseMiddleware, FieldResolver, Root } from 'type-graphql';

import { AuthMiddleware } from '../middleware/jwt-auth-middleware';
import { EmailHistory } from '../types/EmailHistory';
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
    messages: {
      auth: {
        userNotFound: string;
      };
    };
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

  // EmailHistory.user FieldResolver
  @FieldResolver(() => User)
  async user(@Root() emailHistory: EmailHistory, @Ctx() ctx: Context): Promise<User> {
    const user = await ctx.prisma.user.findUnique({
      where: { id: emailHistory.userId },
    });

    if (!user) {
      throw new Error(ctx.i18n?.messages.auth.userNotFound || 'User not found');
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
  ): Promise<EmailHistory> {
    const userAgent = ctx.req?.headers['user-agent'] || '';
    const clientIP =
      ctx.req?.headers['x-forwarded-for'] || ctx.req?.headers['x-real-ip'] || 'unknown';

    const emailHistory = await ctx.prisma.emailHistory.create({
      data: {
        userId,
        oldEmail,
        newEmail,
        changeMethod,
        ipAddress: clientIP,
        userAgent,
        authProvider,
        verificationSent: false,
      },
    });

    return emailHistory as EmailHistory;
  }
}
