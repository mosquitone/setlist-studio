'use client';

import {
  Add as AddIcon,
  PlaylistAdd as PlaylistAddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Box, Typography, Stack, useTheme, useMediaQuery } from '@mui/material';
import Link from 'next/link';
import React, { memo } from 'react';

import { Button } from '@/components/common/ui/Button';
import { useI18n } from '@/hooks/useI18n';

interface SongPageHeaderProps {
  selectedSongs: string[];
  onCreateSetlist: () => void;
  onDeleteSelected: () => void;
}

export const SongPageHeader = memo(function SongPageHeader({
  selectedSongs,
  onCreateSetlist,
  onDeleteSelected,
}: SongPageHeaderProps) {
  const { messages } = useI18n();
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
          {messages.songs.title}
        </Typography>
        <Stack direction={isMobile ? 'column' : 'row'} spacing={isMobile ? 1 : 2}>
          <Stack direction={isMobile ? 'column' : 'row'} spacing={isMobile ? 1 : 2}>
            <Button
              variant="outlined"
              startIcon={<PlaylistAddIcon />}
              onClick={onCreateSetlist}
              disabled={selectedSongs.length === 0}
              size={isMobile ? 'medium' : 'medium'}
              sx={isMobile ? { minHeight: 40 } : {}}
            >
              {messages.songs.actions.createSetlist} ({selectedSongs.length}
              {messages.songs.actions.songsCount})
            </Button>
            <Button
              variant="danger"
              startIcon={<DeleteIcon />}
              onClick={onDeleteSelected}
              disabled={selectedSongs.length === 0}
              size={isMobile ? 'medium' : 'medium'}
              sx={isMobile ? { minHeight: 40 } : {}}
            >
              {messages.songs.actions.deleteSelected} ({selectedSongs.length}
              {messages.songs.actions.songsCount})
            </Button>
          </Stack>
          <Button
            component={Link}
            href="/songs/new"
            startIcon={<AddIcon />}
            size={isMobile ? 'medium' : 'medium'}
            sx={isMobile ? { minHeight: 40 } : {}}
          >
            {messages.songs.actions.addNew}
          </Button>
        </Stack>
      </Stack>
      <Typography variant="body1" color="text.secondary">
        {messages.songs.description}
      </Typography>
    </Box>
  );
});

SongPageHeader.displayName = 'SongPageHeader';
