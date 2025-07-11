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

@InputType()
export class CreateSongInput {
  @Field(() => String)
  @IsString()
  title: string;

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
export class UpdateSongInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

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
}
