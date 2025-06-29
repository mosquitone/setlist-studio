import { ObjectType, Field, ID, Int } from "type-graphql";
import { Setlist } from "./Setlist";

@ObjectType()
export class SetlistItem {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  note?: string;

  @Field(() => Int)
  order: number;

  @Field()
  setlistId: string;

  @Field(() => Setlist)
  setlist: Setlist;
}