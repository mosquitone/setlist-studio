'use client'

import { Box, Button, Stack, Fade } from '@mui/material'
import { Login as LoginIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material'
import Link from 'next/link'

export function AuthActions() {
  return (
    <Fade in timeout={1000} style={{ transitionDelay: '400ms' }}>
      <Box sx={{ textAlign: 'center' }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          justifyContent="center"
          alignItems="center"
        >
          <Button
            variant="outlined"
            size="large"
            component={Link}
            href="/login"
            startIcon={<LoginIcon />}
            sx={{
              minWidth: 220,
              borderRadius: 10,
              px: 4,
              py: 2,
              borderColor: '#3b82f6',
              color: '#3b82f6',
              fontSize: '16px',
              fontWeight: 500,
              textTransform: 'none',
              border: '2px solid #3b82f6',
              '&:hover': {
                borderColor: '#2563eb',
                backgroundColor: 'rgba(59, 130, 246, 0.04)',
              },
            }}
          >
            ログイン
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            href="/register"
            startIcon={<PersonAddIcon />}
            sx={{
              minWidth: 220,
              borderRadius: 10,
              px: 4,
              py: 2,
              borderColor: '#ef4444',
              color: '#ef4444',
              fontSize: '16px',
              fontWeight: 500,
              textTransform: 'none',
              border: '2px solid #ef4444',
              '&:hover': {
                borderColor: '#dc2626',
                backgroundColor: 'rgba(239, 68, 68, 0.04)',
              },
            }}
          >
            新規登録
          </Button>
        </Stack>
      </Box>
    </Fade>
  )
}
