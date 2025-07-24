/**
 * Notification messages for i18n system
 * 通知メッセージの多言語化
 */

export interface NotificationMessages {
  setlistCreated: string;
  setlistUpdated: string;
  setlistDeleted: string;
  setlistMadePublic: string;
  setlistMadePrivate: string;
  songCreated: string;
  songAdded: string;
  songUpdated: string;
  songDeleted: string;
  songsDeleted: string;
  newSongRegistered: string;
  newSongsRegistered: string;
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
  setlistDeleted: 'を削除しました',
  setlistMadePublic: 'セットリストが公開されました',
  setlistMadePrivate: 'セットリストが非公開になりました',
  songCreated: 'を作成しました',
  songAdded: '楽曲が追加されました',
  songUpdated: 'を更新しました',
  songDeleted: 'を削除しました',
  songsDeleted: '曲を削除しました',
  newSongRegistered: 'が新しく楽曲ライブラリに登録されました',
  newSongsRegistered: 'が新しく楽曲ライブラリに登録されました',
  imageGenerated: '画像が生成されました',
  copied: 'コピーされました',
  saved: '保存されました',
  profileUpdated: 'プロフィールが更新されました',
  passwordChanged: 'パスワードが変更されました',
  emailSent: 'メールが送信されました',
  linkCopied: 'リンクがコピーされました',
  accountCreated: 'アカウントが作成されました',
};

// 英語版
export const notificationsEn: NotificationMessages = {
  setlistCreated: 'Setlist created',
  setlistUpdated: 'Setlist updated',
  setlistDeleted: ' has been deleted',
  setlistMadePublic: 'Setlist made public',
  setlistMadePrivate: 'Setlist made private',
  songCreated: ' has been created',
  songAdded: 'Song added',
  songUpdated: ' has been updated',
  songDeleted: ' has been deleted',
  songsDeleted: ' songs have been deleted',
  newSongRegistered: ' newly registered to song library',
  newSongsRegistered: ' songs newly registered to song library',
  imageGenerated: 'Image generated',
  copied: 'Copied',
  saved: 'Saved',
  profileUpdated: 'Profile updated',
  passwordChanged: 'Password changed',
  emailSent: 'Email sent',
  linkCopied: 'Link copied',
  accountCreated: 'Account created successfully. Please login.',
};
