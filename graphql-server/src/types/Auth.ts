import { ObjectType, Field, InputType } from 'type-graphql'
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
  email!: string

  @Field()
  username!: string

  @Field()
  password!: string
}

@InputType()
export class LoginInput {
  @Field()
  email!: string

  @Field()
  password!: string
}
