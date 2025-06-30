'use client'

import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Button,
  Stack,
  Card,
  CardContent,
  CardActionArea,
  Fade,
  Chip,
  Grid,
  IconButton,
  Divider,
  Avatar,
} from '@mui/material'
import {
  MusicNote as MusicNoteIcon,
  PlaylistPlay as PlaylistPlayIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Logout as LogoutIcon,
  LibraryMusic as LibraryMusicIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
} from '@mui/icons-material'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { GET_SETLISTS } from '../lib/graphql/apollo-operations'
import { GetSetlistsResponse, Setlist } from '../types/graphql'

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const {
    data: setlistsData,
    loading: setlistsLoading,
    refetch,
  } = useQuery<GetSetlistsResponse>(GET_SETLISTS, {
    skip: !isLoggedIn,
    errorPolicy: 'all',
  })

  useEffect(() => {
    const checkAuth = () => {
      try {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token')
          setIsLoggedIn(!!token)
        }
      } catch {
        setIsLoggedIn(false)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
    if (typeof window !== 'undefined') {
      const handleStorageChange = () => checkAuth()
      window.addEventListener('storage', handleStorageChange)
      return () => window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
    window.location.reload()
  }

  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h6" color="text.secondary">
            読み込み中...
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ minHeight: '100vh', py: 4 }}>
        {/* ヘッダー */}
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ mb: 3 }}>
              <MusicNoteIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            </Box>
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
              sx={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              セットリストジェネレーター v2
            </Typography>
            <Typography
              variant="h6"
              component="p"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
            >
              あなたの楽曲を管理して、素敵なセットリストを作成しましょう
            </Typography>
            <Chip
              label="🎵 プロフェッショナルなセットリスト作成ツール"
              variant="outlined"
              sx={{ fontSize: '1rem', py: 2 }}
            />
          </Box>
        </Fade>

        {/* 機能紹介 */}
        <Fade in timeout={1000} style={{ transitionDelay: '200ms' }}>
          <Box sx={{ mb: 8 }}>
            <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 4 }}>
              主な機能
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
              <Card
                sx={{
                  flex: 1,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <CardActionArea component={Link} href="/songs">
                  <CardContent sx={{ p: 4 }}>
                    <LibraryMusicIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h5" component="h3" gutterBottom>
                      楽曲管理
                    </Typography>
                    <Typography color="text.secondary">
                      楽曲の詳細情報（タイトル、アーティスト、キー、テンポ）を登録・管理できます。
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
              <Card
                sx={{
                  flex: 1,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <CardActionArea component={Link} href="/setlists/new">
                  <CardContent sx={{ p: 4 }}>
                    <PlaylistPlayIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                    <Typography variant="h5" component="h3" gutterBottom>
                      セットリスト作成
                    </Typography>
                    <Typography color="text.secondary">
                      登録済みの楽曲からセットリストを作成できます。
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          </Box>
        </Fade>

        {/* セットリスト一覧（ログイン済みユーザー） */}
        {isLoggedIn && (
          <Fade in timeout={1000} style={{ transitionDelay: '400ms' }}>
            <Box sx={{ mb: 8 }}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
                あなたのセットリスト
              </Typography>

              {setlistsLoading ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    セットリストを読み込み中...
                  </Typography>
                </Box>
              ) : !setlistsData?.setlists?.length ? (
                <Card sx={{ p: 6, textAlign: 'center', bgcolor: 'grey.50' }}>
                  <PlaylistPlayIcon sx={{ fontSize: 64, color: 'grey.400', mb: 3 }} />
                  <Typography variant="h5" gutterBottom color="text.secondary">
                    まだセットリストがありません
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    最初のセットリストを作成して、素敵な演奏リストを管理しましょう
                  </Typography>
                  <Button
                    variant="contained"
                    component={Link}
                    href="/setlists/new"
                    startIcon={<AddIcon />}
                    size="large"
                    sx={{ borderRadius: 3 }}
                  >
                    セットリストを作成
                  </Button>
                </Card>
              ) : (
                <Grid container spacing={2}>
                  {setlistsData.setlists.map((setlist: Setlist) => (
                    <Grid item xs={12} sm={6} md={4} key={setlist.id}>
                      <Card
                        sx={{
                          height: 278,
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                          },
                          borderRadius: 3,
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            background: `linear-gradient(135deg, ${
                              setlist.theme === 'white'
                                ? '#f8fafc 0%, #e2e8f0 100%'
                                : '#1e293b 0%, #0f172a 100%'
                            })`,
                            p: 1.5,
                            color: setlist.theme === 'white' ? 'text.primary' : 'white',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              mb: 1.5,
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor:
                                  setlist.theme === 'white' ? 'primary.main' : 'secondary.main',
                                width: 40,
                                height: 40,
                              }}
                            >
                              <PlaylistPlayIcon />
                            </Avatar>
                            <Chip
                              label={setlist.theme === 'white' ? 'ホワイト' : 'ブラック'}
                              size="small"
                              sx={{
                                bgcolor:
                                  setlist.theme === 'white'
                                    ? 'rgba(59, 130, 246, 0.1)'
                                    : 'rgba(239, 68, 68, 0.2)',
                                color: setlist.theme === 'white' ? 'primary.main' : '#ef4444',
                                fontWeight: 600,
                              }}
                            />
                          </Box>
                          <Typography
                            variant="h6"
                            component="h3"
                            gutterBottom
                            sx={{ fontWeight: 700, mb: 1 }}
                          >
                            {setlist.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <GroupIcon sx={{ fontSize: 14, opacity: 0.7 }} />
                            <Typography
                              variant="body2"
                              sx={{ opacity: 0.8, fontWeight: 500, fontSize: '0.8rem' }}
                            >
                              {setlist.bandName || '未設定'}
                            </Typography>
                          </Box>
                          {setlist.eventName && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <EventIcon sx={{ fontSize: 14, opacity: 0.7 }} />
                              <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.8rem' }}>
                                {setlist.eventName}
                              </Typography>
                            </Box>
                          )}
                          {setlist.eventDate && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <ScheduleIcon sx={{ fontSize: 14, opacity: 0.7 }} />
                              <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.8rem' }}>
                                {new Date(setlist.eventDate).toLocaleDateString('ja-JP')}
                              </Typography>
                            </Box>
                          )}
                          <Box sx={{ flex: 1 }} />
                          <Divider sx={{ my: 1, opacity: 0.3 }} />
                          <Typography variant="body2" sx={{ opacity: 0.7, fontSize: '0.8rem' }}>
                            {setlist.items?.length || 0} 曲
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                          <Button
                            component={Link}
                            href={`/setlists/${setlist.id}`}
                            sx={{
                              flex: 1,
                              py: 1.5,
                              borderRadius: 0,
                              borderRight: '1px solid',
                              borderColor: 'divider',
                              '&:hover': { bgcolor: 'primary.main', color: 'white' },
                            }}
                            startIcon={<VisibilityIcon />}
                          >
                            表示
                          </Button>
                          <Button
                            component={Link}
                            href={`/setlists/${setlist.id}/edit`}
                            sx={{
                              flex: 1,
                              py: 1.5,
                              borderRadius: 0,
                              '&:hover': { bgcolor: 'secondary.main', color: 'white' },
                            }}
                            startIcon={<EditIcon />}
                          >
                            編集
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Fade>
        )}

        {/* アクションボタン（未ログインユーザー） */}
        {!isLoggedIn && (
          <Fade in timeout={1000} style={{ transitionDelay: '400ms' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                justifyContent="center"
                alignItems="center"
              >
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  href="/login"
                  startIcon={<LoginIcon />}
                  sx={{
                    minWidth: 220,
                    borderRadius: 10,
                    px: 4,
                    py: 2,
                    borderColor: '#3b82f6',
                    color: '#3b82f6',
                    fontSize: '16px',
                    fontWeight: 500,
                    textTransform: 'none',
                    border: '2px solid #3b82f6',
                    '&:hover': {
                      borderColor: '#2563eb',
                      backgroundColor: 'rgba(59, 130, 246, 0.04)',
                    },
                  }}
                >
                  ログイン
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  href="/register"
                  startIcon={<PersonAddIcon />}
                  sx={{
                    minWidth: 220,
                    borderRadius: 10,
                    px: 4,
                    py: 2,
                    borderColor: '#3b82f6',
                    color: '#3b82f6',
                    fontSize: '16px',
                    fontWeight: 500,
                    textTransform: 'none',
                    border: '2px solid #3b82f6',
                    '&:hover': {
                      borderColor: '#2563eb',
                      backgroundColor: 'rgba(59, 130, 246, 0.04)',
                    },
                  }}
                >
                  新規登録
                </Button>
              </Stack>
            </Box>
          </Fade>
        )}

        {/* フッター */}
        <Fade in timeout={1000} style={{ transitionDelay: '600ms' }}>
          <Box sx={{ mt: 8, textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary" variant="body2">
              © 2025 mosquitone
            </Typography>
          </Box>
        </Fade>
      </Box>
    </Container>
  )
}
