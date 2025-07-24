'use client';

import { Container, Box, Typography } from '@mui/material';
import Image from 'next/image';
import Script from 'next/script';

import NoSSR from '@/components/common/ui/NoSSR';
import { useI18n } from '@/hooks/useI18n';
import { getSoftwareApplicationSchema } from '@/lib/metadata/pageSchemas';

import HomeClient from './HomeClient';

export default function HomePageClient() {
  const { messages } = useI18n();
  const softwareSchema = getSoftwareApplicationSchema();

  return (
    <>
      <Script
        id="software-application-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <NoSSR
        fallback={
          <Container maxWidth="lg">
            <Box
              sx={{
                py: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Box component="h1" sx={{ m: 0 }}>
                <Image
                  src="/setlist-studio-logo.png"
                  alt="Setlist Studio - バンド向けセットリスト作成ツール"
                  width={350}
                  height={80}
                  priority
                />
              </Box>
              <Typography variant="h5" color="text.secondary" align="center">
                {messages.pages.home.heroSubtitle}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {messages.common.loading}
              </Typography>
            </Box>
          </Container>
        }
      >
        <HomeClient />
      </NoSSR>
    </>
  );
}
