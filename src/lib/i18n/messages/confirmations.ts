/**
 * Confirmation Messages
 * 確認メッセージ関連
 */

export interface ConfirmationMessages {
  deleteSetlist: string;
  deleteSong: string;
  logout: string;
  unsavedChanges: string;
  makePublic: string;
  makePrivate: string;
}

export const confirmationsJa = {
  deleteSetlist: 'このセットリストを削除してもよろしいですか？',
  deleteSong: 'この楽曲を削除してもよろしいですか？',
  logout: 'ログアウトしてもよろしいですか？',
  unsavedChanges: '保存されていない変更があります。破棄してもよろしいですか？',
  makePublic: 'このセットリストを公開してもよろしいですか？',
  makePrivate: 'このセットリストを非公開にしてもよろしいですか？',
};

export const confirmationsEn = {
  deleteSetlist: 'Are you sure you want to delete this setlist?',
  deleteSong: 'Are you sure you want to delete this song?',
  logout: 'Are you sure you want to logout?',
  unsavedChanges: 'You have unsaved changes. Are you sure you want to discard them?',
  makePublic: 'Are you sure you want to make this setlist public?',
  makePrivate: 'Are you sure you want to make this setlist private?',
};
