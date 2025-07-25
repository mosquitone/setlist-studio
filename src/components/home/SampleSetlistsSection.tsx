'use client';

import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

import OptimizedImage from '@/components/common/ui/OptimizedImage';
import { useI18n } from '@/hooks/useI18n';

export function SampleSetlistsSection() {
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
        {messages.pages.home.sampleSetlists.title}
      </Typography>
      <Box textAlign="center" sx={{ mb: 2 }}>
        <Typography variant="body1" color="text.secondary" component="div">
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
            {messages.pages.home.sampleSetlists.description}
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
            <CardContent sx={{ p: 1 }}>
              <Typography variant="h6" component="h3" textAlign="center" sx={{ mb: 2 }}>
                {messages.pages.home.sampleSetlists.blackTheme}
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
                <OptimizedImage
                  src="/setlist-mosquitone-black.png"
                  fallbackSrc="/setlist-mosquitone-black.png"
                  alt={messages.pages.home.sampleSetlists.blackThemeAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                  style={{ objectFit: 'contain' }}
                  priority
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
            <CardContent sx={{ p: 1 }}>
              <Typography variant="h6" component="h3" textAlign="center" sx={{ mb: 2 }}>
                {messages.pages.home.sampleSetlists.whiteTheme}
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
                <OptimizedImage
                  src="/setlist-mosquitone-white.png"
                  fallbackSrc="/setlist-mosquitone-white.png"
                  alt={messages.pages.home.sampleSetlists.whiteThemeAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          {messages.pages.home.sampleSetlists.footer}
        </Typography>
      </Box>
    </Box>
  );
}
