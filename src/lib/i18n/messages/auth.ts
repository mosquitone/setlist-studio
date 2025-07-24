/**
 * Authentication Messages
 * 認証関連メッセージ
 */

export interface AuthMessages {
  loginRequired: string;
  authenticationExpired: string;
  serverError: string;
  userAlreadyExists: string;
  invalidCredentials: string;
  emailSent: string;
  passwordResetRequested: string;
  passwordResetSuccess: string;
  invalidResetToken: string;
  emailVerified: string;
  invalidVerificationToken: string;
  emailChangedSuccess: string;
  invalidChangeToken: string;
  passwordChangeSuccess: string;
  currentPasswordIncorrect: string;
  emailAlreadyVerified: string;
  authRequired: string;
  userNotFound: string;
  rateLimitExceeded: string;
  checkingLoginStatus: string;

  // メールアドレス履歴・所有権確認
  emailHistory: string;
  emailOwnershipVerification: string;
  emailCooldownActive: string;
  verifyOwnershipFirst: string;
  emailOwnershipVerified: string;

  // ログイン・登録フォーム
  login: string;
  logout: string;
  register: string;
  email: string;
  password: string;
  username: string;
  rememberMe: string;
  loginButton: string;
  registerButton: string;
  loggingIn: string;
  registering: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  confirmPasswordHelper: string;
  passwordRequirements: string;
  changePassword: string;
  resetPassword: string;
  forgotPassword: string;
  sendResetEmail: string;
  passwordResetTitle: string;
  passwordResetDescription: string;
  resendPasswordReset: string;
  resendAvailableIn: string;
  resendCount: string;
  emailNotFound: string;
  resetEmailHelp: string;
  checkSpamFolder: string;
  mayTakeMinutes: string;
  canResendAbove: string;
  backToLogin: string;
  checkYourEmail: string;

  // メール認証ページ
  emailVerificationTitle: string;
  emailVerificationDescription: string;
  accountCreated: string;
  accountCreatedDescription: string;
  emailVerificationPending: string;
  emailVerificationPendingDescription: string;
  loginAvailable: string;
  loginAvailableDescription: string;
  emailConfirmationRequest: string;
  verificationEmailSent: string;
  clickVerificationLink: string;
  emailNotInSpam: string;
  resendVerificationEmail: string;
  resendAvailable: string;
  resendCount2: string;
  emailNotReceived: string;
  checkSpamFolder2: string;
  mayTakeMinutes2: string;
  checkEmailTypo: string;
  verifyEmail: string;
  resendVerification: string;

  // メール認証確認ページ関連
  emailVerificationProcessing: string;
  emailVerificationComplete: string;
  emailVerificationError: string;
  emailVerificationProcessingDescription: string;
  emailVerificationSuccessDescription: string;
  emailVerificationFailedDescription: string;
  emailVerificationFailedDefault: string;
  invalidVerificationLink: string;
  redirectingToLogin: string;
  resendingEmail: string;
  resendVerificationEmailButton: string;
  backToLoginPage: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  loginToManageSetlists: string;
  createAccountToStart: string;

  // Google認証
  signInWithGoogle: string;
  signUpWithGoogle: string;
  signingIn: string;
  signingUp: string;
  googleAuthError: string;

  // 利用規約・プライバシー
  terms: string;
  privacy: string;
  and: string;
  agree: string;

  // プロフィール関連（auth固有のみ）
  profile: string;
  noData: string;
  createdAt: string;
  accountId: string;

  // メールアドレス変更関連
  changeEmail: string;
  newEmail: string;
  currentEmail: string;
  emailChangeRequested: string;
  emailChangeSuccess: string;
  emailChangeConfirmation: string;
  emailChangeProcessing: string;
  emailChangeComplete: string;
  emailChangeError: string;
  emailChangeProcessingDescription: string;
  emailChangeSuccessDescription: string;
  emailChangeFailedDescription: string;
  emailChangeFailedDefault: string;
  invalidChangeLink: string;
  redirectingToProfile: string;
  backToProfile: string;
  invalidEmailFormat: string;
  emailAlreadyInUse: string;
  usernameAlreadyInUse: string;

