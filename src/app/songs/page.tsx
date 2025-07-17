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
    deleteLoading,
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
  } = useSongs();

  return (
    <ProtectedRoute>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <SongPageHeader selectedSongs={selectedSongs} onCreateSetlist={handleCreateSetlist} />

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
        </Box>
      </Container>
    </ProtectedRoute>
  );
}
