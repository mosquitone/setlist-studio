/**
 * Notification messages for i18n system
 * 通知メッセージの多言語化
 */

export interface NotificationMessages {
  setlistCreated: string;
  setlistUpdated: string;
  setlistDeleted: string;
  songCreated: string;
  songAdded: string;
  songUpdated: string;
  songDeleted: string;
  imageGenerated: string;
  copied: string;
  saved: string;
  profileUpdated: string;
  passwordChanged: string;
  emailSent: string;
  linkCopied: string;
  accountCreated: string;
}

// 日本語版
export const notificationsJa: NotificationMessages = {
  setlistCreated: 'セットリストが作成されました',
  setlistUpdated: 'セットリストが更新されました',
  setlistDeleted: 'セットリストが削除されました',
  songCreated: '楽曲が作成されました',
  songAdded: '楽曲が追加されました',
  songUpdated: '楽曲が更新されました',
  songDeleted: '楽曲が削除されました',
  imageGenerated: '画像が生成されました',
  copied: 'コピーされました',
  saved: '保存されました',
  profileUpdated: 'プロフィールが更新されました',
  passwordChanged: 'パスワードが変更されました',
  emailSent: 'メールが送信されました',
  linkCopied: 'リンクがコピーされました',
  accountCreated: 'アカウントが作成されました。ログインしてください。',
};

// 英語版
export const notificationsEn: NotificationMessages = {
  setlistCreated: 'Setlist created',
  setlistUpdated: 'Setlist updated',
  setlistDeleted: 'Setlist deleted',
  songCreated: 'Song created',
  songAdded: 'Song added',
  songUpdated: 'Song updated',
  songDeleted: 'Song deleted',
  imageGenerated: 'Image generated',
  copied: 'Copied',
  saved: 'Saved',
  profileUpdated: 'Profile updated',
  passwordChanged: 'Password changed',
  emailSent: 'Email sent',
  linkCopied: 'Link copied',
  accountCreated: 'Account created successfully',
};
