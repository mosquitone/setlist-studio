import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware, InputType, Field, ID } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { Setlist } from "../types/Setlist";
import { AuthMiddleware } from "../middleware/auth";

interface Context {
  prisma: PrismaClient;
  userId?: string;
}

@InputType()
export class CreateSetlistInput {
  @Field()
  title: string;

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
}

@Resolver(() => Setlist)
export class SetlistResolver {
  @Query(() => [Setlist])
  @UseMiddleware(AuthMiddleware)
  async setlists(@Ctx() ctx: Context): Promise<Setlist[]> {
    return ctx.prisma.setlist.findMany({
      where: { userId: ctx.userId },
      include: { 
        user: true,
        items: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' },
    }) as Promise<Setlist[]>;
  }

  @Query(() => Setlist, { nullable: true })
  @UseMiddleware(AuthMiddleware)
  async setlist(
    @Arg("id", () => ID) id: string,
    @Ctx() ctx: Context
  ): Promise<Setlist | null> {
    return ctx.prisma.setlist.findFirst({
      where: { id, userId: ctx.userId },
      include: { 
        user: true,
        items: {
          orderBy: { order: 'asc' }
        }
      },
    }) as Promise<Setlist | null>;
  }

  @Mutation(() => Setlist)
  @UseMiddleware(AuthMiddleware)
  async createSetlist(
    @Arg("input") input: CreateSetlistInput,
    @Ctx() ctx: Context
  ): Promise<Setlist> {
    return ctx.prisma.setlist.create({
      data: {
        ...input,
        userId: ctx.userId!,
      },
      include: { 
        user: true,
        items: {
          orderBy: { order: 'asc' }
        }
      },
    }) as Promise<Setlist>;
  }

  @Mutation(() => Setlist)
  @UseMiddleware(AuthMiddleware)
  async updateSetlist(
    @Arg("id", () => ID) id: string,
    @Arg("input") input: UpdateSetlistInput,
    @Ctx() ctx: Context
  ): Promise<Setlist> {
    const setlist = await ctx.prisma.setlist.findFirst({
      where: { id, userId: ctx.userId },
    });

    if (!setlist) {
      throw new Error("Setlist not found");
    }

    return ctx.prisma.setlist.update({
      where: { id },
      data: input,
      include: { 
        user: true,
        items: {
          orderBy: { order: 'asc' }
        }
      },
    }) as Promise<Setlist>;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(AuthMiddleware)
  async deleteSetlist(
    @Arg("id", () => ID) id: string,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    const setlist = await ctx.prisma.setlist.findFirst({
      where: { id, userId: ctx.userId },
    });

    if (!setlist) {
      throw new Error("Setlist not found");
    }

    await ctx.prisma.setlist.delete({
      where: { id },
    });

    return true;
  }
}