'use client'

import { useState, useEffect } from 'react'
import { Box, Typography, Card, CardActionArea, CardContent } from '@mui/material'
import {
  LibraryMusic as LibraryMusicIcon,
  PlaylistPlay as PlaylistPlayIcon,
} from '@mui/icons-material'
import Link from 'next/link'
import { useAuth } from '@/components/providers/AuthProvider'

export function FeatureSection() {
  const { isLoggedIn } = useAuth()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Box sx={{ 
      mb: 8,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 1s ease-out, transform 1s ease-out'
    }}>
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
            <CardActionArea component={Link} href={isLoggedIn ? '/songs' : '/login'}>
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
            <CardActionArea component={Link} href={isLoggedIn ? '/setlists/new' : '/login'}>
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
  )
}
