'use client';

import { Container, Box, Alert } from '@mui/material';
import { SongPageHeader } from '@/components/songs/SongPageHeader';
import { SongTable } from '@/components/songs/SongTable';
import { SongEditDialog } from '@/components/songs/SongEditDialog';
import { DeleteConfirmModal } from '@/components/common/DeleteConfirmModal';
import { useSongs } from '@/hooks/useSongs';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useI18n } from '@/hooks/useI18n';

export default function SongsPage() {
  const { t } = useI18n();
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
              {t.errors.somethingWentWrong}
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
            title={t.ui.deleteSong}
            itemName={songToDelete?.title || ''}
            itemType={t.ui.song}
            loading={deleteLoading}
          />

          <DeleteConfirmModal
            open={isMultipleDeleteDialogOpen}
            onClose={handleDeleteSelectedCancel}
            onConfirm={handleDeleteSelectedConfirm}
            title={t.ui.deleteSong}
            itemName={`${selectedSongs.length} ${t.ui.songs}`}
            itemType={t.ui.song}
            description={t.confirmations.deleteSong}
            loading={deleteMultipleLoading}
          />
        </Box>
      </Container>
    </ProtectedRoute>
  );
}
