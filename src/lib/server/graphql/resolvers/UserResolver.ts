import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql';
import { PrismaClient } from '@prisma/client';
import { User } from '../types/User';
import { AuthMiddleware } from '../middleware/jwt-auth-middleware';

interface Context {
  prisma: PrismaClient;
  userId?: string;
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
  async updateUser(@Arg('username') username: string, @Ctx() ctx: Context): Promise<User> {
    if (!ctx.userId) {
      throw new Error('認証が必要です');
    }

    // Check if username is already taken
    const existingUser = await ctx.prisma.user.findUnique({
      where: { username },
    });

    if (existingUser && existingUser.id !== ctx.userId) {
      throw new Error('このユーザー名は既に使用されています');
    }

    const user = await ctx.prisma.user.update({
      where: { id: ctx.userId },
      data: { username },
    });

    return user;
  }
}
