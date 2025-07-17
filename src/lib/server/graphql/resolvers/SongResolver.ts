import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  UseMiddleware,
  InputType,
  Field,
  Int,
  ID,
} from 'type-graphql';
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { PrismaClient } from '@prisma/client';
import { Song } from '../types/Song';
import { AuthMiddleware } from '@/lib/server/graphql/middleware/jwt-auth-middleware';

interface Context {
  prisma: PrismaClient;
  userId?: string;
}

// 基底クラス - 楽曲の共通フィールド定義
@InputType()
abstract class BaseSongInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  artist?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  key?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(300)
  tempo?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}

@InputType()
export class CreateSongInput extends BaseSongInput {
  @Field(() => String)
  @IsString()
  title: string; // 作成時は必須
}

@InputType()
export class UpdateSongInput extends BaseSongInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  title?: string; // 更新時は任意
}

@Resolver(() => Song)
export class SongResolver {
  @Query(() => [Song])
  @UseMiddleware(AuthMiddleware)
  async songs(@Ctx() ctx: Context): Promise<Song[]> {
    // 最適化されたクエリ（必要フィールドのみ取得）
    return ctx.prisma.song.findMany({
      where: { userId: ctx.userId },
      select: {
        id: true,
        title: true,
        artist: true,
        duration: true,
        key: true,
        tempo: true,
        notes: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' }, // 最新順に変更
    }) as Promise<Song[]>;
  }

  @Query(() => Song, { nullable: true })
  @UseMiddleware(AuthMiddleware)
  async song(@Arg('id', () => ID) id: string, @Ctx() ctx: Context): Promise<Song | null> {
    return ctx.prisma.song.findFirst({
      where: { id, userId: ctx.userId },
    }) as Promise<Song | null>;
  }

  @Mutation(() => Song)
  @UseMiddleware(AuthMiddleware)
  async createSong(
    @Arg('input', () => CreateSongInput) input: CreateSongInput,
    @Ctx() ctx: Context,
  ): Promise<Song> {
    return ctx.prisma.song.create({
      data: {
        ...input,
        userId: ctx.userId!,
      },
    }) as Promise<Song>;
  }

  @Mutation(() => Song)
  @UseMiddleware(AuthMiddleware)
  async updateSong(
    @Arg('id', () => ID) id: string,
    @Arg('input', () => UpdateSongInput) input: UpdateSongInput,
    @Ctx() ctx: Context,
  ): Promise<Song> {
    const song = await ctx.prisma.song.findFirst({
      where: { id, userId: ctx.userId },
    });

    if (!song) {
      throw new Error('Song not found');
    }

    return ctx.prisma.song.update({
      where: { id },
      data: input,
    }) as Promise<Song>;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(AuthMiddleware)
  async deleteSong(@Arg('id', () => ID) id: string, @Ctx() ctx: Context): Promise<boolean> {
    const song = await ctx.prisma.song.findFirst({
      where: { id, userId: ctx.userId },
    });

    if (!song) {
      throw new Error('Song not found');
    }

    await ctx.prisma.song.delete({
      where: { id },
    });

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(AuthMiddleware)
  async deleteMultipleSongs(
    @Arg('ids', () => [ID]) ids: string[],
    @Ctx() ctx: Context,
  ): Promise<boolean> {
    // ユーザーが所有する楽曲のみを削除対象とする
    const songsToDelete = await ctx.prisma.song.findMany({
      where: {
        id: { in: ids },
        userId: ctx.userId,
      },
      select: { id: true },
    });

    if (songsToDelete.length === 0) {
      throw new Error('No songs found to delete');
    }

    const songIdsToDelete = songsToDelete.map((song) => song.id);

    await ctx.prisma.song.deleteMany({
      where: {
        id: { in: songIdsToDelete },
        userId: ctx.userId,
      },
    });

    return true;
  }
}
