import { Resolver, Mutation, Arg, Ctx } from 'type-graphql'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AuthPayload, RegisterInput, LoginInput } from '../types/Auth'
import { User } from '../types/User'

interface Context {
  prisma: PrismaClient
}

@Resolver()
export class AuthResolver {
  @Mutation(() => AuthPayload)
  async register(@Arg('input') input: RegisterInput, @Ctx() ctx: Context): Promise<AuthPayload> {
    const existingUser = await ctx.prisma.user.findFirst({
      where: {
        OR: [{ email: input.email }, { username: input.username }],
      },
    })

    if (existingUser) {
      throw new Error('User with this email or username already exists')
    }

    const hashedPassword = await bcrypt.hash(input.password, 12)

    const user = await ctx.prisma.user.create({
      data: {
        email: input.email,
        username: input.username,
        password: hashedPassword,
      },
    })

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'fallback-secret', {
      expiresIn: '7d',
    })

    return {
      token,
      user,
    }
  }

  @Mutation(() => AuthPayload)
  async login(@Arg('input') input: LoginInput, @Ctx() ctx: Context): Promise<AuthPayload> {
    const user = await ctx.prisma.user.findUnique({
      where: { email: input.email },
    })

    if (!user) {
      throw new Error('Invalid email or password')
    }

    const isValidPassword = await bcrypt.compare(input.password, user.password)
    if (!isValidPassword) {
      throw new Error('Invalid email or password')
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'fallback-secret', {
      expiresIn: '7d',
    })

    return {
      token,
      user,
    }
  }
}
