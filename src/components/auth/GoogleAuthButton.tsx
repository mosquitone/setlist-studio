'use client';

import { useState } from 'react';
import { Button } from '@/components/common/ui/Button';
import GoogleColorIcon from '@/components/common/icons/GoogleColorIcon';
import { signIn } from 'next-auth/react';
import { useI18n } from '@/hooks/useI18n';

interface GoogleAuthButtonProps {
  onError?: (error: string) => void;
  disabled?: boolean;
  variant?: 'contained' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  sx?: object;
  mode?: 'signin' | 'signup'; // ログイン用か新規登録用かを指定
}

export default function GoogleAuthButton({
  onError,
  disabled = false,
  variant = 'outlined',
  size = 'large',
  fullWidth = true,
  sx,
  mode = 'signin',
}: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false);
  const { messages } = useI18n();

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);

      // NextAuthでGoogle認証（通常のリダイレクトフロー）
      // NextAuthの設定でリダイレクト先は/api/auth/google-syncに設定済み
      await signIn('google');
    } catch (error) {
      console.error('Google auth error:', error);
      const errorMessage = messages.auth.googleAuthError || 'Google認証でエラーが発生しました';
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      fullWidth={fullWidth}
      variant={variant}
      size={size}
      startIcon={<GoogleColorIcon />}
      onClick={handleGoogleAuth}
      disabled={disabled || loading}
      sx={sx}
    >
      {loading
        ? mode === 'signup'
          ? messages.auth.signingUp || 'アカウント作成中...'
          : messages.auth.signingIn || 'サインイン中...'
        : mode === 'signup'
          ? messages.auth.signUpWithGoogle || 'Googleでアカウント作成'
          : messages.auth.signInWithGoogle || 'Googleでログイン'}
    </Button>
  );
}
