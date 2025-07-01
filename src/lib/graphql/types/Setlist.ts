import { ObjectType, Field, ID } from 'type-graphql'

@ObjectType()
export class Setlist {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

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

  @Field()
  userId!: string

  @Field()
  createdAt!: Date

  @Field()
  updatedAt!: Date

  // Note: Relations removed to avoid circular dependencies
  // These would be resolved through GraphQL resolvers if needed
}
