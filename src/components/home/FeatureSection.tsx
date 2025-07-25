'use client';

import {
  LibraryMusic as LibraryMusicIcon,
  PlaylistPlay as PlaylistPlayIcon,
} from '@mui/icons-material';
import { Box, Typography, Card, CardActionArea, CardContent } from '@mui/material';
import Link from 'next/link';

import { useAuth } from '@/components/providers/AuthProvider';
import { useI18n } from '@/hooks/useI18n';
export function FeatureSection() {
  const { isLoggedIn } = useAuth();
  const { messages } = useI18n();

  return (
    <Box>
      <Typography
        variant="h4"
        component="h2"
        textAlign="center"
        gutterBottom
        sx={{ mb: { xs: 2, sm: 3 } }}
      >
        {messages.features.title || '主な機能'}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        <Card
          sx={{
            flex: 1,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
              borderColor: 'primary.main',
            },
          }}
        >
          <CardActionArea component={Link} href={isLoggedIn ? '/songs' : '/login'}>
            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
              <LibraryMusicIcon
                sx={{ fontSize: { xs: 36, md: 48 }, color: 'primary.main', mb: 2 }}
              />
              <Typography
                variant="h5"
                component="h3"
                gutterBottom
                sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}
              >
                {messages.features.songLibrary.title}
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                {messages.features.songLibrary.description}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card
          sx={{
            flex: 1,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
              borderColor: 'primary.main',
            },
          }}
        >
          <CardActionArea component={Link} href={isLoggedIn ? '/setlists/new' : '/login'}>
            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
              <PlaylistPlayIcon
                sx={{ fontSize: { xs: 36, md: 48 }, color: 'secondary.main', mb: 2 }}
              />
              <Typography
                variant="h5"
                component="h3"
                gutterBottom
                sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}
              >
                {messages.features.setlistManagement.title}
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
                {messages.features.setlistManagement.description}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Box>
    </Box>
  );
}
