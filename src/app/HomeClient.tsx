'use client';

import { useQuery } from '@apollo/client';
import FolderIcon from '@mui/icons-material/Folder';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import { Container, Box, Typography, Paper } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import GoogleColorIcon from '@/components/common/icons/GoogleColorIcon';
import { useAuth } from '@/components/providers/AuthProvider';
import { useSnackbar } from '@/components/providers/SnackbarProvider';
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
  const { showSuccess } = useSnackbar();
  const searchParams = useSearchParams();

  // URLパラメータからGoogle認証成功を検出して表示
  useEffect(() => {
    const loginType = searchParams.get('login');
    if (loginType === 'google' && isLoggedIn) {
      showSuccess(messages.notifications.loginSuccess);
    }
  }, [searchParams, isLoggedIn, showSuccess, messages]);

  const { data: setlistsData, loading: setlistsLoading } = useQuery<GetSetlistsResponse>(
    GET_SETLISTS,
    {
      skip: !isLoggedIn,
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: false,
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

        {/* Googleデータ使用説明のセクション */}
        {!isLoggedIn && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                maxWidth: 800,
                width: '100%',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              {/* ヘッダー部分 - 中央揃え */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2.5 }}>
                <GoogleColorIcon sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="h6" fontWeight={600} align="center">
                  {messages.auth.googleAuthAbout}
                </Typography>
                <Typography variant="caption" color="text.secondary" align="center">
                  {messages.auth.googleAuthSafeAndEasy}
                </Typography>
              </Box>

              {/* 説明文 - 中央揃え */}
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mb: 2.5, lineHeight: 1.7 }}
              >
                {messages.auth.googleAuthPurpose}
              </Typography>

              {/* 機能リスト - 横並び */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 3,
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1 }}>
                  <SecurityIcon sx={{ color: 'primary.main', fontSize: 20, mt: 0.3 }} />
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {messages.auth.googleAuthSecure}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {messages.auth.googleAuthSecureDescription}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1 }}>
                  <PersonIcon sx={{ color: 'primary.main', fontSize: 20, mt: 0.3 }} />
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {messages.auth.googleAuthBasicInfo}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {messages.auth.googleAuthBasicInfoDescription}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1 }}>
                  <FolderIcon sx={{ color: 'primary.main', fontSize: 20, mt: 0.3 }} />
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {messages.auth.googleAuthDataSave}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {messages.auth.googleAuthDataSaveDescription}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* プライバシー保証 - アイコン横並び、テキスト中央 */}
              <Box
                sx={{
                  mt: 3,
                  p: 1.5,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                }}
              >
                <InfoOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {messages.auth.googleAuthPrivacyNote}
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}
      </Box>
    </Container>
  );
}
