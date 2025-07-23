import { PrismaClient } from '@prisma/client';
import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql';

import { AuthMiddleware } from '../middleware/jwt-auth-middleware';
import { User } from '../types/User';

interface Context {
  prisma: PrismaClient;
  userId?: string;
  i18n?: { messages: any };
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  @UseMiddleware(AuthMiddleware)
  async me(@Ctx() ctx: Context): Promise<User | null> {
    if (!ctx.userId) {
      return null;
    }

    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.userId },
    });

    return user;
  }

  @Mutation(() => User)
  @UseMiddleware(AuthMiddleware)
  async updateUser(
    @Arg('username', () => String) username: string,
    @Ctx() ctx: Context,
  ): Promise<User> {
    if (!ctx.userId) {
      throw new Error(ctx.i18n?.messages.errors.authenticationRequired || '認証が必要です');
    }

    // ユーザー名重複チェックを削除（重複を許可するため）

    const user = await ctx.prisma.user.update({
      where: { id: ctx.userId },
      data: { username },
    });

    return user;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(AuthMiddleware)
  async deleteAccount(@Ctx() ctx: Context): Promise<boolean> {
    if (!ctx.userId) {
      throw new Error(ctx.i18n?.messages.errors.authenticationRequired || '認証が必要です');
    }

    // Prismaのカスケード削除により関連データ（setlists, songs, emailHistories等）も自動削除される
    await ctx.prisma.user.delete({
      where: { id: ctx.userId },
    });

    return true;
  }
}
