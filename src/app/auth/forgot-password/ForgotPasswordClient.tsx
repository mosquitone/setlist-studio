'use client';

import { useMutation, gql } from '@apollo/client';
import { LockReset as LockResetIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { Container, Paper, TextField, Typography, Box, CircularProgress } from '@mui/material';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import { Button } from '@/components/common/ui/Button';
import { useSnackbar } from '@/components/providers/SnackbarProvider';
import { useI18n } from '@/hooks/useI18n';
import type { RequestPasswordResetData } from '@/types/graphql';

const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($input: PasswordResetRequestInput!) {
    requestPasswordReset(input: $input) {
      success
      message
    }
  }
`;

export default function ForgotPasswordClient() {
  const { messages } = useI18n();
  const { showError, showSuccess } = useSnackbar();
  const [email, setEmail] = useState('');
  const [canResend, setCanResend] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendCount, setResendCount] = useState(0);

  const [requestPasswordReset, { loading }] = useMutation(REQUEST_PASSWORD_RESET, {
    onCompleted: (data: RequestPasswordResetData) => {
      if (data.requestPasswordReset.success) {
        showSuccess(data.requestPasswordReset.message);
        setResendCount((prev) => prev + 1);

        // 再送信後のクールダウン設定
        const cooldownTime = Math.min(60 * Math.pow(2, resendCount), 300); // 最大5分
        setResendCooldown(cooldownTime);
        setCanResend(false);
      } else {
        showError(data.requestPasswordReset.message || messages.common.error);
      }
    },
    onError: (error) => {
      showError(error.message);
    },
  });

  // クールダウンタイマー
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canResend) {
      showError(messages.common.wait);
      return;
    }

    await requestPasswordReset({
      variables: {
        input: { email },
      },
    });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <LockResetIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              {messages.auth.passwordResetTitle}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {messages.auth.passwordResetDescription}
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={messages.auth.email}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              autoComplete="email"
              helperText={messages.auth.resetEmailHelp}
            />
            <Button
              type="submit"
              fullWidth
              size="large"
              disabled={loading || !canResend}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
            >
              {loading
                ? messages.common.loading
                : !canResend
                  ? `${messages.auth.resendAvailableIn} ${formatTime(resendCooldown)}`
                  : resendCount > 0
                    ? messages.auth.resendPasswordReset
                    : messages.auth.resetPassword}
            </Button>

            {resendCount > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                {resendCount} {messages.auth.resendCount}
              </Typography>
            )}
          </Box>

          <Box textAlign="center">
            <Typography variant="body2">
              <Link href="/login" style={{ color: 'inherit' }}>
                ← {messages.auth.backToLogin}
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
