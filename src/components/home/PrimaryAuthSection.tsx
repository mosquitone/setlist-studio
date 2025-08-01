'use client';

import { Box, Stack } from '@mui/material';

import { AuthLink } from '@/components/common/auth/LoginLink';

export function PrimaryAuthSection() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        px: { xs: 2, md: 0 },
        gap: 4,
      }}
    >
      {/* 認証ボタンセクション */}
      <Stack
        direction="row"
        spacing={{ xs: 1.5, sm: 2 }}
        justifyContent="center"
        alignItems="center"
        sx={{
          width: 'fit-content',
          animation: 'fadeInUp 0.8s ease-out 0.6s both',
          '@keyframes fadeInUp': {
            '0%': {
              opacity: 0,
              transform: 'translateY(30px)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)',
            },
          },
        }}
      >
        <AuthLink variant="primary" type="login" />
        <AuthLink variant="primary" type="register" />
      </Stack>
    </Box>
  );
}
