'use client';

import { useQuery } from '@apollo/client';
import { Container, Box, Typography } from '@mui/material';

import { useAuth } from '@/components/providers/AuthProvider';
import { useI18n } from '@/hooks/useI18n';
import { GET_SETLISTS } from '@/lib/server/graphql/apollo-operations';

import { FeatureSection } from '../components/home/FeatureSection';
import { PrimaryAuthSection } from '../components/home/PrimaryAuthSection';
import { SampleSetlistsSection } from '../components/home/SampleSetlistsSection';
import { SetlistDashboard } from '../components/home/SetlistDashboard';
import { WelcomeSection } from '../components/home/WelcomeSection';
import { GetSetlistsResponse } from '../types/graphql';

export default function HomeClient() {
  const { isLoggedIn, isLoading } = useAuth();
  const { messages } = useI18n();

  const { data: setlistsData, loading: setlistsLoading } = useQuery<GetSetlistsResponse>(
    GET_SETLISTS,
    {
      skip: !isLoggedIn,
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    },
  );

  if (isLoading) {
    return (
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
    );
  }

  const hasNoSetlists =
    !setlistsLoading && (!setlistsData?.setlists || setlistsData.setlists.length === 0);
  const shouldShowSamples = !isLoggedIn || hasNoSetlists;

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          py: { xs: 2, sm: 3, md: 3 },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 3, sm: 4, md: 5 },
        }}
      >
        <WelcomeSection />

        {!isLoggedIn && <PrimaryAuthSection />}

        {shouldShowSamples && <SampleSetlistsSection />}

        <FeatureSection />

        {isLoggedIn && (
          <SetlistDashboard setlistsData={setlistsData} setlistsLoading={setlistsLoading} />
        )}
      </Box>
    </Container>
  );
}
