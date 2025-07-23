import { ObjectType, Field, InputType, ID } from 'type-graphql';

@ObjectType()
export class EmailHistory {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  userId!: string;

  @Field(() => String)
  oldEmail!: string;

  @Field(() => String)
  newEmail!: string;

  @Field(() => String)
  changeMethod!: string; // "manual" | "google_oauth" | "verification"

  @Field(() => Date)
  changedAt!: Date;

  @Field(() => String, { nullable: true })
  ipAddress?: string;

  @Field(() => String, { nullable: true })
  userAgent?: string;

  @Field(() => String, { nullable: true })
  authProvider?: string;

  @Field(() => Date, { nullable: true })
  lastUsedAt?: Date;

  @Field(() => Boolean)
  verificationSent!: boolean;
}

@InputType()
export class EmailHistoryInput {
  @Field(() => String)
  oldEmail!: string;

  @Field(() => String)
  newEmail!: string;

  @Field(() => String)
  changeMethod!: string;

  @Field(() => String, { nullable: true })
  authProvider?: string;
}
