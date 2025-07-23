'use client';

import { useMutation, useQuery, gql } from '@apollo/client';
import {
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
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
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Button } from '@/components/common/ui/Button';
import { useSnackbar } from '@/components/providers/SnackbarProvider';
import { useI18n } from '@/hooks/useI18n';
import type {
  CheckEmailVerificationStatusData,
  ResendVerificationEmailData,
} from '@/types/graphql';

const RESEND_VERIFICATION_EMAIL = gql`
  mutation ResendVerificationEmail($email: String!) {
    resendVerificationEmail(email: $email) {
      success
      message
    }
  }
`;

const CHECK_EMAIL_VERIFICATION_STATUS = gql`
  query CheckEmailVerificationStatus($email: String!) {
    checkEmailVerificationStatus(email: $email) {
      isVerified
      canLogin
    }
  }
`;

export default function CheckEmailClient() {
  const { messages } = useI18n();
  const { showError, showSuccess } = useSnackbar();
  const [email, setEmail] = useState('');
  const [canResend, setCanResend] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const searchParams = useSearchParams();

  // 認証状態をポーリングでチェック
  useQuery(CHECK_EMAIL_VERIFICATION_STATUS, {
    variables: { email },
    skip: !email, // emailが設定されるまでスキップ
    pollInterval: 5000, // 5秒ごとにポーリング
    onCompleted: (data: CheckEmailVerificationStatusData) => {
      if (data?.checkEmailVerificationStatus?.isVerified) {
        setIsVerified(true);
      }
    },
  });

  const [resendVerificationEmail, { loading: resendLoading }] = useMutation(
    RESEND_VERIFICATION_EMAIL,
    {
      onCompleted: (data: ResendVerificationEmailData) => {
        if (data.resendVerificationEmail.success) {
          showSuccess(data.resendVerificationEmail.message);
          setResendCount((prev) => prev + 1);

          // 再送信後のクールダウン設定
          const cooldownTime = Math.min(60 * Math.pow(2, resendCount), 300); // 最大5分
          setResendCooldown(cooldownTime);
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
      label: messages.auth.accountCreated,
      content: messages.auth.accountCreatedDescription,
      completed: true,
    },
    {
      label: messages.auth.emailVerificationPending,
      content: `${email} ${messages.auth.emailVerificationPendingDescription}`,
      completed: isVerified,
    },
    {
      label: messages.auth.loginAvailable,
      content: messages.auth.loginAvailableDescription,
      completed: isVerified,
    },
  ];

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <EmailIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              {messages.auth.emailVerificationTitle}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {messages.auth.emailVerificationDescription}
            </Typography>
          </Box>

          {isVerified && (
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ mb: 2 }}>
                🎉 メール認証が完了しました！ログインできるようになりました。
              </Typography>
              <Button
                component={Link}
                href="/login"
                variant="contained"
                color="primary"
                size="small"
              >
                ログインページへ
              </Button>
            </Box>
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
              {messages.auth.emailConfirmationRequest}
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>{email}</strong> {messages.auth.verificationEmailSent}
            </Typography>
            <Typography variant="body2" paragraph>
              {messages.auth.clickVerificationLink}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {messages.auth.emailNotInSpam}
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
                ? messages.common.loading
                : !canResend
                  ? `${messages.auth.resendAvailable} ${formatTime(resendCooldown)}`
                  : messages.auth.resendVerificationEmail}
            </Button>

            {resendCount > 0 && (
              <Typography variant="body2" color="text.secondary">
                {resendCount} {messages.auth.resendCount2}
              </Typography>
            )}
          </Box>

          {/* 注意事項 */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>{messages.auth.emailNotReceived}</strong>
              <br />• {messages.auth.checkSpamFolder2}
              <br />• {messages.auth.mayTakeMinutes2}
              <br />• {messages.auth.checkEmailTypo}
            </Typography>
          </Alert>

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
