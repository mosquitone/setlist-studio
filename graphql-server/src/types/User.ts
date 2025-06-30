import { ObjectType, Field, ID } from 'type-graphql'
import { Song } from './Song'
import { Setlist } from './Setlist'

@ObjectType()
export class User {
  @Field(() => ID)
  id!: string

  @Field()
  email!: string

  @Field()
  username!: string

  @Field()
  createdAt!: Date

  @Field()
  updatedAt!: Date

  // Optional relations - not used by frontend queries
  @Field(() => [Song], { nullable: true })
  songs?: Song[]

  @Field(() => [Setlist], { nullable: true })
  setlists?: Setlist[]
}
