'use client';

import { Box, Typography, Chip } from '@mui/material';
import { MusicNote as MusicNoteIcon } from '@mui/icons-material';
export function WelcomeSection() {
  return (
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
        Powered by mosquitone
      </Typography>
      <Typography
        variant="h6"
        component="p"
        color="text.secondary"
        sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
      >
        バンド向けプロフェッショナルセットリスト管理ツール
      </Typography>
      <Chip
        label="🎵 エモーショナルなセットリスト作成ツール"
        variant="outlined"
        sx={{ fontSize: '1rem', py: 2 }}
      />
    </Box>
  );
}
