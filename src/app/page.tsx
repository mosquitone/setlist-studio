'use client';

import { Container, Box, Typography } from '@mui/material';

import NoSSR from '@/components/common/ui/NoSSR';
import { useI18n } from '@/hooks/useI18n';

import HomeClient from './HomeClient';

// Disable caching for authentication-dependent content
export const dynamic = 'force-dynamic';

export default function HomePage() {
  const { messages } = useI18n();

  return (
    <NoSSR
      fallback={
        <Container maxWidth="lg">
          <Box
            sx={{
              minHeight: '60vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" color="text.secondary">
              {messages.common.loading}
            </Typography>
          </Box>
        </Container>
      }
    >
      <HomeClient />
    </NoSSR>
  );
}
