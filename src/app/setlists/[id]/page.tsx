'use client'

import React, { useState, useRef } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  ContentCopy as DuplicateIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material'
import { useQuery, useMutation } from '@apollo/client'
import { useParams, useRouter } from 'next/navigation'
import { GET_SETLIST, DELETE_SETLIST } from '@/lib/graphql/queries'
import { SetlistData } from '@/components/setlist-themes/types'
import { SetlistRenderer } from '@/components/setlist-themes/SetlistRenderer'
import { ImageGenerator } from '@/components/ImageGenerator'


export default function SetlistDetailPage() {
  const params = useParams()
  const router = useRouter()
  const setlistId = params.id as string

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<'black' | 'white'>('black')
  const [showSuccess, setShowSuccess] = useState(false)
  const [showDebug, setShowDebug] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(true)
  const downloadFunctionRef = useRef<(() => Promise<void>) | null>(null)
  const isDev = process.env.NODE_ENV === 'development'

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
    items: [...setlist.items].sort((a: any, b: any) => a.order - b.order),
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

  const handleDownload = async () => {
    if (downloadFunctionRef.current) {
      await downloadFunctionRef.current()
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }
  }

  const handleDownloadReady = (downloadFn: () => Promise<void>) => {
    downloadFunctionRef.current = downloadFn
  }

  const handlePreviewReady = (imageUrl: string) => {
    setPreviewImage(imageUrl)
    setIsGeneratingPreview(false)
  }

  const handlePreviewGenerationStart = () => {
    setIsGeneratingPreview(true)
  }

  const handleDuplicate = () => {
    router.push(`/setlists/new?duplicate=${setlistId}`)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Success Banner */}
      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Setlist Generated !
        </Alert>
      )}
      
      {/* Action Buttons Row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<EditIcon />} onClick={handleEdit}>
            Edit
          </Button>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownload}>
            Download
          </Button>
          <Button variant="outlined" startIcon={<ShareIcon />} onClick={handleShare}>
            Share
          </Button>
          <Button variant="outlined" startIcon={<DuplicateIcon />} onClick={handleDuplicate}>
            Duplicate
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {isDev && (
            <Button
              variant={showDebug ? 'contained' : 'outlined'}
              onClick={() => setShowDebug(!showDebug)}
              size="small"
              sx={{ 
                minWidth: '60px',
                fontSize: '0.75rem',
                color: showDebug ? 'white' : 'text.secondary',
                borderColor: showDebug ? 'primary.main' : 'grey.400',
                backgroundColor: showDebug ? 'primary.main' : 'transparent',
                '&:hover': {
                  backgroundColor: showDebug ? 'primary.dark' : 'grey.50',
                }
              }}
            >
              {showDebug ? 'DOM' : 'IMG'}
            </Button>
          )}
          
          <FormControl size="small">
            <Select
              value={selectedTheme}
              onChange={(e) => {
                setSelectedTheme(e.target.value as 'black' | 'white')
                setIsGeneratingPreview(true)
              }}
              displayEmpty
              IconComponent={ExpandMoreIcon}
              sx={{ minWidth: 140 }}
              renderValue={(value) => {
                if (value === 'black') return 'Theme: basic'
                if (value === 'white') return 'Theme: white'
                return 'Theme: basic'
              }}
            >
              <MenuItem value="black">basic</MenuItem>
              <MenuItem value="white">white</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Preview */}
      <Paper sx={{ width: '100%', p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: 400 }}>
          {showDebug ? (
            /* DOM Preview */
            <Box
              sx={{
                border: '2px solid red',
                margin: '1rem 0',
                width: '700px', // A4比率の幅
                height: '990px', // A4比率の高さ (700 * 1.414)
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <Box sx={{ transform: 'scale(0.88)', transformOrigin: 'top left' }}>
                <SetlistRenderer data={{ ...setlistData, theme: selectedTheme }} />
              </Box>
            </Box>
          ) : isGeneratingPreview ? (
            /* Loading State */
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '700px',
              height: '990px',
            }}>
              <CircularProgress />
              <Typography sx={{ mt: 2, color: 'text.secondary' }}>
                画像を生成中...
              </Typography>
            </Box>
          ) : previewImage ? (
            /* Image Preview */
            <img
              src={previewImage}
              alt="Setlist Preview"
              style={{
                width: '700px',
                height: '990px',
                objectFit: 'contain',
                border: '1px solid #e0e0e0',
              }}
            />
          ) : (
            /* Fallback to DOM Preview */
            <Box sx={{ 
              width: '700px',
              height: '990px',
              overflow: 'hidden',
              position: 'relative',
            }}>
              <Box sx={{ transform: 'scale(0.88)', transformOrigin: 'top left' }}>
                <SetlistRenderer data={{ ...setlistData, theme: selectedTheme }} />
              </Box>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Hidden ImageGenerator for download and preview functionality */}
      <Box sx={{ display: 'none' }}>
        <ImageGenerator 
          data={{ ...setlistData, theme: selectedTheme }} 
          selectedTheme={selectedTheme}
          onDownloadReady={handleDownloadReady}
          onPreviewReady={handlePreviewReady}
          onPreviewGenerationStart={handlePreviewGenerationStart}
        />
      </Box>

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
