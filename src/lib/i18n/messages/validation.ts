/**
 * Validation messages for i18n system
 * バリデーションメッセージの多言語化
 */

export interface ValidationMessages {
  required: string;
  emailInvalid: string;
  usernameInvalid: string;
  passwordTooShort: string;
  passwordsDoNotMatch: string;
  usernameTooShort: string;
  titleTooShort: string;
  titleTooLong: string;
  agreeToTerms: string;
}

// 日本語版
export const validationJa: ValidationMessages = {
  required: '必須項目です',
  emailInvalid: '有効なメールアドレスを入力してください',
  usernameInvalid: '無効なユーザー名です',
  passwordTooShort: 'パスワードは8文字以上で、大文字・小文字・数字を含む必要があります',
  passwordsDoNotMatch: 'パスワードが一致しません',
  usernameTooShort: 'ユーザー名が短すぎます',
  titleTooShort: 'タイトルが短すぎます',
  titleTooLong: 'タイトルが長すぎます（100文字以内）',
  agreeToTerms: '利用規約とプライバシーポリシーに同意してください',
};

// 英語版
export const validationEn: ValidationMessages = {
  required: 'This field is required',
  emailInvalid: 'Invalid email address',
  usernameInvalid: 'Invalid username',
  passwordTooShort:
    'Password must be at least 8 characters and contain uppercase, lowercase, and numbers',
  passwordsDoNotMatch: 'Passwords do not match',
  usernameTooShort: 'Username is too short',
  titleTooShort: 'Title is too short',
  titleTooLong: 'Title is too long (100 characters or less)',
  agreeToTerms: 'Please agree to the terms and privacy policy',
};
