import { Resolver, Query, Mutation, Arg, Ctx, UseMiddleware, InputType, Field, ID, Int } from "type-graphql";
import { PrismaClient } from "@prisma/client";
import { SetlistItem } from "../types/SetlistItem";
import { AuthMiddleware } from "../middleware/auth";

interface Context {
  prisma: PrismaClient;
  userId?: string;
}

@InputType()
export class CreateSetlistItemInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  note?: string;

  @Field(() => Int)
  order: number;

  @Field(() => ID)
  setlistId: string;
}

@InputType()
export class UpdateSetlistItemInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  note?: string;

  @Field(() => Int, { nullable: true })
  order?: number;
}

@Resolver(() => SetlistItem)
export class SetlistItemResolver {
  @Query(() => [SetlistItem])
  @UseMiddleware(AuthMiddleware)
  async setlistItems(
    @Arg("setlistId", () => ID) setlistId: string,
    @Ctx() ctx: Context
  ): Promise<SetlistItem[]> {
    // First verify that the setlist belongs to the authenticated user
    const setlist = await ctx.prisma.setlist.findFirst({
      where: { id: setlistId, userId: ctx.userId },
    });

    if (!setlist) {
      throw new Error("Setlist not found");
    }

    return ctx.prisma.setlistItem.findMany({
      where: { setlistId },
      include: { setlist: true },
      orderBy: { order: 'asc' },
    }) as Promise<SetlistItem[]>;
  }

  @Query(() => SetlistItem, { nullable: true })
  @UseMiddleware(AuthMiddleware)
  async setlistItem(
    @Arg("id", () => ID) id: string,
    @Ctx() ctx: Context
  ): Promise<SetlistItem | null> {
    const setlistItem = await ctx.prisma.setlistItem.findUnique({
      where: { id },
      include: { setlist: true },
    });

    if (!setlistItem) {
      return null;
    }

    // Verify that the setlist belongs to the authenticated user
    if (setlistItem.setlist.userId !== ctx.userId) {
      throw new Error("Setlist item not found");
    }

    return setlistItem as SetlistItem;
  }

  @Mutation(() => SetlistItem)
  @UseMiddleware(AuthMiddleware)
  async createSetlistItem(
    @Arg("input") input: CreateSetlistItemInput,
    @Ctx() ctx: Context
  ): Promise<SetlistItem> {
    // First verify that the setlist belongs to the authenticated user
    const setlist = await ctx.prisma.setlist.findFirst({
      where: { id: input.setlistId, userId: ctx.userId },
    });

    if (!setlist) {
      throw new Error("Setlist not found");
    }

    return ctx.prisma.setlistItem.create({
      data: input,
      include: { setlist: true },
    }) as Promise<SetlistItem>;
  }

  @Mutation(() => SetlistItem)
  @UseMiddleware(AuthMiddleware)
  async updateSetlistItem(
    @Arg("id", () => ID) id: string,
    @Arg("input") input: UpdateSetlistItemInput,
    @Ctx() ctx: Context
  ): Promise<SetlistItem> {
    const setlistItem = await ctx.prisma.setlistItem.findUnique({
      where: { id },
      include: { setlist: true },
    });

    if (!setlistItem) {
      throw new Error("Setlist item not found");
    }

    // Verify that the setlist belongs to the authenticated user
    if (setlistItem.setlist.userId !== ctx.userId) {
      throw new Error("Setlist item not found");
    }

    return ctx.prisma.setlistItem.update({
      where: { id },
      data: input,
      include: { setlist: true },
    }) as Promise<SetlistItem>;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(AuthMiddleware)
  async deleteSetlistItem(
    @Arg("id", () => ID) id: string,
    @Ctx() ctx: Context
  ): Promise<boolean> {
    const setlistItem = await ctx.prisma.setlistItem.findUnique({
      where: { id },
      include: { setlist: true },
    });

    if (!setlistItem) {
      throw new Error("Setlist item not found");
    }

    // Verify that the setlist belongs to the authenticated user
    if (setlistItem.setlist.userId !== ctx.userId) {
      throw new Error("Setlist item not found");
    }

    await ctx.prisma.setlistItem.delete({
      where: { id },
    });

    return true;
  }

  @Mutation(() => [SetlistItem])
  @UseMiddleware(AuthMiddleware)
  async reorderSetlistItems(
    @Arg("setlistId", () => ID) setlistId: string,
    @Arg("itemIds", () => [ID]) itemIds: string[],
    @Ctx() ctx: Context
  ): Promise<SetlistItem[]> {
    // First verify that the setlist belongs to the authenticated user
    const setlist = await ctx.prisma.setlist.findFirst({
      where: { id: setlistId, userId: ctx.userId },
    });

    if (!setlist) {
      throw new Error("Setlist not found");
    }

    // Update the order of each item
    await Promise.all(
      itemIds.map((itemId, index) =>
        ctx.prisma.setlistItem.update({
          where: { id: itemId },
          data: { order: index + 1 },
        })
      )
    );

    // Return the reordered items
    return ctx.prisma.setlistItem.findMany({
      where: { setlistId },
      include: { setlist: true },
      orderBy: { order: 'asc' },
    }) as Promise<SetlistItem[]>;
  }
}