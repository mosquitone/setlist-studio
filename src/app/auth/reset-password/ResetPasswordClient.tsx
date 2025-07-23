'use client';

import { useMutation, useQuery, gql } from '@apollo/client';
import { LockReset as LockResetIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Container,
  Paper,
  TextField,
  Typography,
  Box,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Button } from '@/components/common/ui/Button';
import { useI18n } from '@/hooks/useI18n';

const RESET_PASSWORD = gql`
  mutation ResetPassword($input: PasswordResetInput!) {
    resetPassword(input: $input) {
      success
      message
    }
  }
`;

const GET_RESET_TOKEN_INFO = gql`
  query GetResetTokenInfo($token: String!) {
    getPasswordResetTokenInfo(token: $token) {
      email
      isValid
    }
  }
`;

export default function ResetPasswordClient() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [token, setToken] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { messages } = useI18n();

  // トークン情報を取得
  const { data: tokenInfo } = useQuery(GET_RESET_TOKEN_INFO, {
    variables: { token },
    skip: !token,
  });

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError(messages.auth.invalidResetToken);
    }
  }, [searchParams, messages.auth.invalidResetToken]);

  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD, {
    onCompleted: (data) => {
      if (data.resetPassword.success) {
        setSuccessMessage(data.resetPassword.message);
        setError('');
        // 3秒後にログインページにリダイレクト
        setTimeout(() => {
          router.push(`/login?message=${encodeURIComponent(messages.auth.passwordResetSuccess)}`);
        }, 3000);
      } else {
        setError(data.resetPassword.message || messages.auth.serverError);
        setSuccessMessage('');
      }
    },
    onError: (error) => {
      setError(error.message);
      setSuccessMessage('');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (newPassword !== confirmPassword) {
      setError(messages.validation.passwordsDoNotMatch);
      return;
    }

    if (!token) {
      setError(messages.auth.invalidResetToken);
      return;
    }

    await resetPassword({
      variables: {
        input: {
          token,
          newPassword,
        },
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
              {messages.auth.resetPassword}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {messages.auth.passwordResetDescription}
            </Typography>
            {tokenInfo?.getPasswordResetTokenInfo?.isValid &&
              tokenInfo?.getPasswordResetTokenInfo?.email && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {messages.common.account}: {tokenInfo.getPasswordResetTokenInfo.email}
                </Typography>
              )}
          </Box>

          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
              <br />
              <Typography variant="body2" sx={{ mt: 1 }}>
                {messages.auth.redirectingToLogin}
              </Typography>
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {!successMessage && (
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label={messages.auth.newPassword}
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                margin="normal"
                required
                autoComplete="new-password"
                helperText={messages.auth.passwordRequirements}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label={messages.auth.confirmPassword}
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
                required
                autoComplete="new-password"
                helperText={messages.auth.confirmPasswordHelper}
                error={confirmPassword !== '' && newPassword !== confirmPassword}
              />
              <Button
                type="submit"
                fullWidth
                size="large"
                disabled={loading || !token}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                {loading ? messages.common.loading : messages.auth.resetPassword}
              </Button>
            </Box>
          )}

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
