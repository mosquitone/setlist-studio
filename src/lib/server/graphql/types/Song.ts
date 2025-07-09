import { ObjectType, Field, ID, Int } from 'type-graphql';

@ObjectType()
export class Song {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  artist?: string;

  @Field(() => Int, { nullable: true })
  duration?: number;

  @Field(() => String, { nullable: true })
  key?: string;

  @Field(() => Int, { nullable: true })
  tempo?: number;

  @Field(() => String, { nullable: true })
  notes?: string;

  @Field(() => String)
  userId!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  // Note: User relation removed to avoid circular dependencies
  // Would be resolved through GraphQL resolvers if needed
}
