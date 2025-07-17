import { useState } from 'react';
import { useMutation } from '@apollo/client';
import {
  DELETE_SONG,
  DELETE_MULTIPLE_SONGS,
  GET_SONGS,
} from '@/lib/server/graphql/apollo-operations';
import { Song } from '@/types/graphql';

/**
 * 楽曲削除機能（単体・一括削除）を提供するカスタムフック
 *
 * このフックは楽曲の単体削除および複数削除の機能を提供します。
 * 削除確認ダイアログの状態管理、GraphQLミューテーションを使用した削除処理、
 * 削除後の楽曲一覧の自動再取得を行います。
 *
 * @param {Function} [onMultipleDeleteComplete] - 一括削除完了時のコールバック関数
 *
 * @returns {Object} フックの戻り値
 * @returns {Song | null} returns.songToDelete - 削除対象の楽曲オブジェクト
 * @returns {boolean} returns.isDeleteDialogOpen - 単体削除確認ダイアログの開閉状態
 * @returns {boolean} returns.isMultipleDeleteDialogOpen - 一括削除確認ダイアログの開閉状態
 * @returns {boolean} returns.deleteLoading - 単体削除処理中のローディング状態
 * @returns {boolean} returns.deleteMultipleLoading - 一括削除処理中のローディング状態
 * @returns {Function} returns.handleDeleteClick - 単体削除確認ダイアログを開く関数
 * @returns {Function} returns.handleDeleteConfirm - 単体削除を実行する関数
 * @returns {Function} returns.handleDeleteCancel - 単体削除をキャンセルする関数
 * @returns {Function} returns.handleDeleteSelectedClick - 一括削除確認ダイアログを開く関数
 * @returns {Function} returns.handleDeleteSelectedConfirm - 一括削除を実行する関数
 * @returns {Function} returns.handleDeleteSelectedCancel - 一括削除をキャンセルする関数
 *
 * @example
 * ```tsx
 * const {
 *   songToDelete,
 *   isDeleteDialogOpen,
 *   isMultipleDeleteDialogOpen,
 *   deleteLoading,
 *   deleteMultipleLoading,
 *   handleDeleteClick,
 *   handleDeleteConfirm,
 *   handleDeleteCancel,
 *   handleDeleteSelectedClick,
 *   handleDeleteSelectedConfirm,
 *   handleDeleteSelectedCancel
 * } = useSongDelete(() => {
 *   // 一括削除完了時の処理
 *   setSelectedSongs([]);
 * });
 *
 * // 単体削除ボタン
 * <button onClick={() => handleDeleteClick(song)}>
 *   削除
 * </button>
 *
 * // 一括削除ボタン
 * <button onClick={() => handleDeleteSelectedClick(selectedSongs)}>
 *   選択した楽曲を削除
 * </button>
 * ```
 */
export function useSongDelete(onMultipleDeleteComplete?: () => void) {
  const [songToDelete, setSongToDelete] = useState<Song | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMultipleDeleteDialogOpen, setIsMultipleDeleteDialogOpen] = useState(false);

  const [deleteSong, { loading: deleteLoading }] = useMutation(DELETE_SONG, {
    refetchQueries: [{ query: GET_SONGS }],
    onCompleted: () => {
      setIsDeleteDialogOpen(false);
      setSongToDelete(null);
    },
  });

  const [deleteMultipleSongs, { loading: deleteMultipleLoading }] = useMutation(
    DELETE_MULTIPLE_SONGS,
    {
      refetchQueries: [{ query: GET_SONGS }],
      onCompleted: () => {
        setIsMultipleDeleteDialogOpen(false);
        onMultipleDeleteComplete?.();
      },
    },
  );

  // 単体削除
  const handleDeleteClick = (song: Song) => {
    setSongToDelete(song);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!songToDelete) return;

    try {
      await deleteSong({ variables: { id: songToDelete.id } });
    } catch (error) {
      console.error('Failed to delete song:', error);
      throw error;
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSongToDelete(null);
  };

  // 複数削除
  const handleDeleteSelectedClick = (selectedSongs: string[]) => {
    if (selectedSongs.length === 0) return;
    setIsMultipleDeleteDialogOpen(true);
  };

  const handleDeleteSelectedConfirm = async (selectedSongs: string[]) => {
    if (selectedSongs.length === 0) return;

    try {
      await deleteMultipleSongs({
        variables: {
          ids: selectedSongs,
        },
      });
    } catch (error) {
      console.error('Failed to delete songs:', error);
      throw error;
    }
  };

  const handleDeleteSelectedCancel = () => {
    setIsMultipleDeleteDialogOpen(false);
  };

  return {
    songToDelete,
    isDeleteDialogOpen,
    isMultipleDeleteDialogOpen,
    deleteLoading,
    deleteMultipleLoading,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleDeleteSelectedClick,
    handleDeleteSelectedConfirm,
    handleDeleteSelectedCancel,
  };
}
