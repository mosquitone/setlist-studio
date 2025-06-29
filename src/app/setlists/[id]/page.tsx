'use client'

import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  Visibility as VisibilityIcon,
  Image as ImageIcon,
} from '@mui/icons-material'
import { useQuery, useMutation } from '@apollo/client'
import { useParams, useRouter } from 'next/navigation'
import { GET_SETLIST, DELETE_SETLIST } from '@/lib/graphql/queries'
import { SetlistData } from '@/components/setlist-themes/types'
import { SetlistRenderer } from '@/components/setlist-themes/SetlistRenderer'
import { ImageGenerator } from '@/components/ImageGenerator'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>{value === index && <Box sx={{ pt: 3 }}>{children}</Box>}</div>
  )
}

export default function SetlistDetailPage() {
  const params = useParams()
  const router = useRouter()
  const setlistId = params.id as string

  const [tabValue, setTabValue] = useState(0)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { data, loading, error } = useQuery(GET_SETLIST, {
    variables: { id: setlistId },
    skip: !setlistId,
  })

  const [deleteSetlist, { loading: deleteLoading }] = useMutation(DELETE_SETLIST, {
    onCompleted: () => {
      router.push('/')
    },
  })

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
    items: setlist.items.sort((a: any, b: any) => a.order - b.order),
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleEdit = () => {
    router.push(`/setlists/${setlistId}/edit`)
  }

  const handleDelete = async () => {
    try {
      await deleteSetlist({ variables: { id: setlistId } })
    } catch (err) {
      console.error('Error deleting setlist:', err)
    }
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/setlists/${setlistId}`
    try {
      await navigator.share({
        title: `${setlist.bandName} - ${setlist.title}`,
        text: `セットリスト: ${setlist.title}`,
        url: url,
      })
    } catch (err) {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url)
        alert('URLをクリップボードにコピーしました')
      } catch (clipboardErr) {
        console.error('Error sharing/copying:', clipboardErr)
      }
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            {setlist.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={handleEdit} color="primary">
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleShare} color="primary">
              <ShareIcon />
            </IconButton>
            <IconButton onClick={handlePrint} color="primary">
              <PrintIcon />
            </IconButton>
            <IconButton onClick={() => setDeleteDialogOpen(true)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <Typography variant="h6" color="text.secondary">
          {setlist.bandName}
        </Typography>

        {setlist.eventName && (
          <Typography variant="body1" color="text.secondary">
            {setlist.eventName}
          </Typography>
        )}

        {setlist.eventDate && (
          <Typography variant="body2" color="text.secondary">
            {setlist.eventDate}
          </Typography>
        )}
      </Box>

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<VisibilityIcon />} label="プレビュー" />
          <Tab icon={<ImageIcon />} label="画像生成" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {/* Preview */}
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: '100%', overflow: 'auto' }}>
              <SetlistRenderer data={setlistData} />
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {/* Image Generation */}
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              画像生成
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              セットリストを画像として生成・ダウンロードできます。
            </Typography>
            <ImageGenerator data={setlistData} />
          </Box>
        </TabPanel>
      </Paper>

      {/* Delete Confirmation Dialog */}
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
