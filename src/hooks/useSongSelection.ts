import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Song } from '@/types/graphql';

/**
 * 楽曲選択とセットリスト作成機能を提供するカスタムフック
 *
 * このフックは楽曲一覧でのチェックボックス選択機能、全選択・全解除機能、
 * 選択した楽曲でセットリストを作成する機能を提供します。
 * 選択した楽曲情報をURLパラメータとしてセットリスト作成ページに送信します。
 *
 * @returns {Object} フックの戻り値
 * @returns {string[]} returns.selectedSongs - 選択された楽曲IDの配列
 * @returns {Function} returns.handleToggleSelection - 個別の楽曲選択状態を切り替える関数
 * @returns {Function} returns.handleSelectAll - 全選択・全解除を切り替える関数
 * @returns {Function} returns.handleCreateSetlist - 選択した楽曲でセットリストを作成する関数
 * @returns {Function} returns.clearSelection - 選択状態をクリアする関数
 *
 * @example
 * ```tsx
 * const {
 *   selectedSongs,
 *   handleToggleSelection,
 *   handleSelectAll,
 *   handleCreateSetlist,
 *   clearSelection
 * } = useSongSelection();
 *
 * // 個別選択チェックボックス
 * <Checkbox
 *   checked={selectedSongs.includes(song.id)}
 *   onChange={() => handleToggleSelection(song.id)}
 * />
 *
 * // 全選択チェックボックス
 * <Checkbox
 *   checked={selectedSongs.length === songs.length}
 *   onChange={(e) => handleSelectAll(e.target.checked, songs)}
 * />
 *
 * // セットリスト作成ボタン
 * <button onClick={() => handleCreateSetlist(songs)}>
 *   選択した楽曲でセットリストを作成
 * </button>
 * ```
 */
export function useSongSelection() {
  const router = useRouter();
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);

  const handleToggleSelection = (songId: string) => {
    setSelectedSongs((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId],
    );
  };

  const handleSelectAll = (selected: boolean, songs: Song[]) => {
    setSelectedSongs(selected ? songs.map((song) => song.id) : []);
  };

  const handleCreateSetlist = (songs: Song[]) => {
    const selectedSongTitles: Array<{ title: string; note: string }> = songs
      .filter((song) => selectedSongs.includes(song.id))
      .map((song) => ({ title: song.title, note: song.notes || '' }));

    // Base64エンコーディングでURLパラメータを圧縮
    try {
      const jsonString = JSON.stringify(selectedSongTitles);
      const base64String = btoa(encodeURIComponent(jsonString));

      const queryParams = new URLSearchParams();
      queryParams.set('songs', base64String);

      router.push(`/setlists/new?${queryParams.toString()}`);
    } catch (error) {
      console.error('Failed to encode selected songs:', error);
      // フォールバック: エンコーディングに失敗した場合は、楽曲なしで遷移
      router.push('/setlists/new');
    }
  };

  const clearSelection = () => {
    setSelectedSongs([]);
  };

  return {
    selectedSongs,
    handleToggleSelection,
    handleSelectAll,
    handleCreateSetlist,
    clearSelection,
  };
}
