/**
 * Email Messages
 * メール関連のメッセージ
 */

export interface EmailMessages {
  verificationSubject: string;
  verificationBody: (username: string, link: string) => string;
  passwordResetSubject: string;
  passwordResetBody: (username: string, link: string) => string;
  passwordResetSuccessSubject: string;
  passwordResetSuccessBody: (username: string, loginUrl: string) => string;
  emailChangeSubject: string;
  emailChangeBody: (username: string, oldEmail: string, newEmail: string, link: string) => string;
  emailOwnershipSubject: string;
  emailOwnershipDescription: string;
  emailOwnershipEmailLabel: string;
  emailOwnershipButtonText: string;
  emailOwnershipExpiresLabel: string;
  emailOwnershipDisclaimer: string;
  emailChangeNotificationSubject: string;
  emailChangeNotificationBody: (username: string, oldEmail: string, newEmail: string) => string;
  emailChangeSuccessSubject: string;
  emailChangeSuccessBody: (username: string, newEmail: string) => string;
}

export const emailsJa = {
  verificationSubject: 'メールアドレスの認証',
  verificationBody: (username: string, link: string) => `
${username} 様

Setlist Studioにご登録いただき、ありがとうございます。
下記のリンクをクリックして、メールアドレスの認証を完了してください：

${link}

このリンクは24時間で有効期限が切れます。

今後ともよろしくお願いいたします。
Setlist Studio チーム
`,
  passwordResetSubject: 'パスワードリセットのお知らせ',
  passwordResetBody: (username: string, link: string) => `
${username} 様

パスワードのリセット要求を受け取りました。
下記のリンクをクリックして、新しいパスワードを設定してください：

${link}

このリンクは1時間で有効期限が切れます。
もしこの要求に心当たりがない場合は、このメールを無視してください。

今後ともよろしくお願いいたします。
Setlist Studio チーム
`,
  passwordResetSuccessSubject: 'パスワード変更完了のお知らせ',
  passwordResetSuccessBody: (username: string, loginUrl: string) => `
${username} 様

パスワードが正常に変更されました。
下記のリンクから新しいパスワードでログインできます：

${loginUrl}

もしこの変更に心当たりがない場合は、すぐにサポートにお問い合わせください。

今後ともよろしくお願いいたします。
Setlist Studio チーム
`,
  emailChangeSubject: 'メールアドレス変更の確認',
  emailChangeBody: (username: string, oldEmail: string, newEmail: string, link: string) => `
${username} 様

メールアドレスを ${oldEmail} から ${newEmail} に変更する要求を受け取りました。
下記のリンクをクリックして、この変更を確認してください：

${link}

このリンクは24時間で有効期限が切れます。
もしこの要求に心当たりがない場合は、このメールを無視してください。

今後ともよろしくお願いいたします。
Setlist Studio チーム
`,
  emailOwnershipSubject: 'メールアドレス所有権の確認',
  emailOwnershipDescription: '以前に使用していたメールアドレスに戻すリクエストを受け取りました。',
  emailOwnershipEmailLabel: 'メールアドレス',
  emailOwnershipButtonText: '所有権を確認',
  emailOwnershipExpiresLabel: 'リンクの有効期限',
  emailOwnershipDisclaimer: 'このリクエストに心当たりがない場合は、このメールを無視してください。',
  emailChangeNotificationSubject: 'メールアドレス変更通知',
  emailChangeNotificationBody: (username: string, oldEmail: string, newEmail: string) => `
${username}様

お客様のアカウントのメールアドレスが変更されました。

変更前: ${oldEmail}
変更後: ${newEmail}

この変更を行っていない場合は、直ちにサポートにお問い合わせください。

--
Setlist Studio チーム`,
  emailChangeSuccessSubject: 'メールアドレス変更完了',
  emailChangeSuccessBody: (username: string, newEmail: string) => `
${username}様

メールアドレスの変更が正常に完了しました。

新しいメールアドレス: ${newEmail}

今後はこのメールアドレスでログインしてください。

--
Setlist Studio チーム`,
};

export const emailsEn = {
  verificationSubject: 'Verify your email address',
  verificationBody: (username: string, link: string) => `
Hello ${username},

Thank you for registering with Setlist Studio.
Please click the link below to verify your email address:

${link}

This link will expire in 24 hours.

Best regards,
Setlist Studio Team
`,
  passwordResetSubject: 'Password Reset Request',
  passwordResetBody: (username: string, link: string) => `
Hello ${username},

We received a request to reset your password.
Please click the link below to set a new password:

${link}

This link will expire in 1 hour.
If you didn't request this, please ignore this email.

Best regards,
Setlist Studio Team
`,
  passwordResetSuccessSubject: 'Password Changed',
  passwordResetSuccessBody: (username: string, loginUrl: string) => `
Hello ${username},

Your password has been changed successfully.
You can now login with your new password using the link below:

${loginUrl}

If you didn't make this change, please contact support immediately.

Best regards,
Setlist Studio Team
`,
  emailChangeSubject: 'Confirm Email Change',
  emailChangeBody: (username: string, oldEmail: string, newEmail: string, link: string) => `
Hello ${username},

We received a request to change your email address from ${oldEmail} to ${newEmail}.
Please click the link below to confirm this change:

${link}

This link will expire in 24 hours.
If you didn't request this, please ignore this email.

Best regards,
Setlist Studio Team
`,
  emailOwnershipSubject: 'Email Ownership Verification',
  emailOwnershipDescription:
    'A request to return to a previously used email address has been received.',
  emailOwnershipEmailLabel: 'Email address',
  emailOwnershipButtonText: 'Verify Ownership',
  emailOwnershipExpiresLabel: 'Link expires',
  emailOwnershipDisclaimer: 'If you did not request this, please ignore this email.',
  emailChangeNotificationSubject: 'Email Address Change Notification',
  emailChangeNotificationBody: (username: string, oldEmail: string, newEmail: string) => `
Hello ${username},

Your account email address has been changed.

Previous: ${oldEmail}
New: ${newEmail}

If you did not make this change, please contact support immediately.

--
Setlist Studio Team`,
  emailChangeSuccessSubject: 'Email Address Change Complete',
  emailChangeSuccessBody: (username: string, newEmail: string) => `
Hello ${username},

Your email address change has been completed successfully.

New email address: ${newEmail}

Please use this email address to login from now on.

--
Setlist Studio Team`,
};
