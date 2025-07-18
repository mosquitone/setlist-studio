'use client';

import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import Image from 'next/image';
import { useI18n } from '@/hooks/useI18n';

export function SampleSetlistsSection() {
  const { t } = useI18n();

  return (
    <Box>
      <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 2 }}>
        {t.pages.home.sampleSetlists.title}
      </Typography>
      <Box textAlign="center" sx={{ mb: 2 }}>
        <Typography variant="body1" color="text.secondary" component="div">
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
            {t.pages.home.sampleSetlists.description}
          </Box>
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {/* Black Theme Sample */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              maxWidth: 400,
              margin: '0 auto',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6,
              },
            }}
          >
            <CardContent sx={{ p: 1 }}>
              <Typography variant="h6" component="h3" textAlign="center" sx={{ mb: 2 }}>
                {t.pages.home.sampleSetlists.blackTheme}
              </Typography>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 300,
                  borderRadius: 1,
                  overflow: 'hidden',
                  backgroundColor: '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src="/setlist-mosquitone-black.png"
                  alt={t.pages.home.sampleSetlists.blackThemeAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                  style={{ objectFit: 'contain' }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* White Theme Sample */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              maxWidth: 400,
              margin: '0 auto',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6,
              },
            }}
          >
            <CardContent sx={{ p: 1 }}>
              <Typography variant="h6" component="h3" textAlign="center" sx={{ mb: 2 }}>
                {t.pages.home.sampleSetlists.whiteTheme}
              </Typography>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 300,
                  borderRadius: 1,
                  overflow: 'hidden',
                  backgroundColor: '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  src="/setlist-mosquitone-white.png"
                  alt={t.pages.home.sampleSetlists.whiteThemeAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                  style={{ objectFit: 'contain' }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          {t.pages.home.sampleSetlists.footer}
        </Typography>
      </Box>
    </Box>
  );
}
