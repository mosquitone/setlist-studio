import { ObjectType, Field, ID } from "type-graphql";
import { User } from "./User";
import { SetlistItem } from "./SetlistItem";

@ObjectType()
export class Setlist {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  eventName?: string;

  @Field({ nullable: true })
  eventDate?: Date;

  @Field({ nullable: true })
  venue?: string;

  @Field()
  userId: string;

  @Field(() => User)
  user: User;

  @Field(() => [SetlistItem])
  items: SetlistItem[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}