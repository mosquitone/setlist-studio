'use client';

import { useMutation, gql } from '@apollo/client';
import { Email as EmailIcon, ErrorOutline as ErrorIcon } from '@mui/icons-material';
import { Container, Paper, Typography, Box, CircularProgress } from '@mui/material';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { useSnackbar } from '@/components/providers/SnackbarProvider';
import { useI18n } from '@/hooks/useI18n';

const CONFIRM_EMAIL_CHANGE = gql`
  mutation ConfirmEmailChange($input: EmailChangeConfirmInput!) {
    confirmEmailChange(input: $input) {
      success
      message
    }
  }
`;

export default function ConfirmEmailChangeClient() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { messages } = useI18n();
  const { showError, showSuccess } = useSnackbar();

  const [confirmEmailChange] = useMutation(CONFIRM_EMAIL_CHANGE, {
    onCompleted: (data) => {
      if (data.confirmEmailChange.success) {
        setStatus('success');
        showSuccess(data.confirmEmailChange.message);
        // 3秒後にプロフィールページにリダイレクト
        setTimeout(() => {
          router.push('/profile');
        }, 3000);
      } else {
        setStatus('error');
        showError(data.confirmEmailChange.message || messages.auth.emailChangeFailedDefault);
      }
    },
    onError: (error) => {
      setStatus('error');
      showError(error.message);
    },
  });

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      confirmEmailChange({
        variables: {
          input: { token },
        },
      });
    } else {
      setStatus('error');
      showError(messages.auth.invalidChangeLink);
    }
  }, [searchParams, confirmEmailChange, messages.auth.invalidChangeLink, showError]);

  const renderIcon = () => {
    switch (status) {
      case 'loading':
        return <CircularProgress size={64} sx={{ mb: 2 }} />;
      case 'success':
        return <EmailIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />;
      case 'error':
        return <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />;
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'loading':
        return messages.auth.emailChangeProcessing;
      case 'success':
        return messages.auth.emailChangeComplete;
      case 'error':
        return messages.auth.emailChangeError;
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            {renderIcon()}
            <Typography variant="h4" component="h1" gutterBottom>
              {getTitle()}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {status === 'loading' && messages.auth.emailChangeProcessingDescription}
              {status === 'success' && messages.auth.emailChangeSuccessDescription}
              {status === 'error' && messages.auth.emailChangeFailedDescription}
            </Typography>
          </Box>

          {status === 'success' && (
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="body2" sx={{ color: 'success.main' }}>
                {messages.auth.redirectingToProfile}
              </Typography>
            </Box>
          )}

          <Box textAlign="center">
            <Typography variant="body2">
              <Link href="/profile" style={{ color: 'inherit' }}>
                ← {messages.auth.backToProfile}
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