  // 認証プロバイダー
  authProvider: string;
  authProviderEmail: string;
  authProviderGoogle: string;
  googleUserPasswordChangeNotAllowed: string;
  googleUserEmailChangeNote: string;
  setNewPassword: string;
  setNewPasswordHelper: string;
  googleChangeEmail: string;
  googleChangeEmailDescription: string;
  invalidGoogleToken: string;
  emailMismatch: string;
  googleEmailChangeSuccess: string;
  emailNotVerified: string;
  registrationSuccessEmailVerification: string;

  // アカウント削除
  deleteAccount: string;
  deleteAccountTitle: string;
  deleteAccountDescription: string;
  deleteAccountWarning: string;
  deleteAccountConfirm: string;
  deleteAccountCancel: string;
  deleteAccountSuccess: string;
  typeDeleteToConfirm: string;
  deleteToConfirm: string;

  // API Route メッセージ
  tokenRequired: string;
  invalidToken: string;
  invalidRequest: string;
  googleAuthRequired: string;
  googleAccountNotFound: string;
  sameGoogleAccount: string;
  googleAccountAlreadyRegistered: string;
  googleAccountSwitchSuccess: string;
  googleAccountSwitchFailed: string;
  temporaryAccessRestricted: string;
}

// 日本語メッセージ
export const authJa: AuthMessages = {
  loginRequired: 'ログインが必要です',
  authenticationExpired: '認証の有効期限が切れました。再度ログインしてください',
  serverError: '一時的な問題が発生しました。しばらくしてからもう一度お試しください',
  userAlreadyExists: 'このメールアドレスは既に登録されています',
  invalidCredentials: 'メールアドレスまたはパスワードが正しくありません',
  emailSent: 'メールを送信しました',
  passwordResetRequested: 'パスワードリセットのメールを送信しました',
  passwordResetSuccess: 'パスワードが正常にリセットされました',
  invalidResetToken: '無効または期限切れのリセットトークンです',
  emailVerified: 'メールアドレスが確認されました',
  invalidVerificationToken: '無効または期限切れの確認トークンです',
  emailChangedSuccess: 'メールアドレスが正常に変更されました',
  invalidChangeToken: '無効または期限切れの変更トークンです',
  passwordChangeSuccess: 'パスワードが正常に変更されました',
  currentPasswordIncorrect: '現在のパスワードが正しくありません',
  emailAlreadyVerified: 'メールアドレスは既に確認済みです',
  authRequired: '認証が必要です',
  userNotFound: 'ユーザーが見つかりません',
  rateLimitExceeded: 'リクエスト制限に達しました。しばらく待ってから再試行してください',
  checkingLoginStatus: 'ログイン状態を確認中...',
  redirectingToLogin: 'ログインページにリダイレクトしています...',

  // メールアドレス履歴・所有権確認
  emailHistory: 'メールアドレス変更履歴',
  emailOwnershipVerification: 'メールアドレス所有権確認',
  emailCooldownActive: 'このメールアドレスは一定期間変更できません',
  verifyOwnershipFirst: 'メールアドレスの所有権を確認してください',
  emailOwnershipVerified: 'メールアドレスの所有権が確認されました',

  login: 'ログイン',
  logout: 'ログアウト',
  register: '新規登録',
  email: 'メールアドレス',
  password: 'パスワード',
  username: 'ユーザー名',
  rememberMe: 'ログイン状態を保持',
  loginButton: 'ログイン',
  registerButton: '登録',
  loggingIn: 'ログイン中...',
  registering: '登録中...',
  currentPassword: '現在のパスワード',
  newPassword: '新しいパスワード',
  confirmPassword: 'パスワード（確認）',
  confirmPasswordHelper: '確認のため、もう一度同じパスワードを入力してください',
  passwordRequirements: 'パスワードは8文字以上で、大文字・小文字・数字を含む必要があります',
  changePassword: 'パスワードを変更',
  resetPassword: 'パスワードをリセット',
  forgotPassword: 'パスワードを忘れた方',
  sendResetEmail: 'リセットメールを送信',
  passwordResetTitle: 'パスワードリセット',
  passwordResetDescription: 'メールアドレスを入力してパスワードリセット手順をお送りします',
  resendPasswordReset: 'パスワードリセットを再送信',
  resendAvailableIn: '再送信可能まで',
  resendCount: '回送信しました',
  emailNotFound: 'メールが届かない場合：',
  resetEmailHelp: '登録済みのメールアドレスを入力してください',
  checkSpamFolder: '迷惑メールフォルダを確認してください',
  mayTakeMinutes: '数分かかる場合があります',
  canResendAbove: '上記ボタンから再送信できます',
  backToLogin: 'ログインページに戻る',
  checkYourEmail: 'メールをご確認ください。',
  emailVerificationTitle: 'メール認証をお願いします',
  emailVerificationDescription: 'アカウントを有効化するため、メールをご確認ください',
  accountCreated: 'アカウント作成完了',
  accountCreatedDescription: 'アカウントが正常に作成されました。',
  emailVerificationPending: 'メール認証待ち',
  emailVerificationPendingDescription: 'に認証メールを送信しました。',
  loginAvailable: 'ログイン可能',
  loginAvailableDescription: 'メール認証後にログインできます。',
  emailConfirmationRequest: '📧 メール確認のお願い',
  verificationEmailSent: 'に認証メールを送信しました。',
  clickVerificationLink:
    'メールに記載されている認証リンクをクリックしてアカウントを有効化してください。',
  emailNotInSpam: '※ メールが見つからない場合は、迷惑メールフォルダもご確認ください。',
  resendVerificationEmail: '認証メールを再送信',
  resendAvailable: '再送信可能まで',
  resendCount2: '回再送信済み',
  emailNotReceived: 'メールが届かない場合：',
  checkSpamFolder2: '迷惑メールフォルダを確認してください',
  mayTakeMinutes2: '数分かかる場合があります',
  checkEmailTypo: 'メールアドレスの入力間違いがないか確認してください',
  verifyEmail: 'メールアドレスを確認',
  resendVerification: '確認メールを再送信',

  // メール認証確認ページ関連
  emailVerificationProcessing: 'メール認証中...',
  emailVerificationComplete: 'メール認証完了',
  emailVerificationError: 'メール認証エラー',
  emailVerificationProcessingDescription: 'メールアドレスの認証を処理しています...',
  emailVerificationSuccessDescription: '認証が完了しました。ログインできます。',
  emailVerificationFailedDescription: 'メール認証に問題が発生しました。',
  emailVerificationFailedDefault: 'メール認証に失敗しました',
  invalidVerificationLink: '無効な認証リンクです。',
  resendingEmail: '再送信中...',
  resendVerificationEmailButton: '認証メールを再送信',
  backToLoginPage: 'ログインページに戻る',
  alreadyHaveAccount: 'アカウントをお持ちの方',
  dontHaveAccount: 'アカウントをお持ちでないですか？',
  loginToManageSetlists: 'アカウントにログインしてセットリストを管理',
  createAccountToStart: 'アカウントを作成してセットリスト作成を開始',

  // Google認証
  signInWithGoogle: 'Googleでログイン',
  signUpWithGoogle: 'Googleでアカウント作成',
  signingIn: 'サインイン中...',
  signingUp: 'アカウント作成中...',
  googleAuthError: 'Google認証でエラーが発生しました',
  terms: '利用規約',
  privacy: 'プライバシーポリシー',
  and: 'と',
  agree: 'に同意します',

  // プロフィール関連（auth固有のみ）
  profile: 'プロフィール',
  noData: 'データなし',
  createdAt: '作成日',
  accountId: 'アカウントID',

  // メールアドレス変更関連
  changeEmail: 'メールアドレス変更',
  newEmail: '新しいメールアドレス',
  currentEmail: '現在のメールアドレス',
  emailChangeRequested: 'メールアドレス変更の確認メールを送信しました',
  emailChangeSuccess: 'メールアドレスが正常に変更されました',
  emailChangeConfirmation: 'メールアドレス変更の確認',
  emailChangeProcessing: 'メールアドレス変更処理中...',
  emailChangeComplete: 'メールアドレス変更完了',
  emailChangeError: 'メールアドレス変更エラー',
  emailChangeProcessingDescription: 'メールアドレス変更を処理しています...',
  emailChangeSuccessDescription: 'メールアドレスが正常に変更されました。',
  emailChangeFailedDescription: 'メールアドレス変更に問題が発生しました。',
  emailChangeFailedDefault: 'メールアドレス変更に失敗しました',
  invalidChangeLink: '無効な変更確認リンクです。',
  redirectingToProfile: '3秒後にプロフィールページに移動します...',
  backToProfile: 'プロフィールページに戻る',
  invalidEmailFormat: 'メールアドレスの形式が正しくありません',
  emailAlreadyInUse: 'このメールアドレスは既に使用されています',
  usernameAlreadyInUse: 'このユーザー名は既に使用されています',

  // 認証プロバイダー
  authProvider: '認証方法',
  authProviderEmail: 'メール認証',
  authProviderGoogle: 'Google認証',
  googleUserPasswordChangeNotAllowed:
    'Google認証でログインしたユーザーはパスワード変更できません。Googleアカウントでパスワードを管理してください。',
  googleUserEmailChangeNote: '注意：メール認証変更時は新しいパスワードを設定してください。',
  setNewPassword: '新しいパスワード',
  setNewPasswordHelper: 'メール認証用の新しいパスワードを設定してください',
  googleChangeEmail: '別のGoogleアカウントに切り替え',
  googleChangeEmailDescription:
    '別のGoogleアカウントに切り替えることができます。現在のデータ（セットリスト・楽曲）はすべて新しいアカウントに移行されます。新しいGoogleアカウントをお持ちでない場合は、ボタンをクリック後にGoogleアカウント作成画面に進めます。',
  invalidGoogleToken: 'Google認証トークンが無効です。再度認証してください。',
  emailMismatch: 'リクエストされたメールアドレスがGoogle認証と一致しません。',
  googleEmailChangeSuccess: 'Google認証によりメールアドレスが正常に変更されました。',
  emailNotVerified:
    'メールアドレスが認証されていません。メールに送信された認証リンクをクリックしてアカウントを有効化してください。',
  registrationSuccessEmailVerification:
    'アカウントが作成されました。メールアドレスに送信された認証リンクをクリックしてアカウントを有効化してください。',

  // アカウント削除
  deleteAccount: 'アカウント削除',
  deleteAccountTitle: 'アカウント削除の確認',
  deleteAccountDescription:
    'アカウントを削除すると、すべてのデータ（セットリスト、楽曲）が完全に削除されます。',
  deleteAccountWarning: 'この操作は取り消せません。本当にアカウントを削除しますか？',
  deleteAccountConfirm: '削除する',
  deleteAccountCancel: 'キャンセル',
  deleteAccountSuccess: 'アカウントが削除されました',
  typeDeleteToConfirm: '削除を確定するには「削除」と入力してください',
  deleteToConfirm: '削除',

  // API Route メッセージ
  tokenRequired: '認証が必要です',
  invalidToken: '認証情報が無効です',
  invalidRequest: '無効なリクエストです',
  googleAuthRequired: 'Google認証が必要です。',
  googleAccountNotFound: '元のGoogleアカウントが見つかりません。',
  sameGoogleAccount: '現在のGoogleアカウントと同じです。',
  googleAccountAlreadyRegistered:
    'この新しいGoogleアカウントは既に別のユーザーとして登録されています。',
  googleAccountSwitchSuccess:
    'Googleアカウントが正常に切り替えられました。すべてのデータが移行されました。',
  googleAccountSwitchFailed: 'Googleアカウント切り替えに失敗しました。',
  temporaryAccessRestricted:
    '一時的にアクセスが制限されています。しばらく待ってから再度お試しください。',
};

