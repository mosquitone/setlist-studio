'use client';

import { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Typography,
  Box,
  Alert,
  IconButton,
  InputAdornment,
  Divider,
} from '@mui/material';
import { Button } from '@/components/common/ui/Button';
import { Login as LoginIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
import { useMutation } from '@apollo/client';
import { LOGIN } from '@/lib/server/graphql/apollo-operations';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { useI18n } from '@/hooks/useI18n';
import { signIn } from 'next-auth/react';

export default function LoginClient() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const { messages } = useI18n();

  const [loginMutation, { loading }] = useMutation(LOGIN, {
    onCompleted: async (data) => {
      const result = await authLogin(data.login.token);
      if (result.success) {
        router.push('/');
      } else {
        setError(result.error || 'Login failed');
      }
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    await loginMutation({
      variables: {
        input: { email, password },
      },
    });
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');

      // NextAuthでGoogle認証（通常のリダイレクトフロー）
      // NextAuthの設定でリダイレクト先は/api/auth/google-syncに設定済み
      await signIn('google');
    } catch (error) {
      console.error('Google login error:', error);
      setError('Google認証でエラーが発生しました');
    }
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

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

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

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              または
            </Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{ mb: 2 }}
          >
            Googleでログイン
          </Button>

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
