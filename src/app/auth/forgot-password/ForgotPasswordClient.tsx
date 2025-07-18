'use client';

import { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { Button } from '@/components/common/ui/Button';
import { LockReset as LockResetIcon } from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($input: PasswordResetRequestInput!) {
    requestPasswordReset(input: $input) {
      success
      message
    }
  }
`;

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const [requestPasswordReset, { loading }] = useMutation(REQUEST_PASSWORD_RESET, {
    onCompleted: (data) => {
      if (data.requestPasswordReset.success) {
        setSuccessMessage(data.requestPasswordReset.message);
        setError('');
        // 5秒後にログインページにリダイレクト
        setTimeout(() => {
          router.push('/login');
        }, 5000);
      } else {
        setError(data.requestPasswordReset.message || 'リクエストに失敗しました');
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
              パスワードリセット
            </Typography>
            <Typography variant="body1" color="text.secondary">
              メールアドレスを入力してパスワードリセット手順をお送りします
            </Typography>
          </Box>

          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
              <br />
              <Typography variant="body2" sx={{ mt: 1 }}>
                5秒後にログインページに戻ります...
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
                label="メールアドレス"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                autoComplete="email"
                helperText="登録済みのメールアドレスを入力してください"
              />
              <Button
                type="submit"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                {loading ? 'リクエスト送信中...' : 'パスワードリセット'}
              </Button>
            </Box>
          )}

          <Box textAlign="center">
            <Typography variant="body2">
              <Link href="/login" style={{ color: 'inherit' }}>
                ← ログインページに戻る
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}