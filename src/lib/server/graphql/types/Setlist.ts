import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class Setlist {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  bandName?: string;

  @Field(() => String, { nullable: true })
  eventName?: string;

  @Field(() => Date, { nullable: true })
  eventDate?: Date;

  @Field(() => String, { nullable: true })
  openTime?: string;

  @Field(() => String, { nullable: true })
  startTime?: string;

  @Field(() => String, { nullable: true })
  theme?: string;

  @Field(() => Boolean)
  isPublic!: boolean;

  @Field(() => String)
  userId!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  // Note: Relations removed to avoid circular dependencies
  // These would be resolved through GraphQL resolvers if needed
}
