import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field()
  username!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  // Note: Song and Setlist relations removed to avoid circular dependencies
  // These would be resolved through GraphQL resolvers if needed
}