// 英語メッセージ
export const authEn: AuthMessages = {
  loginRequired: 'Login required',
  authenticationExpired: 'Authentication expired. Please login again',
  serverError: 'A temporary issue occurred. Please try again in a moment.',
  userAlreadyExists: 'This email address is already registered',
  invalidCredentials: 'Invalid email or password',
  emailSent: 'Email sent',
  passwordResetRequested: 'Password reset instructions have been sent to your email.',
  passwordResetSuccess: 'Password has been reset successfully.',
  invalidResetToken: 'Invalid or expired reset token.',
  emailVerified: 'Email address has been verified successfully.',
  invalidVerificationToken: 'Invalid or expired verification token.',
  emailChangedSuccess: 'Email address has been changed successfully.',
  invalidChangeToken: 'Invalid or expired change token.',
  passwordChangeSuccess: 'Password has been changed successfully.',
  currentPasswordIncorrect: 'Current password is incorrect',
  emailAlreadyVerified: 'Email address is already verified.',
  authRequired: 'Authentication required.',
  userNotFound: 'User not found',
  rateLimitExceeded: 'Request limit exceeded.',
  checkingLoginStatus: 'Checking login status...',
  redirectingToLogin: 'Redirecting to login...',

  // Email history & ownership verification
  emailHistory: 'Email Change History',
  emailOwnershipVerification: 'Email Ownership Verification',
  emailCooldownActive: 'This email address cannot be changed for a certain period',
  verifyOwnershipFirst: 'Please verify email address ownership first',
  emailOwnershipVerified: 'Email address ownership verified',

  // Login/Register form
  login: 'Login',
  logout: 'Logout',
  register: 'Register',
  email: 'Email',
  password: 'Password',
  username: 'Username',
  rememberMe: 'Remember me',
  loginButton: 'Login',
  registerButton: 'Register',
  loggingIn: 'Logging in...',
  registering: 'Registering...',
  currentPassword: 'Current Password',
  newPassword: 'New Password',
  confirmPassword: 'Confirm Password',
  confirmPasswordHelper: 'Please enter the same password again for confirmation',
  passwordRequirements:
    'Password must be at least 8 characters and contain uppercase, lowercase, and numbers',
  changePassword: 'Change Password',
  resetPassword: 'Reset Password',
  forgotPassword: 'Forgot Password?',
  sendResetEmail: 'Send Reset Email',
  passwordResetTitle: 'Password Reset',
  passwordResetDescription:
    "Enter your email address and we'll send you password reset instructions",
  resendPasswordReset: 'Resend Password Reset',
  resendAvailableIn: 'Resend available in',
  resendCount: 'sent',
  emailNotFound: 'Email not received?',
  resetEmailHelp: 'Enter your registered email address',
  checkSpamFolder: 'Check your spam folder',
  mayTakeMinutes: 'It may take a few minutes',
  canResendAbove: 'You can resend from the button above',
  backToLogin: 'Back to Login',
  checkYourEmail: 'Check your email.',

  // Email verification page
  emailVerificationTitle: 'Please Verify Your Email',
  emailVerificationDescription: 'Check your email to activate your account',
  accountCreated: 'Account Created',
  accountCreatedDescription: 'Your account has been created successfully.',
  emailVerificationPending: 'Email Verification Pending',
  emailVerificationPendingDescription: 'Verification email has been sent to',
  loginAvailable: 'Login Available',
  loginAvailableDescription: 'You can login after email verification.',
  emailConfirmationRequest: '📧 Email Confirmation Request',
  verificationEmailSent: 'Verification email has been sent to',
  clickVerificationLink:
    'Please click the verification link in the email to activate your account.',
  emailNotInSpam: "※ If you can't find the email, please check your spam folder.",
  resendVerificationEmail: 'Resend Verification Email',
  resendAvailable: 'Resend available in',
  resendCount2: 'times resent',
  emailNotReceived: 'Email not received?',
  checkSpamFolder2: 'Check your spam folder',
  mayTakeMinutes2: 'It may take a few minutes',
  checkEmailTypo: 'Check for typos in your email address',
  verifyEmail: 'Verify Email',
  resendVerification: 'Resend Verification',

  // メール認証確認ページ関連
  emailVerificationProcessing: 'Verifying Email...',
  emailVerificationComplete: 'Email Verification Complete',
  emailVerificationError: 'Email Verification Error',
  emailVerificationProcessingDescription: 'Processing email address verification...',
  emailVerificationSuccessDescription: 'Verification completed. You can now login.',
  emailVerificationFailedDescription: 'There was a problem verifying your email.',
  emailVerificationFailedDefault: 'Failed to verify email',
  invalidVerificationLink: 'Invalid verification link.',
  resendingEmail: 'Resending...',
  resendVerificationEmailButton: 'Resend Verification Email',
  backToLoginPage: 'Back to Login',
  alreadyHaveAccount: 'Already have an account?',
  dontHaveAccount: "Don't have an account?",
  loginToManageSetlists: 'Login to manage your setlists',
  createAccountToStart: 'Create an account to start creating setlists',

  // Google Authentication
  signInWithGoogle: 'Sign in with Google',
  signUpWithGoogle: 'Sign up with Google',
  signingIn: 'Signing in...',
  signingUp: 'Signing up...',
  googleAuthError: 'An error occurred during Google authentication',

  // Terms & Privacy
  terms: 'Terms of Service',
  privacy: 'Privacy Policy',
  and: ' and ',
  agree: ' agreement',

  // Profile related（auth固有のみ）
  profile: 'Profile',
  noData: 'No data',
  createdAt: 'Created at',
  accountId: 'Account ID',

  // Email change related
  changeEmail: 'Change Email',
  newEmail: 'New Email Address',
  currentEmail: 'Current Email Address',
  emailChangeRequested: 'Email change confirmation sent to your new address',
  emailChangeSuccess: 'Email address has been successfully changed',
  emailChangeConfirmation: 'Email Change Confirmation',
  emailChangeProcessing: 'Processing Email Change...',
  emailChangeComplete: 'Email Change Complete',
  emailChangeError: 'Email Change Error',
  emailChangeProcessingDescription: 'Processing email address change...',
  emailChangeSuccessDescription: 'Email address has been successfully changed.',
  emailChangeFailedDescription: 'There was a problem changing your email address.',
  emailChangeFailedDefault: 'Failed to change email address',
  invalidChangeLink: 'Invalid change confirmation link.',
  redirectingToProfile: 'Redirecting to profile page in 3 seconds...',
  backToProfile: 'Back to Profile',
  invalidEmailFormat: 'Invalid email format',
  emailAlreadyInUse: 'This email address is already in use',
  usernameAlreadyInUse: 'This username is already in use',

  // 認証プロバイダー
  authProvider: 'Authentication Method',
  authProviderEmail: 'Email Authentication',
  authProviderGoogle: 'Google Authentication',
  googleUserPasswordChangeNotAllowed:
    'Users who signed in with Google cannot change their password. Please manage your password through your Google account.',
  googleUserEmailChangeNote: 'Note: Set a new password when switching to email authentication.',
  setNewPassword: 'New Password',
  setNewPasswordHelper: 'Set a new password for email authentication',
  googleChangeEmail: 'Switch to Different Google Account',
  googleChangeEmailDescription:
    "Switch to a different Google account. All your current data (setlists and songs) will be transferred to the new account. If you don't have another Google account, you can create one after clicking the button.",
  invalidGoogleToken: 'Google authentication token is invalid. Please authenticate again.',
  emailMismatch: 'The requested email address does not match Google authentication.',
  googleEmailChangeSuccess:
    'Email address has been successfully changed using Google authentication.',
  emailNotVerified:
    'Email address is not verified. Please click the verification link sent to your email to activate your account.',
  registrationSuccessEmailVerification:
    'Account has been created. Please click the verification link sent to your email to activate your account.',

  // Account deletion
  deleteAccount: 'Delete Account',
  deleteAccountTitle: 'Confirm Account Deletion',
  deleteAccountDescription:
    'Deleting your account will permanently remove all your data (setlists, songs).',
  deleteAccountWarning:
    'This action cannot be undone. Are you sure you want to delete your account?',
  deleteAccountConfirm: 'Delete',
  deleteAccountCancel: 'Cancel',
  deleteAccountSuccess: 'Account has been deleted',
  typeDeleteToConfirm: 'Type "DELETE" to confirm deletion',
  deleteToConfirm: 'DELETE',

  // API Route messages
  tokenRequired: 'Authentication required',
  invalidToken: 'Invalid authentication',
  invalidRequest: 'Invalid request',
  googleAuthRequired: 'Google authentication required.',
  googleAccountNotFound: 'Original Google account not found.',
  sameGoogleAccount: 'Same as current Google account.',
  googleAccountAlreadyRegistered: 'This new Google account is already registered as another user.',
  googleAccountSwitchSuccess:
    'Google account has been successfully switched. All data has been migrated.',
  googleAccountSwitchFailed: 'Failed to switch Google account.',
  temporaryAccessRestricted: 'Access temporarily restricted. Please try again later.',
};
