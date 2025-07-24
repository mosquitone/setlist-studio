/**
 * Error messages for i18n system
 * エラーメッセージの多言語化
 */

export interface ErrorMessages {
  serverError: string;
  validationError: string;
  networkError: string;
  unknownError: string;
  setlistNotFound: string;
  songNotFound: string;
  songsNotFoundToDelete: string;
  unauthorized: string;
  forbidden: string;
  authenticationRequired: string;
  authenticationRequiredPrivate: string;
  unauthorizedAccessPrivate: string;
  jwtNotConfigured: string;
  usernameAlreadyExists: string;
  setlistItemNotFound: string;
  somethingWentWrong: string;
  // セキュリティ関連
  rateLimitExceeded: string;
  authRateLimitExceeded: string;
  emailRateLimitExceeded: string;
  csrfValidationFailed: string;
  inputTooLong: string;
  urlCopiedToClipboard: string;
  // Google OAuth エラー
  emailAccountExists: string;
  googleAuthFailed: string;
  googleAccountExists: string;
}

// 日本語版
export const errorsJa: ErrorMessages = {
  serverError: 'サーバーエラーが発生しました',
  validationError: '入力内容に誤りがあります',
  networkError: 'ネットワークエラーが発生しました',
  unknownError: '予期せぬエラーが発生しました',
  setlistNotFound: 'セットリストが見つかりません',
  songNotFound: '楽曲が見つかりません',
  songsNotFoundToDelete: '削除する楽曲が見つかりません',
  unauthorized: '認証が必要です',
  forbidden: 'アクセス権限がありません',
  authenticationRequired: '認証が必要です',
  authenticationRequiredPrivate: '非公開セットリストへのアクセスには認証が必要です',
  unauthorizedAccessPrivate: '非公開セットリストへの不正アクセスです',
  jwtNotConfigured: '認証システムの設定エラーが発生しました',
  usernameAlreadyExists: 'このユーザー名は既に使用されています',
  setlistItemNotFound: 'セットリスト項目が見つかりません',
  somethingWentWrong: '何らかのエラーが発生しました',
  // セキュリティ関連
  rateLimitExceeded: 'リクエスト制限に達しました。しばらく時間をおいてから再試行してください',
  authRateLimitExceeded:
    '認証の試行回数が上限に達しました。しばらく時間をおいてから再試行してください',
  emailRateLimitExceeded:
    'メール送信回数が上限に達しました。しばらく時間をおいてから再試行してください',
  csrfValidationFailed: 'セキュリティ検証に失敗しました。ページを再読み込みしてください',
  inputTooLong: '入力が長すぎます。{maxLength}文字以下にしてください',
  urlCopiedToClipboard: 'URLをクリップボードにコピーしました',
  // Google OAuth エラー
  emailAccountExists:
    'このメールアドレス（{email}）は既にメール認証で登録されています。パスワードでログインしてください。',
  googleAuthFailed: 'Google認証に失敗しました。再度お試しください。',
  googleAccountExists:
    'このメールアドレス（{email}）は既に別のGoogleアカウントで登録されています。元のGoogleアカウントでログインしてください。',
};

// 英語版
export const errorsEn: ErrorMessages = {
  serverError: 'Server error occurred',
  validationError: 'Validation error',
  networkError: 'Network error occurred',
  unknownError: 'Unknown error occurred',
  setlistNotFound: 'Setlist not found',
  songNotFound: 'Song not found',
  songsNotFoundToDelete: 'No songs found to delete',
  unauthorized: 'Authentication required',
  forbidden: 'Access denied',
  authenticationRequired: 'Authentication required',
  authenticationRequiredPrivate: 'Authentication required to access private setlist',
  unauthorizedAccessPrivate: 'Unauthorized access to private setlist',
  jwtNotConfigured: 'Authentication system configuration error',
  usernameAlreadyExists: 'This username is already in use',
  setlistItemNotFound: 'Setlist item not found',
  somethingWentWrong: 'Something went wrong',
  // セキュリティ関連
  rateLimitExceeded: 'Request limit exceeded. Please try again later',
  authRateLimitExceeded: 'Authentication attempts exceeded. Please try again later',
  emailRateLimitExceeded: 'Email sending limit exceeded. Please try again later',
  csrfValidationFailed: 'Security validation failed. Please reload the page',
  inputTooLong: 'Input is too long. Please keep it under {maxLength} characters',
  urlCopiedToClipboard: 'URL copied to clipboard',
  // Google OAuth エラー
  emailAccountExists:
    'This email address ({email}) is already registered with email authentication. Please login with your password.',
  googleAuthFailed: 'Google authentication failed. Please try again.',
  googleAccountExists:
    'This email address ({email}) is already registered with a different Google account. Please login with your original Google account.',
};
