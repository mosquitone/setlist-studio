'use client';

import { Box, Typography, Card, CardActionArea, CardContent } from '@mui/material';
import {
  LibraryMusic as LibraryMusicIcon,
  PlaylistPlay as PlaylistPlayIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
export function FeatureSection() {
  const { isLoggedIn } = useAuth();

  return (
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
          <CardActionArea component={Link} href={isLoggedIn ? '/songs' : '/login'}>
            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
              <LibraryMusicIcon sx={{ fontSize: { xs: 36, md: 48 }, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                楽曲管理
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
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
            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
              <PlaylistPlayIcon sx={{ fontSize: { xs: 36, md: 48 }, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                セットリスト作成
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                登録済みの楽曲からセットリストを作成できます。
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    </Box>
  );
}
