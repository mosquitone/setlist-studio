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
} from 'type-graphql'
import { PrismaClient } from '@prisma/client'
import { Setlist } from '../types/Setlist'
import { SetlistItem } from '../types/SetlistItem'
import { AuthMiddleware } from '../middleware/jwt-auth-middleware'

interface Context {
  prisma: PrismaClient
  userId?: string
}

@InputType()
export class CreateSetlistItemForSetlistInput {
  @Field()
  title: string

  @Field({ nullable: true })
  note?: string

  @Field(() => Int)
  order: number
}

@InputType()
export class CreateSetlistInput {
  @Field()
  title: string

  @Field()
  bandName: string

  @Field({ nullable: true })
  eventName?: string

  @Field({ nullable: true })
  eventDate?: Date

  @Field({ nullable: true })
  openTime?: string

  @Field({ nullable: true })
  startTime?: string

  @Field()
  theme: string

  @Field({ defaultValue: false })
  isPublic: boolean

  @Field(() => [CreateSetlistItemForSetlistInput], { nullable: true })
  items?: CreateSetlistItemForSetlistInput[]
}

@InputType()
export class UpdateSetlistInput {
  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  bandName?: string

  @Field({ nullable: true })
  eventName?: string

  @Field({ nullable: true })
  eventDate?: Date

  @Field({ nullable: true })
  openTime?: string

  @Field({ nullable: true })
  startTime?: string

  @Field({ nullable: true })
  theme?: string

  @Field({ nullable: true })
  isPublic?: boolean

  @Field(() => [CreateSetlistItemForSetlistInput], { nullable: true })
  items?: CreateSetlistItemForSetlistInput[]
}

@Resolver(() => Setlist)
export class SetlistResolver {
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
    }) as Promise<Setlist[]>
  }

  @Query(() => Setlist, { nullable: true })
  async setlist(@Arg('id', () => ID) id: string, @Ctx() ctx: Context): Promise<Setlist | null> {
    const setlist = await ctx.prisma.setlist.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!setlist) {
      return null
    }

    // For ISR, always return the setlist data (access control will be handled on client-side)
    // This allows proper SSR/ISR generation while maintaining security on the frontend
    return setlist as Setlist
  }

  @Mutation(() => Setlist)
  @UseMiddleware(AuthMiddleware)
  async createSetlist(
    @Arg('input') input: CreateSetlistInput,
    @Ctx() ctx: Context,
  ): Promise<Setlist> {
    const { items, ...setlistData } = input

    const setlist = await ctx.prisma.setlist.create({
      data: {
        ...setlistData,
        userId: ctx.userId!,
        items: items
          ? {
              create: items.map(item => ({
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
    })

    return setlist as Setlist
  }

  @Mutation(() => Boolean)
  @UseMiddleware(AuthMiddleware)
  async toggleSetlistVisibility(
    @Arg('id', () => ID) id: string,
    @Ctx() ctx: Context,
  ): Promise<boolean> {
    const setlist = await ctx.prisma.setlist.findFirst({
      where: { id, userId: ctx.userId },
    })

    if (!setlist) {
      throw new Error('Setlist not found')
    }

    await ctx.prisma.setlist.update({
      where: { id },
      data: { isPublic: !setlist.isPublic },
    })

    return true
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
    })

    if (!setlist) {
      throw new Error('Setlist not found')
    }

    const { items, ...setlistData } = input

    // Update setlist and handle items
    const updatedSetlist = await ctx.prisma.setlist.update({
      where: { id },
      data: {
        ...setlistData,
        items: items
          ? {
              deleteMany: {}, // Delete all existing items
              create: items.map(item => ({
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
    })

    return updatedSetlist as Setlist
  }

  @Mutation(() => Boolean)
  @UseMiddleware(AuthMiddleware)
  async deleteSetlist(@Arg('id', () => ID) id: string, @Ctx() ctx: Context): Promise<boolean> {
    const setlist = await ctx.prisma.setlist.findFirst({
      where: { id, userId: ctx.userId },
    })

    if (!setlist) {
      throw new Error('Setlist not found')
    }

    await ctx.prisma.setlist.delete({
      where: { id },
    })

    return true
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
    })
    return (setlistData?.items || []) as SetlistItem[]
  }
}
