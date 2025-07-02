'use client'

import React from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material'
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  CalendarToday as CalendarIcon,
  MusicNote as MusicNoteIcon,
} from '@mui/icons-material'
import { useQuery } from '@apollo/client'
import { GET_SETLISTS } from '@/lib/server/graphql/apollo-operations'
import { useRouter } from 'next/navigation'
import { formatDateJST } from '@/lib/shared/dateUtils'

interface SetlistItem {
  id: string
  title: string
  note?: string
  order: number
}

interface Setlist {
  id: string
  title: string
  bandName?: string
  eventName?: string
  eventDate?: string
  openTime?: string
  startTime?: string
  theme?: string
  createdAt: string
  updatedAt: string
  items: SetlistItem[]
}

export default function SetlistsPage() {
  const router = useRouter()
  const { data, loading, error } = useQuery(GET_SETLISTS)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [selectedSetlist, setSelectedSetlist] = React.useState<string | null>(null)

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, setlistId: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedSetlist(setlistId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedSetlist(null)
  }

  const handleEditSetlist = () => {
    if (selectedSetlist) {
      router.push(`/setlists/${selectedSetlist}/edit`)
    }
    handleMenuClose()
  }

  const handleDeleteSetlist = () => {
    if (selectedSetlist) {
      // TODO: Implement delete functionality
    }
    handleMenuClose()
  }

  const getThemeLabel = (theme: string) => {
    const themes: { [key: string]: string } = {
      black: 'Black',
      white: 'White',
    }
    return themes[theme] || theme
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>読み込み中...</Typography>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error">エラーが発生しました: {error.message}</Typography>
      </Container>
    )
  }

  const setlists: Setlist[] = data?.setlists || []

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          セットリスト一覧
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/setlists/new')}
          size="large"
        >
          新しいセットリスト
        </Button>
      </Box>

      {setlists.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <MusicNoteIcon sx={{ fontSize: 64, color: 'action.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              セットリストがありません
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              最初のセットリストを作成しましょう
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/setlists/new')}
            >
              セットリストを作成
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {setlists.map(setlist => (
            <Card
              key={setlist.id}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 4,
                },
              }}
              onClick={() => router.push(`/setlists/${setlist.id}`)}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" component="h2" noWrap sx={{ flex: 1 }}>
                    {setlist.title}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={e => {
                      e.stopPropagation()
                      handleMenuClick(e, setlist.id)
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                {setlist.bandName && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {setlist.bandName}
                  </Typography>
                )}

                {setlist.eventName && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {setlist.eventName}
                  </Typography>
                )}

                {setlist.eventDate && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarIcon sx={{ fontSize: 16, mr: 0.5, color: 'action.active' }} />
                    <Typography variant="body2" color="text.secondary">
                      {formatDateJST(setlist.eventDate)}
                    </Typography>
                  </Box>
                )}

                {(setlist.openTime || setlist.startTime) && (
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {setlist.openTime && `開場: ${setlist.openTime}`}
                    {setlist.openTime && setlist.startTime && ' / '}
                    {setlist.startTime && `開演: ${setlist.startTime}`}
                  </Typography>
                )}

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 2,
                  }}
                >
                  <Chip
                    label={`${setlist.items.length}曲`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  {setlist.theme && (
                    <Chip label={getThemeLabel(setlist.theme)} size="small" variant="outlined" />
                  )}
                </Box>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: 'block' }}
                >
                  作成日: {formatDateJST(setlist.createdAt)}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEditSetlist}>編集</MenuItem>
        <MenuItem onClick={handleMenuClose}>複製</MenuItem>
        <MenuItem onClick={handleDeleteSetlist} sx={{ color: 'error.main' }}>
          削除
        </MenuItem>
      </Menu>
    </Container>
  )
}
