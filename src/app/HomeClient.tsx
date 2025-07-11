'use client';

import { Container, Box, Typography } from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_SETLISTS } from '@/lib/server/graphql/apollo-operations';
import { GetSetlistsResponse } from '../types/graphql';
import { useAuth } from '@/components/providers/AuthProvider';
import { WelcomeSection } from '../components/home/WelcomeSection';
import { FeatureSection } from '../components/home/FeatureSection';
import { SetlistDashboard } from '../components/home/SetlistDashboard';
import { AuthActions } from '../components/home/AuthActions';
export default function HomeClient() {
  const { isLoggedIn, isLoading } = useAuth();

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
            読み込み中...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <WelcomeSection />
        <FeatureSection />

        {isLoggedIn && (
          <SetlistDashboard setlistsData={setlistsData} setlistsLoading={setlistsLoading} />
        )}

        {!isLoggedIn && <AuthActions />}
      </Box>
    </Container>
  );
}
