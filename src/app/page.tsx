'use client';

import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Stack, 
  Card, 
  CardContent,
  Grid,
  Fade,
  Chip
} from '@mui/material';
import { 
  MusicNote as MusicNoteIcon,
  PlaylistPlay as PlaylistPlayIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Logout as LogoutIcon,
  LibraryMusic as LibraryMusicIcon
} from '@mui/icons-material';
import Link from 'next/link';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          setIsLoggedIn(!!token);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    if (typeof window !== 'undefined') {
      const handleStorageChange = () => checkAuth();
      window.addEventListener('storage', handleStorageChange);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.reload();
  };

  if (isLoading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <Typography variant="h6" color="text.secondary">
            読み込み中...
          </Typography>
        </Box>
      </Container>
    );
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
                mb: 2
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
              size="large"
              sx={{ fontSize: '1rem', py: 2 }}
            />
          </Box>
        </Fade>

        {/* 機能紹介セクション */}
        <Fade in timeout={1000} style={{ transitionDelay: '200ms' }}>
          <Box sx={{ mb: 8 }}>
            <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 4 }}>
              主な機能
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                  <CardContent sx={{ p: 4 }}>
                    <LibraryMusicIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h5" component="h3" gutterBottom>
                      楽曲管理
                    </Typography>
                    <Typography color="text.secondary">
                      楽曲の詳細情報（タイトル、アーティスト、キー、テンポ）を登録・管理できます。
                      データベースに保存されるため、いつでもアクセス可能です。
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                  <CardContent sx={{ p: 4 }}>
                    <PlaylistPlayIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                    <Typography variant="h5" component="h3" gutterBottom>
                      セットリスト作成
                    </Typography>
                    <Typography color="text.secondary">
                      登録済みの楽曲から簡単にセットリストを作成。
                      ライブやイベントに合わせて最適な楽曲構成を組み立てられます。
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Fade>

        {/* アクションボタン */}
        <Fade in timeout={1000} style={{ transitionDelay: '400ms' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={3} 
              justifyContent="center"
              alignItems="center"
            >
              {isLoggedIn ? (
                <>
                  <Button
                    variant="contained"
                    size="large"
                    component={Link}
                    href="/songs"
                    startIcon={<LibraryMusicIcon />}
                    sx={{ minWidth: 220, py: 1.5 }}
                  >
                    楽曲管理
                  </Button>
                  <Button
                    variant="contained"
                    size="large"
                    component={Link}
                    href="/setlists"
                    startIcon={<PlaylistPlayIcon />}
                    sx={{ minWidth: 220, py: 1.5 }}
                  >
                    セットリスト作成
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleLogout}
                    startIcon={<LogoutIcon />}
                    sx={{ minWidth: 220, py: 1.5 }}
                  >
                    ログアウト
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    size="large"
                    component={Link}
                    href="/login"
                    startIcon={<LoginIcon />}
                    sx={{ minWidth: 220, py: 1.5 }}
                  >
                    ログイン
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    component={Link}
                    href="/register"
                    startIcon={<PersonAddIcon />}
                    sx={{ minWidth: 220, py: 1.5 }}
                  >
                    新規登録
                  </Button>
                </>
              )}
            </Stack>
          </Box>
        </Fade>

        {/* フッター */}
        <Fade in timeout={1000} style={{ transitionDelay: '600ms' }}>
          <Box sx={{ mt: 8, textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary" variant="body2">
              © 2025 セットリストジェネレーター v2. Made with ❤️ for musicians.
            </Typography>
          </Box>
        </Fade>
      </Box>
    </Container>
  );
}