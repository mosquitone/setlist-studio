/**
 * スナックバー通知関連のヘルパー関数
 */

import { NewSongInfo } from '@/types/graphql';

/**
 * 新規楽曲登録の通知メッセージを生成する
 *
 * @param newSongInfo - 新規楽曲情報
 * @param messages - 国際化メッセージ
 * @returns 通知メッセージ
 */
export function generateNewSongNotification(newSongInfo: NewSongInfo, messages: any): string {
  const { count, titles } = newSongInfo;

  if (count === 0) {
    return '';
  }

  if (count === 1) {
    return `「${titles[0]}」${messages.notifications.newSongRegistered}`;
  }

  if (count <= 3) {
    const titleList = titles.map((title) => `「${title}」`).join('、');
    return `${titleList}${messages.notifications.newSongsRegistered}`;
  }

  // 4件以上の場合は件数表示
  // 言語に応じた適切な形式で表示
  const lang = messages.language || 'ja'; // デフォルトは日本語
  if (lang === 'en') {
    return `${count} songs newly registered to song library`;
  }
  return `${count}曲が新しく楽曲ライブラリに登録されました`;
}
