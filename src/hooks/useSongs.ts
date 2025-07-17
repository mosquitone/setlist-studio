import { useSongsData } from './useSongsData';
import { useSongEdit } from './useSongEdit';
import { useSongDelete } from './useSongDelete';
import { useSongSelection } from './useSongSelection';

export function useSongs() {
  const { songs, loading, error } = useSongsData();
  const {
    selectedSong,
    isEditDialogOpen,
    updateLoading,
    handleEditSong,
    handleSaveSong,
    closeEditDialog,
  } = useSongEdit();
  const {
    selectedSongs,
    handleToggleSelection,
    handleSelectAll,
    handleCreateSetlist,
    clearSelection,
  } = useSongSelection();
  const {
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
  } = useSongDelete(clearSelection);

  return {
    songs,
    loading,
    error,
    selectedSong,
    isEditDialogOpen,
    songToDelete,
    isDeleteDialogOpen,
    isMultipleDeleteDialogOpen,
    deleteLoading,
    updateLoading,
    deleteMultipleLoading,
    selectedSongs,
    handleEditSong,
    handleSaveSong,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    closeEditDialog,
    handleToggleSelection,
    handleSelectAll: (selected: boolean) => handleSelectAll(selected, songs),
    handleCreateSetlist: () => handleCreateSetlist(songs),
    handleDeleteSelectedClick: () => handleDeleteSelectedClick(selectedSongs),
    handleDeleteSelectedConfirm: () => handleDeleteSelectedConfirm(selectedSongs),
    handleDeleteSelectedCancel,
  };
}
