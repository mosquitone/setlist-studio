import { IsString, MinLength } from 'class-validator';
import { ObjectType, Field, InputType } from 'type-graphql';

import {
  PasswordField,
  EmailField,
  UsernameField,
  CurrentPasswordField,
  TokenField,
} from '../decorators/validation';

import { User } from './User';

@ObjectType()
export class AuthPayload {
  @Field(() => String)
  token!: string;

  @Field(() => User)
  user!: User;
}

@ObjectType()
export class RegistrationResponse {
  @Field(() => Boolean)
  success!: boolean;

  @Field(() => String)
  message!: string;

  @Field(() => String)
  email!: string;

  @Field(() => Boolean)
  requiresEmailVerification!: boolean;
}

@ObjectType()
export class EmailVerificationStatusResponse {
  @Field(() => Boolean)
  isVerified!: boolean;

  @Field(() => Boolean)
  canLogin!: boolean;
}

@InputType()
export class RegisterInput {
  @EmailField()
  email!: string;

  @UsernameField()
  username!: string;

  @PasswordField()
  password!: string;
}

@InputType()
export class LoginInput {
  @EmailField()
  email!: string;

  @Field(() => String)
  @IsString()
  @MinLength(1)
  password!: string;
}

@InputType()
export class PasswordResetRequestInput {
  @EmailField()
  email!: string;
}

@InputType()
export class PasswordResetInput {
  @TokenField()
  token!: string;

  @PasswordField()
  newPassword!: string;
}

@ObjectType()
export class PasswordResetResponse {
  @Field(() => Boolean)
  success!: boolean;

  @Field(() => String)
  message!: string;
}

@InputType()
export class EmailVerificationInput {
  @TokenField()
  token!: string;
}

@InputType()
export class EmailChangeInput {
  @EmailField()
  newEmail!: string;

  @CurrentPasswordField({ nullable: true })
  currentPassword?: string;

  @PasswordField({ nullable: true })
  newPassword?: string;
}

@InputType()
export class EmailChangeConfirmInput {
  @TokenField()
  token!: string;
}

@ObjectType()
export class EmailVerificationResponse {
  @Field(() => Boolean)
  success!: boolean;

  @Field(() => String)
  message!: string;
}

@ObjectType()
export class EmailChangeResponse {
  @Field(() => Boolean)
  success!: boolean;

  @Field(() => String)
  message!: string;
}

@InputType()
export class ChangePasswordInput {
  @CurrentPasswordField()
  currentPassword!: string;

  @PasswordField()
  newPassword!: string;
}

@ObjectType()
export class ChangePasswordResponse {
  @Field(() => Boolean)
  success!: boolean;

  @Field(() => String)
  message!: string;
}

@ObjectType()
export class PasswordResetTokenInfo {
  @Field(() => String)
  email!: string;

  @Field(() => Boolean)
  isValid!: boolean;
}
