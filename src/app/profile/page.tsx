'use client';

import { useMutation, gql } from '@apollo/client';
import {
  CalendarToday as CalendarTodayIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import GoogleColorIcon from '@/components/common/icons/GoogleColorIcon';
import { Button } from '@/components/common/ui/Button';
import { useAuth } from '@/components/providers/AuthProvider';
import { useI18n } from '@/hooks/useI18n';
import { apolloClient } from '@/lib/client/apollo-client';
import { PASSWORD_POLICY } from '@/lib/constants/auth';
import { formatDate } from '@/lib/i18n/date-format';
import { UPDATE_USER_MUTATION, GET_ME_QUERY } from '@/lib/server/graphql/apollo-operations';

const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      success
      message
    }
  }
`;

const CHANGE_EMAIL_MUTATION = gql`
  mutation RequestEmailChange($input: EmailChangeInput!) {
    requestEmailChange(input: $input) {
      success
      message
    }
  }
`;

function ProfileContent() {
  const { user, refreshUser } = useAuth();
  const { messages, lang } = useI18n();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // パスワード変更用の状態
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // メールアドレス変更用の状態
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailChangePassword, setEmailChangePassword] = useState('');
  const [showEmailChangePassword, setShowEmailChangePassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  // Google認証ユーザー用パスワード設定
  const [newPasswordForEmailAuth, setNewPasswordForEmailAuth] = useState('');
  const [confirmNewPasswordForEmailAuth, setConfirmNewPasswordForEmailAuth] = useState('');
  const [showNewPasswordForEmailAuth, setShowNewPasswordForEmailAuth] = useState(false);
  const [showConfirmNewPasswordForEmailAuth, setShowConfirmNewPasswordForEmailAuth] =
    useState(false);

  const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: (data) => {
      try {
        // Apollo Clientのキャッシュを更新
        // secureAuthClientは自動的にGET_ME_QUERYの変更を検知する
        apolloClient.writeQuery({
          query: GET_ME_QUERY,
          data: {
            me: data.updateUser,
          },
        });

        setSuccess(messages.notifications.profileUpdated);
        setIsEditing(false);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to update cache:', error);
        }
        setError(messages.errors.somethingWentWrong);
      }
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const [changePassword, { loading: changePasswordLoading }] = useMutation(
    CHANGE_PASSWORD_MUTATION,
    {
      onCompleted: (data) => {
        if (data.changePassword.success) {
          setPasswordSuccess(data.changePassword.message);
          setPasswordError('');
          setIsChangingPassword(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        }
      },
      onError: (error) => {
        setPasswordError(error.message);
        setPasswordSuccess('');
      },
    },
  );

  const [requestEmailChange, { loading: emailChangeLoading }] = useMutation(CHANGE_EMAIL_MUTATION, {
    onCompleted: async (data) => {
      if (data.requestEmailChange.success) {
        setEmailSuccess(data.requestEmailChange.message);
        setEmailError('');
        setIsChangingEmail(false);
        setNewEmail('');
        setEmailChangePassword('');
        setNewPasswordForEmailAuth('');
        setConfirmNewPasswordForEmailAuth('');

        // 通常のメール変更は確認が必要なため、ここではrefreshしない
        // 確認後に自動的にuseAuthが更新される
      }
    },
    onError: (error) => {
      setEmailError(error.message);
      setEmailSuccess('');
    },
  });

  const [googleEmailChangeLoading, setGoogleEmailChangeLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    setError('');
    if (!username.trim()) {
      setError(messages.validation.required);
      return;
    }

    await updateUser({
      variables: {
        username: username.trim(),
      },
    });
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    // バリデーション
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(messages.validation.required);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(messages.validation.passwordsDoNotMatch);
      return;
    }

    if (newPassword.length < PASSWORD_POLICY.MIN_LENGTH) {
      setPasswordError(messages.validation.passwordTooShort);
      return;
    }

    if (!PASSWORD_POLICY.REGEX.test(newPassword)) {
      setPasswordError(messages.validation.passwordTooShort);
      return;
    }

    await changePassword({
      variables: {
        input: {
          currentPassword,
          newPassword,
        },
      },
    });
  };

  const resetPasswordForm = () => {
    setIsChangingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handleChangeEmail = async () => {
    setEmailError('');
    setEmailSuccess('');

    // バリデーション
    if (!newEmail) {
      setEmailError(messages.validation.required);
      return;
    }

    // メールアドレス形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setEmailError(messages.auth.invalidEmailFormat);
      return;
    }

    // Google認証ユーザーの場合はパスワード設定が必要
    if (currentUser?.authProvider === 'google') {
      if (!newPasswordForEmailAuth || !confirmNewPasswordForEmailAuth) {
        setEmailError(messages.validation.required);
        return;
      }

      if (newPasswordForEmailAuth !== confirmNewPasswordForEmailAuth) {
        setEmailError(messages.validation.passwordsDoNotMatch);
        return;
      }

      if (newPasswordForEmailAuth.length < PASSWORD_POLICY.MIN_LENGTH) {
        setEmailError(messages.validation.passwordTooShort);
        return;
      }

      if (!PASSWORD_POLICY.REGEX.test(newPasswordForEmailAuth)) {
        setEmailError(messages.validation.passwordTooShort);
        return;
      }
    } else {
      // メール認証ユーザーの場合は現在のパスワードが必要
      if (!emailChangePassword) {
        setEmailError(messages.validation.required);
        return;
      }
    }

    const inputData: {
      newEmail: string;
      currentPassword?: string;
      newPassword?: string;
    } = {
      newEmail: newEmail.trim(),
    };

    if (currentUser?.authProvider === 'google') {
      // Google認証ユーザーは新しいパスワードを設定
      inputData.newPassword = newPasswordForEmailAuth;
    } else {
      // メール認証ユーザーは現在のパスワードを確認
      inputData.currentPassword = emailChangePassword;
    }

    await requestEmailChange({
      variables: {
        input: inputData,
      },
    });
  };

  const resetEmailForm = () => {
    setIsChangingEmail(false);
    setNewEmail('');
    setEmailChangePassword('');
    setEmailError('');
    setEmailSuccess('');
    // Google認証ユーザー用パスワードフィールドもリセット
    setNewPasswordForEmailAuth('');
    setConfirmNewPasswordForEmailAuth('');
  };

  const handleGoogleEmailChange = async () => {
    setEmailError('');
    setEmailSuccess('');
    setGoogleEmailChangeLoading(true);

    try {
      // パスワード設定の場合のバリデーション（オプション）
      if (newPasswordForEmailAuth || confirmNewPasswordForEmailAuth) {
        if (!newPasswordForEmailAuth || !confirmNewPasswordForEmailAuth) {
          setEmailError(messages.validation.required);
          return;
        }

        if (newPasswordForEmailAuth !== confirmNewPasswordForEmailAuth) {
          setEmailError(messages.validation.passwordsDoNotMatch);
          return;
        }

        if (newPasswordForEmailAuth.length < PASSWORD_POLICY.MIN_LENGTH) {
          setEmailError(messages.validation.passwordTooShort);
          return;
        }

        if (!PASSWORD_POLICY.REGEX.test(newPasswordForEmailAuth)) {
          setEmailError(messages.validation.passwordTooShort);
          return;
        }
      }

      // 現在のユーザーIDを保存（セッション切り替え前に）
      const currentUserId = currentUser?.id;
      if (!currentUserId) {
        setEmailError('ユーザー情報が見つかりません。');
        return;
      }

      // NextAuthのGoogle認証を使用（アカウント選択を強制）
      const result = await signIn('google', {
        redirect: false,
        callbackUrl: '/profile',
        // Googleのアカウント選択画面を強制表示
        // 新しいアカウント作成へのリンクも含まれる
        // 参考: https://developers.google.com/identity/protocols/oauth2/web-server#creatingclient
      });

      if (result?.error) {
        setEmailError('Google認証でエラーが発生しました。再度お試しください。');
        return;
      }

      if (result?.ok) {
        // 認証成功後、Googleアカウント切り替えAPIを呼び出し
        const response = await fetch('/api/auth/google-account-switch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentUserId, // 元のユーザーIDを送信
            transferData: true, // データ移行フラグ
            newPassword: newPasswordForEmailAuth || undefined,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setEmailSuccess(data.message);
          setEmailError('');
          setIsChangingEmail(false);
          setNewEmail('');
          setEmailChangePassword('');
          setNewPasswordForEmailAuth('');
          setConfirmNewPasswordForEmailAuth('');

          // ユーザー情報を再取得して表示を更新
          await refreshUser();
        } else {
          setEmailError(data.message);
        }
      }
    } catch {
      setEmailError('Google認証でエラーが発生しました。再度お試しください。');
    } finally {
      setGoogleEmailChangeLoading(false);
    }
  };

  // ユーザー情報が取得できない場合の表示
  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="error" gutterBottom>
              {messages.errors.somethingWentWrong}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {messages.errors.somethingWentWrong}
            </Typography>
            <Button sx={{ mt: 2 }} onClick={() => window.location.reload()}>
              {messages.common.back}
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  const currentUser = user;

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              fontSize: 32,
              mr: 3,
            }}
          >
            {(currentUser?.username || currentUser?.email || '?').charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" gutterBottom>
              {messages.auth.profile}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {messages.pages.profile.description}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {passwordSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {passwordSuccess}
          </Alert>
        )}

        {emailSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {emailSuccess}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PersonIcon sx={{ mr: 2, color: 'text.secondary' }} />
            {isEditing ? (
              <Box sx={{ flexGrow: 1 }}>
                <TextField
                  fullWidth
                  name="username"
                  label={messages.auth.username}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  size="small"
                  inputProps={{
                    autoComplete: 'username',
                  }}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setIsEditing(false);
                      setUsername(user?.username || '');
                      setError('');
                    }}
                    disabled={updateLoading}
                    size="small"
                    sx={{
                      minWidth: { xs: 'auto', sm: 64 },
                      px: { xs: 1.5, sm: 2 },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    {messages.common.cancel}
                  </Button>
                  <Button
                    onClick={handleUpdateProfile}
                    disabled={updateLoading}
                    size="small"
                    sx={{
                      minWidth: { xs: 'auto', sm: 64 },
                      px: { xs: 1.5, sm: 2 },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    {updateLoading ? messages.common.loading : messages.common.save}
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {messages.auth.username}
                  </Typography>
                  <Typography variant="body1">
                    {currentUser?.username || messages.auth.noData}
                  </Typography>
                </Box>
                <Button
                  onClick={() => setIsEditing(true)}
                  size="small"
                  variant="outlined"
                  sx={{
                    minWidth: { xs: 'auto', sm: 64 },
                    px: { xs: 1.5, sm: 2 },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  {messages.common.edit}
                </Button>
              </Box>
            )}
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <EmailIcon sx={{ mr: 2, color: 'text.secondary', mt: 0.5 }} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {isChangingEmail ? messages.auth.currentEmail : messages.auth.email}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mb: isChangingEmail ? 1 : 0, wordBreak: 'break-all' }}
                >
                  {currentUser?.email}
                </Typography>
                {!isChangingEmail && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setIsChangingEmail(true)}
                    sx={{
                      mt: 1,
                      whiteSpace: 'nowrap',
                      minWidth: { xs: 'auto', sm: 64 },
                      px: { xs: 1.5, sm: 2 },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    {messages.auth.changeEmail}
                  </Button>
                )}
                {isChangingEmail && (
                  <Box sx={{ mt: 2 }}>
                    {currentUser?.authProvider === 'google' && (
                      <Alert severity="info" sx={{ mb: 2 }}>
                        {messages.auth.googleUserEmailChangeNote}
                      </Alert>
                    )}
                    <TextField
                      fullWidth
                      label={messages.auth.newEmail}
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    {currentUser?.authProvider !== 'google' && (
                      <TextField
                        fullWidth
                        label={messages.auth.currentPassword}
                        type={showEmailChangePassword ? 'text' : 'password'}
                        value={emailChangePassword}
                        onChange={(e) => setEmailChangePassword(e.target.value)}
                        size="small"
                        sx={{ mb: 1 }}
                        helperText={messages.auth.emailChangeConfirmation}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowEmailChangePassword(!showEmailChangePassword)}
                                edge="end"
                              >
                                {showEmailChangePassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                    {currentUser?.authProvider === 'google' && (
                      <>
                        <TextField
                          fullWidth
                          label={messages.auth.setNewPassword}
                          type={showNewPasswordForEmailAuth ? 'text' : 'password'}
                          value={newPasswordForEmailAuth}
                          onChange={(e) => setNewPasswordForEmailAuth(e.target.value)}
                          size="small"
                          sx={{ mb: 1 }}
                          helperText={messages.auth.setNewPasswordHelper}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() =>
                                    setShowNewPasswordForEmailAuth(!showNewPasswordForEmailAuth)
                                  }
                                  edge="end"
                                >
                                  {showNewPasswordForEmailAuth ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        <TextField
                          fullWidth
                          label={messages.auth.confirmPassword}
                          type={showConfirmNewPasswordForEmailAuth ? 'text' : 'password'}
                          value={confirmNewPasswordForEmailAuth}
                          onChange={(e) => setConfirmNewPasswordForEmailAuth(e.target.value)}
                          size="small"
                          sx={{ mb: 1 }}
                          helperText={messages.auth.confirmPasswordHelper}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() =>
                                    setShowConfirmNewPasswordForEmailAuth(
                                      !showConfirmNewPasswordForEmailAuth,
                                    )
                                  }
                                  edge="end"
                                >
                                  {showConfirmNewPasswordForEmailAuth ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </>
                    )}
                    {emailError && (
                      <Alert severity="error" sx={{ mb: 1 }}>
                        {emailError}
                      </Alert>
                    )}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={resetEmailForm}
                        disabled={emailChangeLoading || googleEmailChangeLoading}
                        sx={{
                          minWidth: { xs: 'auto', sm: 64 },
                          px: { xs: 1.5, sm: 2 },
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        }}
                      >
                        {messages.common.cancel}
                      </Button>
                      <Button
                        size="small"
                        onClick={handleChangeEmail}
                        disabled={emailChangeLoading || googleEmailChangeLoading}
                        sx={{
                          minWidth: { xs: 'auto', sm: 64 },
                          px: { xs: 1.5, sm: 2 },
                          fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        }}
                      >
                        {emailChangeLoading ? messages.common.loading : messages.auth.changeEmail}
                      </Button>
                    </Box>

                    {/* または ディバイダー */}
                    <Box sx={{ my: 2, display: 'flex', alignItems: 'center' }}>
                      <Divider sx={{ flexGrow: 1, borderTopWidth: 2 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ mx: 2 }}>
                        {messages.common.or}
                      </Typography>
                      <Divider sx={{ flexGrow: 1, borderTopWidth: 2 }} />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Alert severity="info" sx={{ mb: 2 }}>
                        {messages.auth.googleChangeEmailDescription}
                      </Alert>
                      <Button
                        variant="outlined"
                        size="large"
                        fullWidth
                        startIcon={<GoogleColorIcon />}
                        onClick={handleGoogleEmailChange}
                        disabled={emailChangeLoading || googleEmailChangeLoading}
                      >
                        {googleEmailChangeLoading
                          ? messages.common.loading
                          : messages.auth.googleChangeEmail}
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SecurityIcon sx={{ mr: 2, color: 'text.secondary' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                {messages.auth.authProvider}
              </Typography>
              <Typography variant="body1">
                {currentUser?.authProvider === 'google'
                  ? messages.auth.authProviderGoogle
                  : messages.auth.authProviderEmail}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarTodayIcon sx={{ mr: 2, color: 'text.secondary' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                {messages.auth.createdAt}
              </Typography>
              <Typography variant="body1">
                {currentUser?.createdAt
                  ? formatDate(currentUser.createdAt, 'short', lang)
                  : messages.auth.noData}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* パスワード変更セクション - Google認証ユーザーは非表示 */}
        {currentUser?.authProvider !== 'google' && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LockIcon sx={{ mr: 2, color: 'text.secondary' }} />
              <Typography variant="h6">{messages.auth.changePassword}</Typography>
            </Box>

            {passwordError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {passwordError}
              </Alert>
            )}

            {isChangingPassword ? (
              <Box sx={{ mb: 2 }}>
                {/* Hidden field for browser password manager */}
                <input
                  type="hidden"
                  name="email"
                  value={currentUser?.email || ''}
                  autoComplete="email"
                />
                <TextField
                  fullWidth
                  name="current-password"
                  label={messages.auth.currentPassword}
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  size="small"
                  sx={{ mb: 2 }}
                  inputProps={{
                    autoComplete: 'current-password',
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          edge="end"
                        >
                          {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  name="new-password"
                  label={messages.auth.newPassword}
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  size="small"
                  sx={{ mb: 2 }}
                  helperText={messages.auth.passwordRequirements}
                  inputProps={{
                    autoComplete: 'new-password',
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  name="confirm-password"
                  label={messages.auth.confirmPassword}
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  size="small"
                  sx={{ mb: 2 }}
                  helperText={messages.auth.confirmPasswordHelper}
                  inputProps={{
                    autoComplete: 'new-password',
                  }}
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
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={resetPasswordForm}
                    disabled={changePasswordLoading}
                    sx={{
                      minWidth: { xs: 'auto', sm: 64 },
                      px: { xs: 1.5, sm: 2 },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    {messages.common.cancel}
                  </Button>
                  <Button
                    onClick={handleChangePassword}
                    disabled={changePasswordLoading}
                    sx={{
                      minWidth: { xs: 'auto', sm: 64 },
                      px: { xs: 1.5, sm: 2 },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    {changePasswordLoading ? messages.common.loading : messages.auth.changePassword}
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
                <Button
                  variant="outlined"
                  onClick={() => setIsChangingPassword(true)}
                  startIcon={<LockIcon />}
                  sx={{
                    minWidth: { xs: 'auto', sm: 64 },
                    px: { xs: 1.5, sm: 2 },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  {messages.auth.changePassword}
                </Button>
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            {messages.auth.accountId}: {currentUser?.id}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
