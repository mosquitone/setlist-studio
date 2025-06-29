import { ObjectType, Field, ID, Int } from "type-graphql";
import { Song } from "./Song";
import { Setlist } from "./Setlist";

@ObjectType()
export class SetlistItem {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  order: number;

  @Field({ nullable: true })
  notes?: string;

  @Field()
  songId: string;

  @Field(() => Song)
  song: Song;

  @Field()
  setlistId: string;

  @Field(() => Setlist)
  setlist: Setlist;
}