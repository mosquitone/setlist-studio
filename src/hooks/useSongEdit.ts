import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_SONG, GET_SONGS } from '@/lib/server/graphql/apollo-operations';
import { Song } from '@/types/graphql';

/**
 * 楽曲編集機能を提供するカスタムフック
 *
 * このフックは楽曲の編集ダイアログの状態管理、楽曲データの更新処理、
 * ローディング状態管理を担当します。GraphQLミューテーションを使用して
 * 楽曲データを更新し、更新後に楽曲一覧を自動で再取得します。
 *
 * @returns {Object} フックの戻り値
 * @returns {Song | null} returns.selectedSong - 現在編集中の楽曲オブジェクト
 * @returns {boolean} returns.isEditDialogOpen - 編集ダイアログの開閉状態
 * @returns {boolean} returns.updateLoading - 更新処理中のローディング状態
 * @returns {Function} returns.handleEditSong - 楽曲編集を開始するための関数
 * @returns {Function} returns.handleSaveSong - 楽曲データを保存するための関数
 * @returns {Function} returns.closeEditDialog - 編集ダイアログを閉じるための関数
 *
 * @example
 * ```tsx
 * const {
 *   selectedSong,
 *   isEditDialogOpen,
 *   updateLoading,
 *   handleEditSong,
 *   handleSaveSong,
 *   closeEditDialog
 * } = useSongEdit();
 *
 * // 楽曲編集開始
 * <button onClick={() => handleEditSong(song)}>
 *   編集
 * </button>
 *
 * // 編集ダイアログ表示
 * <EditDialog
 *   open={isEditDialogOpen}
 *   song={selectedSong}
 *   onSave={handleSaveSong}
 *   onClose={closeEditDialog}
 *   loading={updateLoading}
 * />
 * ```
 */
export function useSongEdit() {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [updateSong, { loading: updateLoading }] = useMutation(UPDATE_SONG, {
    refetchQueries: [{ query: GET_SONGS }],
  });

  const handleEditSong = (song: Song) => {
    setSelectedSong(song);
    setIsEditDialogOpen(true);
  };

  const handleSaveSong = async (songData: Omit<Song, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!selectedSong) return;

    await updateSong({
      variables: {
        id: selectedSong.id,
        input: songData,
      },
    });
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedSong(null);
  };

  return {
    selectedSong,
    isEditDialogOpen,
    updateLoading,
    handleEditSong,
    handleSaveSong,
    closeEditDialog,
  };
}
