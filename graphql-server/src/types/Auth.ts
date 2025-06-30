import { ObjectType, Field, InputType } from 'type-graphql'
import { IsEmail, IsString, MinLength } from 'class-validator'
import { User } from './User'

@ObjectType()
export class AuthPayload {
  @Field()
  token!: string

  @Field(() => User)
  user!: User
}

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  email!: string

  @Field()
  @IsString()
  @MinLength(1)
  username!: string

  @Field()
  @IsString()
  @MinLength(6)
  password!: string
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email!: string

  @Field()
  @IsString()
  @MinLength(1)
  password!: string
}
