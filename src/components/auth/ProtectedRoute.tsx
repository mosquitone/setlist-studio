'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, CircularProgress, Typography, Alert } from '@mui/material';
import { useAuth } from '@/components/providers/AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  loadingMessage?: string;
  requireAuth?: boolean; // 認証が絶対必要かどうか
}

export function ProtectedRoute({
  children,
  redirectTo = '/login',
  loadingMessage = 'ログイン状態を確認中...',
  requireAuth = true,
}: ProtectedRouteProps) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn && requireAuth) {
      router.push(redirectTo);
    }
  }, [isLoggedIn, isLoading, router, redirectTo, requireAuth]);

  // ローディング中の表示
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>{loadingMessage}</Typography>
      </Container>
    );
  }

  // 認証が必要だが未ログインの場合
  if (requireAuth && !isLoggedIn) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>ログイン画面に移動中...</Typography>
      </Container>
    );
  }

  // 子コンポーネントをレンダリング（認証状態に関係なく）
  return <>{children}</>;
}

// セットリスト専用のプロテクトコンポーネント
interface SetlistProtectedRouteProps {
  children: React.ReactNode;
  setlistData?: { isPublic?: boolean } | null;
  isLoading?: boolean;
  error?: Error | string;
}

export function SetlistProtectedRoute({
  children,
  setlistData,
  isLoading = false,
  error,
}: SetlistProtectedRouteProps) {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // 全てのuseEffectを最初に配置
  useEffect(() => {
    // エラーチェック関数をuseEffect内に移動
    const getAuthErrorMessage = (error: Error | string | undefined) => {
      if (!error) return null;

      // 文字列エラーの場合
      if (typeof error === 'string') {
        return error.includes('Authentication required') ? error : null;
      }

      // Error オブジェクトの場合
      if (typeof error === 'object' && error.message) {
        if (error.message === 'Authentication required to access private setlist') {
          return error.message;
        }
      }

      // GraphQLエラーの配列をチェック（Apollo Error の場合）
      if (
        typeof error === 'object' &&
        'graphQLErrors' in error &&
        Array.isArray((error as any).graphQLErrors)
      ) {
        for (const gqlError of (error as any).graphQLErrors) {
          if (gqlError.message === 'Authentication required to access private setlist') {
            return gqlError.message;
          }
        }
      }

      return null;
    };

    const authErrorMessage = getAuthErrorMessage(error);
    if (authErrorMessage) {
      router.push('/login');
    }
  }, [error, router]);

  useEffect(() => {
    if (!authLoading && setlistData && !setlistData.isPublic && !isLoggedIn) {
      router.push('/login');
    }
  }, [authLoading, setlistData, isLoggedIn, router]);

  // データローディング中
  if (isLoading || authLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>セットリストを読み込み中...</Typography>
      </Container>
    );
  }

  // 認証エラーの場合
  if (
    error &&
    typeof error === 'object' &&
    'graphQLErrors' in error &&
    Array.isArray((error as any).graphQLErrors)
  ) {
    const authError = (error as any).graphQLErrors.find(
      (e: any) => e.message === 'Authentication required to access private setlist',
    );
    if (authError) {
      return (
        <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>ログイン画面に移動中...</Typography>
        </Container>
      );
    }
  }

  // セットリストが見つからない場合
  if (error || !setlistData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">セットリストが見つかりません。</Alert>
      </Container>
    );
  }

  // プライベートセットリストで未ログインの場合
  if (!setlistData.isPublic && !isLoggedIn) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>ログイン画面に移動中...</Typography>
      </Container>
    );
  }

  // 公開セットリストまたはログイン済みの場合は表示
  return <>{children}</>;
}
