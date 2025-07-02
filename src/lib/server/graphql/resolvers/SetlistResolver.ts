import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  UseMiddleware,
  InputType,
  Field,
  ID,
  Int,
  FieldResolver,
  Root,
} from 'type-graphql';
import { PrismaClient } from '@prisma/client';
import { Setlist } from '../types/Setlist';
import { SetlistItem } from '../types/SetlistItem';
import { AuthMiddleware } from '@/lib/server/graphql/middleware/jwt-auth-middleware';
import {
  logSecurityEventDB,
  SecurityEventType,
  SecurityEventSeverity,
} from '../../../security/security-logger-db';
import { verifyAndValidateJWT } from '@/types/jwt';

interface Context {
  prisma: PrismaClient;
  userId?: string;
  req?: {
    cookies: { [key: string]: string };
    headers: { [key: string]: string };
  };
}

@InputType()
export class CreateSetlistItemForSetlistInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  note?: string;

  @Field(() => Int)
  order: number;
}

@InputType()
export class CreateSetlistInput {
  @Field()
  title: string;

  @Field()
  bandName: string;

  @Field({ nullable: true })
  eventName?: string;

  @Field({ nullable: true })
  eventDate?: Date;

  @Field({ nullable: true })
  openTime?: string;

  @Field({ nullable: true })
  startTime?: string;

  @Field()
  theme: string;

  @Field({ defaultValue: false })
  isPublic: boolean;

  @Field(() => [CreateSetlistItemForSetlistInput], { nullable: true })
  items?: CreateSetlistItemForSetlistInput[];
}

@InputType()
export class UpdateSetlistInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  bandName?: string;

  @Field({ nullable: true })
  eventName?: string;

  @Field({ nullable: true })
  eventDate?: Date;

  @Field({ nullable: true })
  openTime?: string;

  @Field({ nullable: true })
  startTime?: string;

  @Field({ nullable: true })
  theme?: string;

  @Field({ nullable: true })
  isPublic?: boolean;

  @Field(() => [CreateSetlistItemForSetlistInput], { nullable: true })
  items?: CreateSetlistItemForSetlistInput[];
}

@Resolver(() => Setlist)
export class SetlistResolver {
  /**
   * ユーザーのセットリスト一覧を取得
   * @param ctx - GraphQLコンテキスト（認証済みユーザー情報含む）
   * @returns ユーザーが作成したセットリストの配列
   */
  @Query(() => [Setlist])
  @UseMiddleware(AuthMiddleware)
  async setlists(@Ctx() ctx: Context): Promise<Setlist[]> {
    return ctx.prisma.setlist.findMany({
      where: { userId: ctx.userId },
      include: {
        items: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    }) as Promise<Setlist[]>;
  }

  /**
   * 特定のセットリストを取得（公開設定と認証に基づくアクセス制御付き）
   * @param id - セットリストID
   * @param ctx - GraphQLコンテキスト
   * @returns セットリストデータまたはnull
   */
  @Query(() => Setlist, { nullable: true })
  async setlist(@Arg('id', () => ID) id: string, @Ctx() ctx: Context): Promise<Setlist | null> {
    const setlist = await ctx.prisma.setlist.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!setlist) {
      return null;
    }

    // 公開セットリストは誰でもアクセス可能
    if (setlist.isPublic) {
      return setlist as Setlist;
    }

    // プライベートセットリストは認証が必要 - 手動で認証をチェック
    const token = ctx.req?.cookies?.auth_token;
    if (!token) {
      throw new Error('Authentication required to access private setlist');
    }

    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET environment variable is not configured');
      }
      const payload = verifyAndValidateJWT(token, jwtSecret);

      // セキュリティチェック: 所有者のみアクセス可能
      if (setlist.userId !== payload.userId) {
        // 不正アクセス試行をログに記録（データベースベース）
        await logSecurityEventDB(ctx.prisma, {
          type: SecurityEventType.UNAUTHORIZED_ACCESS,
          severity: SecurityEventSeverity.HIGH,
          userId: payload.userId,
          resource: `setlist:${id}`,
          details: {
            setlistId: id,
            setlistOwnerId: setlist.userId,
            attemptedUserId: payload.userId,
            isPublic: setlist.isPublic,
          },
        });
        throw new Error('Unauthorized access to private setlist');
      }
    } catch (error) {
      console.error('JWT verification failed:', error);
      throw new Error('Authentication required to access private setlist');
    }

    return setlist as Setlist;
  }

  /**
   * 新しいセットリストを作成
   * @param input - セットリスト作成用の入力データ
   * @param ctx - GraphQLコンテキスト（認証済みユーザー情報含む）
   * @returns 作成されたセットリストデータ
   */
  @Mutation(() => Setlist)
  @UseMiddleware(AuthMiddleware)
  async createSetlist(
    @Arg('input') input: CreateSetlistInput,
    @Ctx() ctx: Context,
  ): Promise<Setlist> {
    const { items, ...setlistData } = input;

    const setlist = await ctx.prisma.setlist.create({
      data: {
        ...setlistData,
        userId: ctx.userId!,
        items: items
          ? {
              create: items.map((item) => ({
                title: item.title,
                note: item.note,
                order: item.order,
              })),
            }
          : undefined,
      },
      include: {
        items: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return setlist as Setlist;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(AuthMiddleware)
  async toggleSetlistVisibility(
    @Arg('id', () => ID) id: string,
    @Ctx() ctx: Context,
  ): Promise<boolean> {
    const setlist = await ctx.prisma.setlist.findFirst({
      where: { id, userId: ctx.userId },
    });

    if (!setlist) {
      throw new Error('Setlist not found');
    }

    await ctx.prisma.setlist.update({
      where: { id },
      data: { isPublic: !setlist.isPublic },
    });

    return true;
  }

  @Mutation(() => Setlist)
  @UseMiddleware(AuthMiddleware)
  async updateSetlist(
    @Arg('id', () => ID) id: string,
    @Arg('input') input: UpdateSetlistInput,
    @Ctx() ctx: Context,
  ): Promise<Setlist> {
    const setlist = await ctx.prisma.setlist.findFirst({
      where: { id, userId: ctx.userId },
    });

    if (!setlist) {
      throw new Error('Setlist not found');
    }

    const { items, ...setlistData } = input;

    // Update setlist and handle items
    const updatedSetlist = await ctx.prisma.setlist.update({
      where: { id },
      data: {
        ...setlistData,
        items: items
          ? {
              deleteMany: {}, // Delete all existing items
              create: items.map((item) => ({
                title: item.title,
                note: item.note,
                order: item.order,
              })),
            }
          : undefined,
      },
      include: {
        items: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return updatedSetlist as Setlist;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(AuthMiddleware)
  async deleteSetlist(@Arg('id', () => ID) id: string, @Ctx() ctx: Context): Promise<boolean> {
    const setlist = await ctx.prisma.setlist.findFirst({
      where: { id, userId: ctx.userId },
    });

    if (!setlist) {
      throw new Error('Setlist not found');
    }

    await ctx.prisma.setlist.delete({
      where: { id },
    });

    return true;
  }

  // Field resolver for items relation
  @FieldResolver(() => [SetlistItem])
  async items(@Root() setlist: Setlist, @Ctx() ctx: Context): Promise<SetlistItem[]> {
    const setlistData = await ctx.prisma.setlist.findUnique({
      where: { id: setlist.id },
      include: {
        items: {
          orderBy: { order: 'asc' },
        },
      },
    });
    return (setlistData?.items || []) as SetlistItem[];
  }
}
