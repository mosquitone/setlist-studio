'use client'

import React, { useState } from 'react'
import {
  Container,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material'
import { useQuery } from '@apollo/client'
import { useParams } from 'next/navigation'
import { GET_SETLIST } from '@/lib/graphql/apollo-operations'
import { SetlistData } from '@/components/setlist-themes/types'
import { ImageGenerator } from '@/components/setlist/ImageGenerator'
import { SetlistActions } from '@/components/setlist/SetlistActions'
import { SetlistPreview } from '@/components/setlist/SetlistPreview'
import { useSetlistActions } from '@/hooks/useSetlistActions'
import { useImageGeneration } from '@/hooks/useImageGeneration'

export default function SetlistDetailPage() {
  const params = useParams()
  const setlistId = params.id as string

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<'black' | 'white'>('black')
  const [showSuccess, setShowSuccess] = useState(false)
  const isDev = process.env.NODE_ENV === 'development'

  const { data, loading, error } = useQuery(GET_SETLIST, {
    variables: { id: setlistId },
    skip: !setlistId,
  })

  const { handleEdit, handleDelete, handleShare, handleDuplicate, deleteLoading } =
    useSetlistActions({ setlistId, setlist: data?.setlist })

  const {
    isGeneratingPreview,
    previewImage,
    showDebug,
    handleDownloadReady,
    handlePreviewReady,
    handlePreviewGenerationStart,
    handleDownload: onDownload,
    handleDebugToggle,
  } = useImageGeneration({
    onSuccess: () => {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    },
  })

  // Initialize selectedTheme with the saved theme from database
  React.useEffect(() => {
    if (
      data?.setlist?.theme &&
      (data.setlist.theme === 'black' || data.setlist.theme === 'white')
    ) {
      setSelectedTheme(data.setlist.theme)
    }
  }, [data?.setlist?.theme])

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>セットリストを読み込み中...</Typography>
      </Container>
    )
  }

  if (error || !data?.setlist) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">セットリストが見つかりません。</Alert>
      </Container>
    )
  }

  const setlist = data.setlist
  const setlistData: SetlistData = {
    id: setlist.id,
    title: setlist.title,
    bandName: setlist.bandName,
    eventName: setlist.eventName,
    eventDate: setlist.eventDate,
    openTime: setlist.openTime,
    startTime: setlist.startTime,
    theme: setlist.theme,
    items: [...setlist.items].sort((a: any, b: any) => a.order - b.order),
  }

  const handleThemeChange = (theme: 'black' | 'white') => {
    setSelectedTheme(theme)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Success Banner */}
      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Setlist Generated !
        </Alert>
      )}

      <SetlistActions
        onEdit={handleEdit}
        onDownload={onDownload}
        onShare={handleShare}
        onDuplicate={handleDuplicate}
        selectedTheme={selectedTheme}
        onThemeChange={handleThemeChange}
        showDebugToggle={isDev}
        showDebug={showDebug}
        onDebugToggle={handleDebugToggle}
      />

      <SetlistPreview
        data={{ ...setlistData, theme: selectedTheme }}
        selectedTheme={selectedTheme}
        showDebug={showDebug}
        isGeneratingPreview={isGeneratingPreview}
        previewImage={previewImage}
      />

      <Box sx={{ display: 'none' }}>
        <ImageGenerator
          data={{ ...setlistData, theme: selectedTheme }}
          selectedTheme={selectedTheme}
          onDownloadReady={handleDownloadReady}
          onPreviewReady={handlePreviewReady}
          onPreviewGenerationStart={handlePreviewGenerationStart}
        />
      </Box>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>セットリストを削除</DialogTitle>
        <DialogContent>
          <Typography>
            「{setlist.title}」を削除してもよろしいですか？ この操作は取り消せません。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleDelete} color="error" disabled={deleteLoading}>
            {deleteLoading ? '削除中...' : '削除'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
