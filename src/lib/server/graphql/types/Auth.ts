import { ObjectType, Field, InputType } from 'type-graphql';
import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { User } from './User';

@ObjectType()
export class AuthPayload {
  @Field()
  token!: string;

  @Field(() => User)
  user!: User;
}

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail({}, { message: '有効なメールアドレスを入力してください' })
  @MaxLength(254, { message: 'メールアドレスは254文字以内で入力してください' })
  email!: string;

  @Field()
  @IsString()
  @MinLength(1, { message: 'ユーザー名は必須です' })
  @MaxLength(50, { message: 'ユーザー名は50文字以内で入力してください' })
  @Matches(/^[a-zA-Z0-9_\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+$/, {
    message: 'ユーザー名は英数字、ひらがな、カタカナ、漢字、アンダースコアのみ使用可能です',
  })
  username!: string;

  @Field()
  @IsString()
  @MinLength(8, { message: 'パスワードは8文字以上である必要があります' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'パスワードは大文字・小文字・数字・特殊文字（@$!%*?&）を含む必要があります',
  })
  password!: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  @MinLength(1)
  password!: string;
}

@InputType()
export class PasswordResetRequestInput {
  @Field()
  @IsEmail({}, { message: '有効なメールアドレスを入力してください' })
  email!: string;
}

@InputType()
export class PasswordResetInput {
  @Field()
  @IsString()
  @MinLength(1, { message: 'トークンは必須です' })
  token!: string;

  @Field()
  @IsString()
  @MinLength(1, { message: 'リクエストIDは必須です' })
  requestId!: string;

  @Field()
  @IsString()
  @MinLength(8, { message: 'パスワードは8文字以上である必要があります' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'パスワードは大文字・小文字・数字・特殊文字（@$!%*?&）を含む必要があります',
  })
  newPassword!: string;
}

@ObjectType()
export class PasswordResetResponse {
  @Field()
  success!: boolean;

  @Field()
  message!: string;

  @Field({ nullable: true })
  requestId?: string;
}
