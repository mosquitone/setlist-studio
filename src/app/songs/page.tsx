'use client'

import { Container, Box, Alert } from '@mui/material'
import { SongPageHeader } from '@/components/songs/SongPageHeader'
import { SongTable } from '@/components/songs/SongTable'
import { SongEditDialog } from '@/components/songs/SongEditDialog'
import { useSongs } from '@/hooks/useSongs'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function SongsPage() {
  const {
    songs,
    loading,
    error,
    selectedSong,
    isEditDialogOpen,
    handleEditSong,
    handleSaveSong,
    handleDeleteSong,
    closeEditDialog,
  } = useSongs()

  return (
    <ProtectedRoute>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <SongPageHeader />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              楽曲の読み込みに失敗しました
            </Alert>
          )}

          <SongTable
            songs={songs}
            loading={loading}
            onEdit={handleEditSong}
            onDelete={handleDeleteSong}
          />

          <SongEditDialog
            open={isEditDialogOpen}
            song={selectedSong}
            onClose={closeEditDialog}
            onSave={handleSaveSong}
          />
        </Box>
      </Container>
    </ProtectedRoute>
  )
}
