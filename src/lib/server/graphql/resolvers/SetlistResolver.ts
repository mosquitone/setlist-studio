import { PrismaClient } from '@prisma/client';
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
  ObjectType,
} from 'type-graphql';

import { AuthMiddleware } from '@/lib/server/graphql/middleware/jwt-auth-middleware';
import { verifyAndValidateJWT } from '@/types/jwt';

import {
  logSecurityEventDB,
  SecurityEventType,
  SecurityEventSeverity,
} from '../../../security/security-logger-db';
import { Setlist } from '../types/Setlist';
import { SetlistItem } from '../types/SetlistItem';

interface Context {
  prisma: PrismaClient;
  userId?: string;
  req?: {
    cookies: { [key: string]: string };
    headers: { [key: string]: string };
  };
  i18n?: { messages: any };
}

@InputType()
export class CreateSetlistItemForSetlistInput {
  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  note?: string;

  @Field(() => Int)
  order: number;
}

// 基底クラス - セットリストの共通フィールド定義
@InputType()
abstract class BaseSetlistInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  eventName?: string;

  @Field(() => Date, { nullable: true })
  eventDate?: Date;

  @Field(() => String, { nullable: true })
  openTime?: string;

  @Field(() => String, { nullable: true })
  startTime?: string;

  @Field(() => [CreateSetlistItemForSetlistInput], { nullable: true })
  items?: CreateSetlistItemForSetlistInput[];
}

@InputType()
export class CreateSetlistInput extends BaseSetlistInput {
  @Field(() => String)
  artistName: string; // 作成時は必須

  @Field(() => String)
  theme: string; // 作成時は必須

  @Field(() => Boolean, { defaultValue: false })
  isPublic: boolean; // 作成時はデフォルト値付き
}

@InputType()
export class UpdateSetlistInput extends BaseSetlistInput {
  @Field(() => String, { nullable: true })
  artistName?: string; // 更新時は任意

  @Field(() => String, { nullable: true })
  theme?: string; // 更新時は任意

  @Field(() => Boolean, { nullable: true })
  isPublic?: boolean; // 更新時は任意
}

@ObjectType()
export class NewSongInfo {
  @Field(() => Int)
  count: number;

  @Field(() => [String])
  titles: string[];
}

@ObjectType()
export class CreateSetlistResult {
  @Field(() => Setlist)
  setlist: Setlist;

  @Field(() => NewSongInfo)
  newSongs: NewSongInfo;
}

@ObjectType()
export class UpdateSetlistResult {
  @Field(() => Setlist)
  setlist: Setlist;

