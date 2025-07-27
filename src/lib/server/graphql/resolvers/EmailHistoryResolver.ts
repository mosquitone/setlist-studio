import { Prisma } from '@prisma/client';
import { Resolver, Query, Ctx, UseMiddleware, FieldResolver, Root } from 'type-graphql';

import { AuthMiddleware } from '../middleware/jwt-auth-middleware';
import { EmailHistory } from '../types/EmailHistory';
import { User } from '../types/User';

import { AuthResolverReq } from './AuthResolver';

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
  // AuthResolverのconfirmEmailChangeメソッドのトランザクション内で利用している
  static async recordEmailChange(
    tx: Prisma.TransactionClient,
    userId: string,
    oldEmail: string,
    newEmail: string,
    changeMethod: string,
    authProvider?: string,
    req?: AuthResolverReq, // リクエスト情報を追加
  ): Promise<EmailHistory> {
    const userAgent = req?.headers['user-agent'] || '';
    const clientIP = req?.headers['x-forwarded-for'] || req?.headers['x-real-ip'] || 'unknown';

    const emailHistory = await tx.emailHistory.create({
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
