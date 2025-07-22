'use client';

import { Box, Stack, Fade } from '@mui/material';
import { AuthLink } from '@/components/common/auth/LoginLink';

export function AuthActions() {
  return (
    <Fade in timeout={1000} style={{ transitionDelay: '400ms' }}>
      <Box sx={{ textAlign: 'center', display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Stack
          direction={{ xs: 'row', sm: 'row' }}
          spacing={{ xs: 1.5, sm: 3 }}
          justifyContent="center"
          alignItems="center"
          sx={{
            width: 'fit-content',
            flexWrap: 'wrap',
            gap: { xs: 1.5, sm: 3 },
          }}
        >
          <AuthLink variant="home" type="login" />
          <AuthLink variant="home" type="register" />
        </Stack>
      </Box>
    </Fade>
  );
}
