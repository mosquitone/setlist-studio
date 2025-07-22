import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql';
import { PrismaClient } from '@prisma/client';
import { User } from '../types/User';
import { AuthMiddleware } from '../middleware/jwt-auth-middleware';

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
}
