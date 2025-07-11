import { Link } from '@mui/material';
import { Button } from '@/components/common/Button';
import { Login as LoginIcon } from '@mui/icons-material';
import { useAuth } from '@/components/providers/AuthProvider';
import NextLink from 'next/link';

export type LoginLinkVariant = 'header' | 'mobile' | 'home';

interface LoginLinkProps {
  variant: LoginLinkVariant;
}

export function LoginLink({ variant }: LoginLinkProps) {
  const { isLoading } = useAuth();

  // ヘッダー用（白いアウトラインボタン）
  if (variant === 'header') {
    return (
      <Link
        href="/login"
        underline="none"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          px: 4,
          py: 1.5,
          borderRadius: 10,
          border: '2px solid white',
          color: 'white',
          fontSize: '16px',
          fontWeight: 500,
          textDecoration: 'none',
          minWidth: 140,
          justifyContent: 'center',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: 'rgba(255, 255, 255, 0.9)',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            boxShadow: '0 4px 12px rgba(255, 255, 255, 0.2)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(-1px)',
          },
          opacity: isLoading ? 0.5 : 1,
          pointerEvents: isLoading ? 'none' : 'auto',
        }}
      >
        <LoginIcon />
        {isLoading ? '読込中…' : 'ログイン'}
      </Link>
    );
  }

  // モバイル用（青色のボタン）
  if (variant === 'mobile') {
    return (
      <Link
        href="/login"
        underline="none"
        sx={{
          display: 'block',
          width: '100%',
          px: 2,
          py: 1.5,
          borderRadius: 10,
          border: '2px solid',
          borderColor: '#3b82f6',
          color: '#3b82f6',
          textAlign: 'center',
          textDecoration: 'none',
          textTransform: 'none',
          fontWeight: 500,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(59, 130, 246, 0.04)',
            borderColor: '#2563eb',
          },
          opacity: isLoading ? 0.5 : 1,
          pointerEvents: isLoading ? 'none' : 'auto',
        }}
      >
        {isLoading ? '読込中…' : 'ログイン'}
      </Link>
    );
  }

  // ホーム用（青いcontainedボタン）
  if (variant === 'home') {
    return (
      <Button
        variant="contained"
        size="large"
        component={NextLink}
        href="/login"
        startIcon={<LoginIcon />}
        sx={{
          minWidth: { xs: 200, sm: 220 },
          width: { xs: '100%', sm: 'auto' },
          maxWidth: { xs: 300, sm: 'none' },
          borderRadius: 10,
          px: 4,
          py: 2,
          backgroundColor: '#3b82f6',
          color: 'white',
          fontSize: '16px',
          fontWeight: 600,
          textTransform: 'none',
          border: 'none',
          boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: '#2563eb',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)',
          },
          '&:active': {
            transform: 'translateY(-1px)',
            transition: 'all 0.1s ease-out',
          },
        }}
      >
        ログイン
      </Button>
    );
  }

  return null;
}
