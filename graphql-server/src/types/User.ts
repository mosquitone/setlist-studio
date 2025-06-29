import { ObjectType, Field, ID } from 'type-graphql'
import { Song } from './Song'
import { Setlist } from './Setlist'

@ObjectType()
export class User {
  @Field(() => ID)
  id: string

  @Field()
  email: string

  @Field()
  username: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => [Song])
  songs: Song[]

  @Field(() => [Setlist])
  setlists: Setlist[]
}
