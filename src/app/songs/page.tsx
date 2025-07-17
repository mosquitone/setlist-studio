'use client';

import { Container, Box, Alert } from '@mui/material';
import { SongPageHeader } from '@/components/songs/SongPageHeader';
import { SongTable } from '@/components/songs/SongTable';
import { SongEditDialog } from '@/components/songs/SongEditDialog';
import { DeleteConfirmModal } from '@/components/common/DeleteConfirmModal';
import { useSongs } from '@/hooks/useSongs';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function SongsPage() {
  const {
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
    handleSelectAll,
    handleCreateSetlist,
    handleDeleteSelectedClick,
    handleDeleteSelectedConfirm,
    handleDeleteSelectedCancel,
  } = useSongs();

  return (
    <ProtectedRoute>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <SongPageHeader
            selectedSongs={selectedSongs}
            onCreateSetlist={handleCreateSetlist}
            onDeleteSelected={handleDeleteSelectedClick}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              楽曲の読み込みに失敗しました
            </Alert>
          )}

          <SongTable
            songs={songs}
            loading={loading}
            onEdit={handleEditSong}
            onDelete={handleDeleteClick}
            selectedSongs={selectedSongs}
            onToggleSelection={handleToggleSelection}
            onSelectAll={handleSelectAll}
          />

          <SongEditDialog
            open={isEditDialogOpen}
            song={selectedSong}
            onClose={closeEditDialog}
            onSave={handleSaveSong}
            loading={updateLoading}
          />

          <DeleteConfirmModal
            open={isDeleteDialogOpen}
            onClose={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            title="楽曲を削除"
            itemName={songToDelete?.title || ''}
            itemType="楽曲"
            loading={deleteLoading}
          />

          <DeleteConfirmModal
            open={isMultipleDeleteDialogOpen}
            onClose={handleDeleteSelectedCancel}
            onConfirm={handleDeleteSelectedConfirm}
            title="複数の楽曲を削除"
            itemName={`${selectedSongs.length}曲`}
            itemType="楽曲"
            description="選択した楽曲をすべて削除します。"
            loading={deleteMultipleLoading}
          />
        </Box>
      </Container>
    </ProtectedRoute>
  );
}