  @Field(() => NewSongInfo)
  newSongs: NewSongInfo;
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
    // 最適化されたクエリを使用
    return ctx.prisma.setlist.findMany({
      where: { userId: ctx.userId },
      include: {
        items: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            note: true,
            order: true,
            setlistId: true,
          },
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
      throw new Error(
        ctx.i18n?.messages.errors.authenticationRequiredPrivate ||
          'Authentication required to access private setlist',
      );
    }

    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error(
          ctx.i18n?.messages.errors.jwtNotConfigured ||
            'JWT_SECRET environment variable is not configured',
        );
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
        throw new Error(
          ctx.i18n?.messages.errors.unauthorizedAccessPrivate ||
            'Unauthorized access to private setlist',
        );
      }
    } catch (error) {
      console.error('JWT verification failed:', error);
      throw new Error(
        ctx.i18n?.messages.errors.authenticationRequiredPrivate ||
          'Authentication required to access private setlist',
      );
    }

    return setlist as Setlist;
  }

  /**
   * 新しいセットリストを作成
   * @param input - セットリスト作成用の入力データ
   * @param ctx - GraphQLコンテキスト（認証済みユーザー情報含む）
   * @returns 作成されたセットリストデータと新規楽曲情報
   */
  @Mutation(() => CreateSetlistResult)
  @UseMiddleware(AuthMiddleware)
  async createSetlist(
    @Arg('input', () => CreateSetlistInput) input: CreateSetlistInput,
    @Ctx() ctx: Context,
  ): Promise<CreateSetlistResult> {
    const { items, ...setlistData } = input;

    // セットリスト名が空の場合、自動でナンバリング
    let title = setlistData.title;
    if (!title || title.trim() === '') {
      title = await this.generateSetlistTitle(ctx);
    }

    // セットリストの楽曲から未登録楽曲を自動登録し、新規楽曲情報を取得
    const newSongs =
      items && items.length > 0
        ? await this.ensureSongsExist(items, input.artistName, ctx)
        : { count: 0, titles: [] };

    const setlist = await ctx.prisma.setlist.create({
      data: {
        ...setlistData,
        title,
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

    return {
      setlist: setlist as Setlist,
      newSongs,
    };
  }

  /**
   * セットリスト名を自動生成（"セットリスト 1", "セットリスト 2" など）
   * @param ctx - GraphQLコンテキスト
   * @returns 生成されたセットリスト名
   */
  private async generateSetlistTitle(ctx: Context): Promise<string> {
    // 現在のユーザーのセットリスト数を取得
    const setlistCount = await ctx.prisma.setlist.count({
      where: { userId: ctx.userId },
    });

    // 次の番号を計算
    const nextNumber = setlistCount + 1;

    // 名前の衝突を避けるため、既存のセットリストタイトルをチェック
    const formatTitle = (num: number) => {
      return `Setlist ${num}`;
    };

    let title = formatTitle(nextNumber);
    let counter = nextNumber;

    while (true) {
      const existingSetlist = await ctx.prisma.setlist.findFirst({
        where: {
          userId: ctx.userId,
          title: title,
        },
      });

      if (!existingSetlist) {
        break;
      }

      counter++;
      title = formatTitle(counter);
    }

    return title;
  }

  /**
   * 楽曲リストから未登録楽曲を楽曲管理テーブルに自動登録し、新規楽曲情報を返す
   * @param items - セットリストの楽曲リスト
   * @param artistName - アーティスト名
   * @param ctx - GraphQLコンテキスト
   * @returns 新規登録楽曲の情報
   */
  private async ensureSongsExist(
    items: CreateSetlistItemForSetlistInput[],
    artistName: string,
    ctx: Context,
  ): Promise<NewSongInfo> {
    // 空のタイトルをフィルタリング
    const validItems = items.filter((item) => item.title.trim() !== '');

    if (validItems.length === 0) {
      return { count: 0, titles: [] };
    }

    // 現在のユーザーの楽曲一覧を取得
    const existingSongs = await ctx.prisma.song.findMany({
      where: {
        userId: ctx.userId,
        title: { in: validItems.map((item) => item.title.trim()) },
      },
      select: { title: true },
    });

    const existingSongTitles = new Set(existingSongs.map((song) => song.title));

    // 未登録楽曲を抽出（重複を除去）
    const newSongTitles = Array.from(
      new Set(
        validItems
          .map((item) => item.title.trim())
          .filter((title) => !existingSongTitles.has(title)),
      ),
    );

    // 未登録楽曲を一括登録
    if (newSongTitles.length > 0) {
      await ctx.prisma.song.createMany({
        data: newSongTitles.map((title) => ({
          title,
          artist: artistName,
          userId: ctx.userId!,
        })),
        skipDuplicates: true, // 重複を防ぐ
      });
    }

    return {
      count: newSongTitles.length,
      titles: newSongTitles,
    };
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
      throw new Error(ctx.i18n?.messages.errors.setlistNotFound || 'Setlist not found');
    }

    await ctx.prisma.setlist.update({
      where: { id },
      data: { isPublic: !setlist.isPublic },
    });

    return true;
  }

  @Mutation(() => UpdateSetlistResult)
  @UseMiddleware(AuthMiddleware)
  async updateSetlist(
    @Arg('id', () => ID) id: string,
    @Arg('input', () => UpdateSetlistInput) input: UpdateSetlistInput,
    @Ctx() ctx: Context,
  ): Promise<UpdateSetlistResult> {
    const setlist = await ctx.prisma.setlist.findFirst({
      where: { id, userId: ctx.userId },
    });

    if (!setlist) {
      throw new Error(ctx.i18n?.messages.errors.setlistNotFound || 'Setlist not found');
    }

    const { items, ...setlistData } = input;

    // セットリストの楽曲から未登録楽曲を自動登録し、新規楽曲情報を取得
    const newSongs =
      items && items.length > 0
        ? await this.ensureSongsExist(
            items,
            input.artistName || setlist.artistName || 'Unknown',
            ctx,
          )
        : { count: 0, titles: [] };

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

    return {
      setlist: updatedSetlist as Setlist,
      newSongs,
    };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(AuthMiddleware)
  async deleteSetlist(@Arg('id', () => ID) id: string, @Ctx() ctx: Context): Promise<boolean> {
    const setlist = await ctx.prisma.setlist.findFirst({
      where: { id, userId: ctx.userId },
    });

    if (!setlist) {
      throw new Error(ctx.i18n?.messages.errors.setlistNotFound || 'Setlist not found');
    }

    await ctx.prisma.setlist.delete({
      where: { id },
    });

    return true;
  }

  // Field resolver for items relation - N+1問題を避けるため、既にロードされたデータを返す
  @FieldResolver(() => [SetlistItem])
  async items(@Root() setlist: Setlist): Promise<SetlistItem[]> {
    // setlistオブジェクトに既にitemsがロードされている場合はそれを返す
    const setlistWithItems = setlist as Setlist & { items?: SetlistItem[] };

    // itemsが存在する場合はそれを返し、存在しない場合は空配列を返す
    return setlistWithItems.items || [];
  }
}
