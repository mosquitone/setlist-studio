'use client';

import { useMutation } from '@apollo/client';
import { Login as LoginIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Container,
  Paper,
  TextField,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Divider,
} from '@mui/material';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import { Button } from '@/components/common/ui/Button';
import { useAuth } from '@/components/providers/AuthProvider';
import { useSnackbar } from '@/components/providers/SnackbarProvider';
import { useI18n } from '@/hooks/useI18n';
import { LOGIN } from '@/lib/server/graphql/apollo-operations';
import type { LoginData } from '@/types/graphql';

export default function LoginClient() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login: authLogin } = useAuth();
  const { messages } = useI18n();
  const { showError, showSuccess } = useSnackbar();

  // URLパラメータからエラーメッセージを取得して表示
  useEffect(() => {
    const error = searchParams.get('error');
    const emailParam = searchParams.get('email');

    if (error === 'email_account_exists' && emailParam) {
      showError(messages.errors.emailAccountExists.replace('{email}', emailParam));
      setEmail(emailParam); // メールアドレスを入力欄に自動入力
    } else if (error === 'google_account_exists' && emailParam) {
      showError(messages.errors.googleAccountExists.replace('{email}', emailParam));
    } else if (error === 'auth_failed') {
      showError(messages.errors.googleAuthFailed);
    } else if (error === 'server_error') {
      showError(messages.errors.serverError);
    }
  }, [searchParams, showError, messages]);

  const [loginMutation, { loading }] = useMutation(LOGIN, {
    onCompleted: async (data: LoginData) => {
      const result = await authLogin(data.login.token);
      if (result.success) {
        showSuccess(messages.notifications.loginSuccess);
        router.push('/');
      } else {
        showError(result.error || 'Login failed');
      }
    },
    onError: (error) => {
      showError(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await loginMutation({
      variables: {
        input: { email, password },
      },
    });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <LoginIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              {messages.auth.login}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {messages.auth.loginToManageSetlists}
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
            />
            <TextField
              fullWidth
              label={messages.auth.password}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="current-password"
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
            <Button
              type="submit"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? messages.common.loading : messages.auth.login}
            </Button>
          </Box>

          <Divider sx={{ my: 2, '&::before, &::after': { borderTopWidth: 2 } }}>
            <Typography variant="body2" color="text.secondary">
              {messages.common.or}
            </Typography>
          </Divider>

          <GoogleAuthButton onError={showError} sx={{ mb: 2 }} />

          <Box textAlign="center">
            <Typography variant="body2" sx={{ mb: 2 }}>
              <Link href="/auth/forgot-password" style={{ color: 'inherit' }}>
                {messages.auth.forgotPassword}
              </Link>
            </Typography>
            <Typography variant="body2">
              {messages.auth.dontHaveAccount}{' '}
              <Link href="/register" style={{ color: 'inherit' }}>
                <strong>{messages.auth.register}</strong>
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
