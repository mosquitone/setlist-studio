import { ObjectType, Field, ID, Int } from 'type-graphql'

@ObjectType()
export class Song {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field({ nullable: true })
  artist?: string

  @Field(() => Int, { nullable: true })
  duration?: number

  @Field({ nullable: true })
  key?: string

  @Field(() => Int, { nullable: true })
  tempo?: number

  @Field({ nullable: true })
  notes?: string

  @Field()
  userId!: string

  @Field()
  createdAt!: Date

  @Field()
  updatedAt!: Date

  // Note: User relation removed to avoid circular dependencies
  // Would be resolved through GraphQL resolvers if needed
}
