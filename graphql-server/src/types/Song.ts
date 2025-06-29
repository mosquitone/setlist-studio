import { ObjectType, Field, ID, Int } from "type-graphql";
import { User } from "./User";

@ObjectType()
export class Song {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  artist?: string;

  @Field(() => Int, { nullable: true })
  duration?: number;

  @Field({ nullable: true })
  key?: string;

  @Field(() => Int, { nullable: true })
  tempo?: number;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  userId: string;

  @Field(() => User)
  user: User;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}