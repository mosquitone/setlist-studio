'use client';

import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import Image from 'next/image';

export function SampleSetlistsSection() {
  return (
    <Box sx={{ mb: 8 }}>
      <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 4 }}>
        セットリストサンプル
      </Typography>
      <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
        Setlist Studioで作成できるセットリストの例をご覧ください
      </Typography>

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
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h6" component="h3" textAlign="center" sx={{ mb: 2 }}>
                Black Theme
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
                  alt="セットリストサンプル - ブラックテーマ"
                  fill
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
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h6" component="h3" textAlign="center" sx={{ mb: 2 }}>
                White Theme
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
                  alt="セットリストサンプル - ホワイトテーマ"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          このようなセットリストを簡単に作成・ダウンロードできます
        </Typography>
      </Box>
    </Box>
  );
}
