/**
 * 認証関連の定数
 */

// パスワードポリシー
export const PASSWORD_POLICY = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  // 小文字、大文字、数字を含む8文字以上
  REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  MESSAGE: 'パスワードは8文字以上で、大文字・小文字・数字を含む必要があります',
} as const;

// メールアドレスポリシー
export const EMAIL_POLICY = {
  MAX_LENGTH: 254,
  MESSAGE: '有効なメールアドレスを入力してください',
} as const;

// ユーザー名ポリシー
export const USERNAME_POLICY = {
  MIN_LENGTH: 1,
  MAX_LENGTH: 50,
  // 英数字、ひらがな、カタカナ、漢字、アンダースコアのみ
  REGEX: /^[a-zA-Z0-9_\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+$/,
  MESSAGE: 'ユーザー名は英数字、ひらがな、カタカナ、漢字、アンダースコアのみ使用可能です',
} as const;
