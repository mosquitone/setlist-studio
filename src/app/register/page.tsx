'use client';

import { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Visibility,
  VisibilityOff,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import { REGISTER } from '@/lib/server/graphql/apollo-operations';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const [register, { loading }] = useMutation(REGISTER, {
    onCompleted: () => {
      // 新規登録成功後はログイン画面へ遷移
      router.push('/login?message=新規登録が完了しました。ログインしてください。');
    },
    onError: error => {
      setError(error.message);
    },
  });

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'パスワードは8文字以上である必要があります';
    }

    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);

    if (!hasLowercase || !hasUppercase || !hasNumber || !hasSpecialChar) {
      return 'パスワードは大文字・小文字・数字・特殊文字（@$!%*?&）を含む必要があります';
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // パスワード強度チェック
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
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
        <Button component={Link} href="/" startIcon={<ArrowBackIcon />} sx={{ mb: 3 }}>
          ホームに戻る
        </Button>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <PersonAddIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              新規登録
            </Typography>
            <Typography variant="body1" color="text.secondary">
              アカウントを作成して、セットリストを管理しましょう
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
              label="ユーザー名"
              value={username}
              onChange={e => setUsername(e.target.value)}
              margin="normal"
              required
              autoComplete="username"
            />
            <TextField
              fullWidth
              label="メールアドレス"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              margin="normal"
              required
              autoComplete="email"
            />
            <TextField
              fullWidth
              label="パスワード"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="new-password"
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
              label="パスワード確認"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? '登録中...' : '新規登録'}
            </Button>
          </Box>

          <Box textAlign="center">
            <Typography variant="body2">
              すでにアカウントをお持ちですか？{' '}
              <Link href="/login" style={{ color: 'inherit' }}>
                <strong>ログイン</strong>
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
