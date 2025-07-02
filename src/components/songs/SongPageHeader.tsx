'use client';

import { Box, Typography, Button, Stack } from '@mui/material';
import { Add as AddIcon, Home as HomeIcon } from '@mui/icons-material';
import Link from 'next/link';

export function SongPageHeader() {
  return (
    <Box sx={{ mb: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4" component="h1">
          楽曲管理
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button component={Link} href="/" variant="outlined" startIcon={<HomeIcon />}>
            ホーム
          </Button>
          <Button component={Link} href="/songs/new" variant="contained" startIcon={<AddIcon />}>
            新しい楽曲を追加
          </Button>
        </Stack>
      </Stack>
      <Typography variant="body1" color="text.secondary">
        楽曲の管理と編集ができます。楽曲をクリックして詳細を編集できます。
      </Typography>
    </Box>
  );
}
