'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Button } from '@/components/common/ui/Button';
import { LockReset as LockResetIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import Link from 'next/link';

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
  const [canResend, setCanResend] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendCount, setResendCount] = useState(0);

  const [requestPasswordReset, { loading }] = useMutation(REQUEST_PASSWORD_RESET, {
    onCompleted: (data) => {
      if (data.requestPasswordReset.success) {
        setSuccessMessage(data.requestPasswordReset.message);
        setError('');
        setResendCount((prev) => prev + 1);

        // 再送信後のクールダウン設定
        const cooldownTime = Math.min(60 * Math.pow(2, resendCount), 300); // 最大5分
        setResendCooldown(cooldownTime);
        setCanResend(false);
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
    setError('');
    setSuccessMessage('');

    if (!canResend) {
      setError('再送信まで時間をおいてください');
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
              パスワードリセット
            </Typography>
            <Typography variant="body1" color="text.secondary">
              メールアドレスを入力してパスワードリセット手順をお送りします
            </Typography>
          </Box>

          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
              <Typography variant="body2" sx={{ mt: 1 }}>
                メールをご確認ください。
              </Typography>
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

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
              disabled={loading || !canResend}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
            >
              {loading
                ? 'リクエスト送信中...'
                : !canResend
                  ? `再送信可能まで ${formatTime(resendCooldown)}`
                  : resendCount > 0
                    ? 'パスワードリセットを再送信'
                    : 'パスワードリセット'}
            </Button>

            {resendCount > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                {resendCount}回送信済み
              </Typography>
            )}
          </Box>

          {successMessage && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>メールが届かない場合：</strong>
                <br />
                • 迷惑メールフォルダを確認してください
                <br />
                • 数分かかる場合があります
                <br />• 上記ボタンから再送信できます
              </Typography>
            </Alert>
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
