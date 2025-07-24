'use client';

import { useMutation } from '@apollo/client';
import { PersonAdd as PersonAddIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Container,
  Paper,
  TextField,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Divider,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import { Button } from '@/components/common/ui/Button';
import { useAuth } from '@/components/providers/AuthProvider';
import { useSnackbar } from '@/components/providers/SnackbarProvider';
import { useI18n } from '@/hooks/useI18n';
import { validateField, ValidationRules } from '@/lib/security/validation-rules';
import { REGISTER } from '@/lib/server/graphql/apollo-operations';
import type { RegisterData } from '@/types/graphql';

export default function RegisterClient() {
  const { messages } = useI18n();
  const { login } = useAuth();
  const { showError } = useSnackbar();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const router = useRouter();

  const [register, { loading }] = useMutation(REGISTER, {
    onCompleted: async (data: RegisterData) => {
      try {
        // 新しいレスポンス形式：メール認証が必要
        if (data.register.requiresEmailVerification) {
          router.push(`/auth/check-email?email=${encodeURIComponent(data.register.email)}`);
          return;
        }

        // 従来のトークンレスポンス（Google認証など）
        if (!data.register.token) {
          showError('認証トークンが見つかりません');
          return;
        }

        const result = await login(data.register.token);
        if (result.success) {
          router.push('/');
          return;
        }

        showError('認証の設定に失敗しました');
      } catch (error) {
        console.error('Auth login failed:', error);
        showError('認証の設定に失敗しました');
      }
    },
    onError: (error) => {
      showError(error.message);
    },
  });

  const validatePassword = (password: string): string | null => {
    const result = validateField(password, 'password');
    return result.isValid ? null : result.message || messages.validation.passwordTooShort;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // パスワード強度チェック
    const passwordError = validatePassword(password);
    if (passwordError) {
      showError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      showError(messages.validation.passwordsDoNotMatch);
      return;
    }

    if (!agreeToTerms) {
      showError(messages.validation.agreeToTerms || 'Please agree to the terms and conditions');
      return;
    }

    register({
      variables: {
        input: { email, username, password },
      },
    });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <PersonAddIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              {messages.auth.register}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {messages.auth.createAccountToStart}
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={messages.auth.username}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              autoComplete="username"
            />
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
              autoComplete="new-password"
              helperText={messages.auth.passwordRequirements}
              inputProps={{
                pattern: ValidationRules.password.pattern.source,
                title: messages.auth.passwordRequirements,
                minLength: ValidationRules.password.minLength,
                maxLength: ValidationRules.password.maxLength,
              }}
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
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  <Link href="/terms" style={{ color: 'inherit', textDecoration: 'underline' }}>
                    {messages.auth.terms}
                  </Link>
                  {messages.auth.and || 'and'}
                  <Link
                    href="/privacy-policy"
                    style={{ color: 'inherit', textDecoration: 'underline' }}
                  >
                    {messages.auth.privacy}
                  </Link>
                  {messages.auth.agree || 'に同意します'}
                </Typography>
              }
              sx={{ mt: 2, mb: 1 }}
            />

            <Button
              type="submit"
              fullWidth
              size="large"
              disabled={loading || !agreeToTerms}
              sx={{ mt: 2, mb: 2, py: 1.5 }}
            >
              {loading ? messages.common.loading : messages.auth.register}
            </Button>
          </Box>

          <Divider sx={{ my: 2, '&::before, &::after': { borderTopWidth: 2 } }}>
            <Typography variant="body2" color="text.secondary">
              {messages.common.or}
            </Typography>
          </Divider>

          <GoogleAuthButton mode="signup" onError={showError} sx={{ mb: 2 }} />

          <Box textAlign="center">
            <Typography variant="body2">
              {messages.auth.alreadyHaveAccount}{' '}
              <Link href="/login" style={{ color: 'inherit' }}>
                <strong>{messages.auth.login}</strong>
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
