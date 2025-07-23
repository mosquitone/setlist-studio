import { IsEmail, IsString, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';
import { Field } from 'type-graphql';

import { PASSWORD_POLICY, EMAIL_POLICY, USERNAME_POLICY } from '@/lib/constants/auth';

/**
 * パスワードフィールド用の共通デコレーター
 * @param options - nullable: trueでオプショナルフィールドになる
 */
export function PasswordField(options?: { nullable?: boolean }) {
  return function (target: object, propertyKey: string) {
    // GraphQL Field
    Field(() => String, { nullable: options?.nullable })(target, propertyKey);

    // Validation decorators
    if (options?.nullable) {
      IsOptional()(target, propertyKey);
    }
    IsString()(target, propertyKey);
    MinLength(PASSWORD_POLICY.MIN_LENGTH, {
      message: `パスワードは${PASSWORD_POLICY.MIN_LENGTH}文字以上である必要があります`,
    })(target, propertyKey);
    MaxLength(PASSWORD_POLICY.MAX_LENGTH, {
      message: `パスワードは${PASSWORD_POLICY.MAX_LENGTH}文字以内で入力してください`,
    })(target, propertyKey);
    Matches(PASSWORD_POLICY.REGEX, {
      message: PASSWORD_POLICY.MESSAGE,
    })(target, propertyKey);
  };
}

/**
 * メールアドレスフィールド用の共通デコレーター
 */
export function EmailField() {
  return function (target: object, propertyKey: string) {
    Field(() => String)(target, propertyKey);
    IsEmail({}, { message: EMAIL_POLICY.MESSAGE })(target, propertyKey);
    MaxLength(EMAIL_POLICY.MAX_LENGTH, {
      message: `メールアドレスは${EMAIL_POLICY.MAX_LENGTH}文字以内で入力してください`,
    })(target, propertyKey);
  };
}

/**
 * ユーザー名フィールド用の共通デコレーター
 */
export function UsernameField() {
  return function (target: object, propertyKey: string) {
    Field(() => String)(target, propertyKey);
    IsString()(target, propertyKey);
    MinLength(USERNAME_POLICY.MIN_LENGTH, { message: 'ユーザー名は必須です' })(target, propertyKey);
    MaxLength(USERNAME_POLICY.MAX_LENGTH, {
      message: `ユーザー名は${USERNAME_POLICY.MAX_LENGTH}文字以内で入力してください`,
    })(target, propertyKey);
    Matches(USERNAME_POLICY.REGEX, {
      message: USERNAME_POLICY.MESSAGE,
    })(target, propertyKey);
  };
}

/**
 * 現在のパスワードフィールド用デコレーター（オプショナル対応）
 */
export function CurrentPasswordField(options?: { nullable?: boolean }) {
  return function (target: object, propertyKey: string) {
    Field(() => String, { nullable: options?.nullable })(target, propertyKey);

    if (options?.nullable) {
      IsOptional()(target, propertyKey);
    }
    IsString()(target, propertyKey);
    MinLength(1, { message: '現在のパスワードは必須です' })(target, propertyKey);
  };
}

/**
 * トークンフィールド用デコレーター
 */
export function TokenField() {
  return function (target: object, propertyKey: string) {
    Field(() => String)(target, propertyKey);
    IsString()(target, propertyKey);
    MinLength(1, { message: 'トークンは必須です' })(target, propertyKey);
  };
}
