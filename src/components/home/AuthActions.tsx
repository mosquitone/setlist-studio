'use client';

import { Box, Stack, Fade } from '@mui/material';
import { Button } from '@/components/common/Button';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { LoginLink } from '@/components/common/LoginLink';
import Link from 'next/link';

export function AuthActions() {
  return (
    <Fade in timeout={1000} style={{ transitionDelay: '400ms' }}>
      <Box sx={{ textAlign: 'center', display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, sm: 3 }}
          justifyContent="center"
          alignItems="center"
          sx={{ width: 'fit-content' }}
        >
          <LoginLink variant="home" />
          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/register"
            startIcon={<PersonAddIcon />}
            sx={{
              minWidth: { xs: 200, sm: 220 },
              width: { xs: '100%', sm: 'auto' },
              maxWidth: { xs: 300, sm: 'none' },
              borderRadius: 10,
              px: 4,
              py: 2,
              backgroundColor: '#059669',
              color: 'white',
              fontSize: '16px',
              fontWeight: 600,
              textTransform: 'none',
              border: 'none',
              boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: '#047857',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(5, 150, 105, 0.4)',
              },
              '&:active': {
                transform: 'translateY(-1px)',
                transition: 'all 0.1s ease-out',
              },
            }}
          >
            新規登録
          </Button>
        </Stack>
      </Box>
    </Fade>
  );
}
