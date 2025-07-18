'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from '@mui/material';
import { Button } from '@/components/common/ui/Button';
import {
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const RESEND_VERIFICATION_EMAIL = gql`
  mutation ResendVerificationEmail($email: String!) {
    resendVerificationEmail(email: $email) {
      success
      message
    }
  }
`;

export default function CheckEmailClient() {
  const [email, setEmail] = useState('');
  const [canResend, setCanResend] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const searchParams = useSearchParams();

  const [resendVerificationEmail, { loading: resendLoading }] = useMutation(
    RESEND_VERIFICATION_EMAIL,
    {
      onCompleted: (data) => {
        if (data.resendVerificationEmail.success) {
          setSuccessMessage(data.resendVerificationEmail.message);
          setError('');
          setResendCount((prev) => prev + 1);

          // 再送信後のクールダウン設定
          const cooldownTime = Math.min(60 * Math.pow(2, resendCount), 300); // 最大5分
          setResendCooldown(cooldownTime);
          setCanResend(false);
        } else {
          setError(data.resendVerificationEmail.message || '再送信に失敗しました');
          setSuccessMessage('');
        }
      },
      onError: (error) => {
        setError(error.message);
        setSuccessMessage('');
      },
    },
  );

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

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

  const handleResendEmail = () => {
    if (email && canResend) {
      resendVerificationEmail({
        variables: { email },
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const steps = [
    {
      label: 'アカウント作成完了',
      content: 'アカウントが正常に作成されました。',
      completed: true,
    },
    {
      label: 'メール認証待ち',
      content: `${email} に認証メールを送信しました。`,
      completed: false,
    },
    {
      label: 'ログイン可能',
      content: 'メール認証後にログインできます。',
      completed: false,
    },
  ];

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <EmailIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              メール認証をお願いします
            </Typography>
            <Typography variant="body1" color="text.secondary">
              アカウントを有効化するため、メールをご確認ください
            </Typography>
          </Box>

          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* プロセス表示 */}
          <Stepper activeStep={1} orientation="vertical" sx={{ mb: 4 }}>
            {steps.map((step, index) => (
              <Step key={step.label} completed={step.completed}>
                <StepLabel
                  icon={
                    step.completed ? (
                      <CheckCircleIcon color="success" />
                    ) : index === 1 ? (
                      <ScheduleIcon color="primary" />
                    ) : undefined
                  }
                >
                  {step.label}
                </StepLabel>
                <StepContent>
                  <Typography variant="body2" color="text.secondary">
                    {step.content}
                  </Typography>
                </StepContent>
              </Step>
            ))}
          </Stepper>

          {/* メール確認の詳細 */}
          <Box sx={{ bgcolor: 'grey.50', p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              📧 メール確認のお願い
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>{email}</strong> に認証メールを送信しました。
            </Typography>
            <Typography variant="body2" paragraph>
              メールに記載されている認証リンクをクリックしてアカウントを有効化してください。
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ※ メールが見つからない場合は、迷惑メールフォルダもご確認ください。
            </Typography>
          </Box>

          {/* 再送信ボタン */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Button
              variant="outlined"
              onClick={handleResendEmail}
              disabled={resendLoading || !canResend}
              startIcon={resendLoading ? <CircularProgress size={20} /> : <RefreshIcon />}
              sx={{ mb: 2 }}
            >
              {resendLoading
                ? '再送信中...'
                : !canResend
                  ? `再送信可能まで ${formatTime(resendCooldown)}`
                  : '認証メールを再送信'}
            </Button>

            {resendCount > 0 && (
              <Typography variant="body2" color="text.secondary">
                {resendCount}回再送信済み
              </Typography>
            )}
          </Box>

          {/* 注意事項 */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>メールが届かない場合：</strong>
              <br />
              • 迷惑メールフォルダを確認してください
              <br />
              • 数分かかる場合があります
              <br />• メールアドレスの入力間違いがないか確認してください
            </Typography>
          </Alert>

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
