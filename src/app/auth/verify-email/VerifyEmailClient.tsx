'use client';

import { useMutation, gql } from '@apollo/client';
import { VerifiedUser as VerifiedUserIcon, ErrorOutline as ErrorIcon } from '@mui/icons-material';
import { Container, Paper, Typography, Box, CircularProgress } from '@mui/material';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Button } from '@/components/common/ui/Button';
import { useSnackbar } from '@/components/providers/SnackbarProvider';
import { useI18n } from '@/hooks/useI18n';

const VERIFY_EMAIL = gql`
  mutation VerifyEmail($input: EmailVerificationInput!) {
    verifyEmail(input: $input) {
      success
      message
    }
  }
`;

const RESEND_VERIFICATION_EMAIL = gql`
  mutation ResendVerificationEmail($email: String!) {
    resendVerificationEmail(email: $email) {
      success
      message
    }
  }
`;

export default function VerifyEmailClient() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [email, setEmail] = useState('');
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { messages } = useI18n();
  const { showError, showSuccess } = useSnackbar();

  const [verifyEmail] = useMutation(VERIFY_EMAIL, {
    onCompleted: (data) => {
      if (data.verifyEmail.success) {
        setStatus('success');
        showSuccess(data.verifyEmail.message);
        // 3秒後にログインページにリダイレクト
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setStatus('error');
        showError(data.verifyEmail.message || messages.auth.emailVerificationFailedDefault);
        setCanResend(true);
      }
    },
    onError: (error) => {
      setStatus('error');
      showError(error.message);
      setCanResend(true);
    },
  });

  const [resendVerificationEmail, { loading: resendLoading }] = useMutation(
    RESEND_VERIFICATION_EMAIL,
    {
      onCompleted: (data) => {
        if (data.resendVerificationEmail.success) {
          showSuccess(data.resendVerificationEmail.message);
          setCanResend(false);
        } else {
          showError(data.resendVerificationEmail.message || messages.common.error);
        }
      },
      onError: (error) => {
        showError(error.message);
      },
    },
  );

  useEffect(() => {
    const token = searchParams.get('token');
    const emailParam = searchParams.get('email');

    if (emailParam) {
      setEmail(emailParam);
    }

    if (token) {
      verifyEmail({
        variables: {
          input: { token },
        },
      });
    } else {
      setStatus('error');
      showError(messages.auth.invalidVerificationLink);
      setCanResend(true);
    }
  }, [searchParams, verifyEmail, messages.auth.invalidVerificationLink, showError]);

  const handleResendEmail = () => {
    if (email) {
      resendVerificationEmail({
        variables: { email },
      });
    }
  };

  const renderIcon = () => {
    switch (status) {
      case 'loading':
        return <CircularProgress size={64} sx={{ mb: 2 }} />;
      case 'success':
        return <VerifiedUserIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />;
      case 'error':
        return <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />;
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'loading':
        return messages.auth.emailVerificationProcessing;
      case 'success':
        return messages.auth.emailVerificationComplete;
      case 'error':
        return messages.auth.emailVerificationError;
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
              {status === 'loading' && messages.auth.emailVerificationProcessingDescription}
              {status === 'success' && messages.auth.emailVerificationSuccessDescription}
              {status === 'error' && messages.auth.emailVerificationFailedDescription}
            </Typography>
          </Box>

          {status === 'success' && (
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="body2" sx={{ color: 'success.main' }}>
                {messages.auth.redirectingToLogin}
              </Typography>
            </Box>
          )}

          {status === 'error' && canResend && email && (
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Button
                variant="outlined"
                onClick={handleResendEmail}
                disabled={resendLoading}
                sx={{ mb: 2 }}
              >
                {resendLoading
                  ? messages.auth.resendingEmail
                  : messages.auth.resendVerificationEmailButton}
              </Button>
            </Box>
          )}

          <Box textAlign="center">
            <Typography variant="body2">
              <Link href="/login" style={{ color: 'inherit' }}>
                ← {messages.auth.backToLoginPage}
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
