'use client';

import { Container, Box, Alert } from '@mui/material';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MultiDeleteModal } from '@/components/common/MultiDeleteModal';
import { SingleDeleteModal } from '@/components/common/SingleDeleteModal';
import { SongEditDialog } from '@/components/songs/SongEditDialog';
import { SongPageHeader } from '@/components/songs/SongPageHeader';
import { SongTable } from '@/components/songs/SongTable';
import { useI18n } from '@/hooks/useI18n';
import { useSongs } from '@/hooks/useSongs';

export default function SongsPage() {
  const { messages } = useI18n();
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
    getSelectedSongsDetails,
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
              {messages.errors.somethingWentWrong}
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

          <SingleDeleteModal
            open={isDeleteDialogOpen}
            onClose={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            title={messages.common.deleteSong}
            itemName={songToDelete?.title || ''}
            itemType={messages.common.song}
            loading={deleteLoading}
          />

          <MultiDeleteModal
            open={isMultipleDeleteDialogOpen}
            onClose={handleDeleteSelectedCancel}
            onConfirm={handleDeleteSelectedConfirm}
            selectedSongs={getSelectedSongsDetails()}
            loading={deleteMultipleLoading}
          />
        </Box>
      </Container>
    </ProtectedRoute>
  );
}
