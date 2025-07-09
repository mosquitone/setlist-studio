import { ObjectType, Field, ID, Int } from 'type-graphql';

@ObjectType()
export class SetlistItem {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  note?: string;

  @Field(() => Int)
  order!: number;

  @Field(() => String)
  setlistId!: string;

  // Note: Setlist relation removed to avoid circular dependencies
  // Would be resolved through GraphQL resolvers if needed
}
