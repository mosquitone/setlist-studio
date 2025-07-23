import { useMutation } from '@apollo/client';
import { useState } from 'react';

import { useSnackbar } from '@/components/providers/SnackbarProvider';
import { useI18n } from '@/hooks/useI18n';
import {
  DELETE_SONG,
  DELETE_MULTIPLE_SONGS,
  GET_SONGS,
} from '@/lib/server/graphql/apollo-operations';
import { Song } from '@/types/graphql';

// GraphQL mutation response types
interface DeleteSongData {
  deleteSong: {
    deletedSong: {
      id: string;
      title: string;
    };
    success: boolean;
  };
}

interface DeleteMultipleSongsData {
  deleteMultipleSongs: {
    deletedCount: number;
    success: boolean;
  };
}

/**
 * 楽曲削除機能（単体・一括削除）を提供するカスタムフック
 *
 * このフックは楽曲の単体削除および複数削除の機能を提供します。
 * 削除確認ダイアログの状態管理、GraphQLミューテーションを使用した削除処理、
 * 削除後の楽曲一覧の自動再取得、およびスナックバー通知を行います。
 *
 * ## 主要機能
 * - 単体削除：APIレスポンスから楽曲タイトルを取得してスナックバー表示
 * - 一括削除：削除件数をスナックバーで通知
 * - TypeScript完全対応：GraphQL型安全性を保証
 * - 状態最適化：必要最小限のデータ（id, title）のみ保存
 *
 * @param onMultipleDeleteComplete - 一括削除完了時のコールバック関数（オプション）
 *
 * @returns フックの戻り値オブジェクト
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
 * // 削除確認モーダル
 * <SingleDeleteModal
 *   open={isDeleteDialogOpen}
 *   itemName={songToDelete?.title || ''}
 *   onConfirm={handleDeleteConfirm}
 *   onClose={handleDeleteCancel}
 *   loading={deleteLoading}
 * />
 * ```
 */
interface SongToDelete {
  id: string;
  title: string;
}

export function useSongDelete(onMultipleDeleteComplete?: () => void) {
  const { messages } = useI18n();
  const { showSuccess, showError } = useSnackbar();
  const [songToDelete, setSongToDelete] = useState<SongToDelete | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMultipleDeleteDialogOpen, setIsMultipleDeleteDialogOpen] = useState(false);

  const [deleteSong, { loading: deleteLoading }] = useMutation<DeleteSongData>(DELETE_SONG, {
    refetchQueries: [{ query: GET_SONGS }],
    onCompleted: (data: DeleteSongData) => {
      setIsDeleteDialogOpen(false);
      setSongToDelete(null);

      if (data.deleteSong.success && data.deleteSong.deletedSong) {
        showSuccess(
          `「${data.deleteSong.deletedSong.title}」${messages.notifications.songDeleted}`,
        );
      }
    },
    onError: (error) => {
      showError(error.message);
    },
  });

  const [deleteMultipleSongs, { loading: deleteMultipleLoading }] =
    useMutation<DeleteMultipleSongsData>(DELETE_MULTIPLE_SONGS, {
      refetchQueries: [{ query: GET_SONGS }],
      onCompleted: (data: DeleteMultipleSongsData) => {
        setIsMultipleDeleteDialogOpen(false);
        onMultipleDeleteComplete?.();

        if (data.deleteMultipleSongs.success) {
          showSuccess(
            `${data.deleteMultipleSongs.deletedCount}${messages.notifications.songsDeleted}`,
          );
        }
      },
      onError: (error) => {
        showError(error.message);
      },
    });

  // 単体削除
  const handleDeleteClick = (song: Song) => {
    setSongToDelete({ id: song.id, title: song.title });
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!songToDelete) return;

    try {
      await deleteSong({ variables: { id: songToDelete.id } });
    } catch (error) {
      console.error('Failed to delete song:', error);
      // エラーは onError で処理されるため、ここでは再スローしない
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
      // エラーは onError で処理されるため、ここでは再スローしない
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
