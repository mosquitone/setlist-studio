'use client';

import { Box, Typography, Stack, useTheme, useMediaQuery } from '@mui/material';
import { Button } from '@/components/common/Button';
import { Add as AddIcon } from '@mui/icons-material';
import Link from 'next/link';

export function SongPageHeader() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ mb: 4 }}>
      <Stack
        direction={isMobile ? 'column' : 'row'}
        justifyContent="space-between"
        alignItems={isMobile ? 'stretch' : 'center'}
        spacing={isMobile ? 2 : 0}
        sx={{ mb: 2 }}
      >
        <Typography variant={isMobile ? 'h5' : 'h4'} component="h1">
          楽曲管理
        </Typography>
        <Button
          component={Link}
          href="/songs/new"
          startIcon={<AddIcon />}
          size={isMobile ? 'medium' : 'medium'}
          sx={isMobile ? { minHeight: 40 } : {}}
        >
          新しい楽曲を追加
        </Button>
      </Stack>
      <Typography variant="body1" color="text.secondary">
        楽曲の管理と編集ができます。楽曲をクリックして詳細を編集できます。
      </Typography>
    </Box>
  );
}
