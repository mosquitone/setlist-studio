'use client';

import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button } from '@/components/common/ui/Button';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useAuth } from '@/components/providers/AuthProvider';
import { useMutation } from '@apollo/client';
import { UPDATE_USER_MUTATION, GET_ME_QUERY } from '@/lib/server/graphql/apollo-operations';
import { gql } from '@apollo/client';
import { apolloClient } from '@/lib/client/apollo-client';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useI18n } from '@/hooks/useI18n';

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
  const { user } = useAuth();
  const { messages } = useI18n();
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
    onCompleted: (data) => {
      if (data.requestEmailChange.success) {
        setEmailSuccess(data.requestEmailChange.message);
        setEmailError('');
        setIsChangingEmail(false);
        setNewEmail('');
        setEmailChangePassword('');
      }
    },
    onError: (error) => {
      setEmailError(error.message);
      setEmailSuccess('');
    },
  });

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

    if (newPassword.length < 8) {
      setPasswordError(messages.validation.passwordTooShort);
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(newPassword)) {
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
    if (!newEmail || !emailChangePassword) {
      setEmailError(messages.validation.required);
      return;
    }

    // メールアドレス形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setEmailError(messages.auth.invalidEmailFormat);
      return;
    }

    await requestEmailChange({
      variables: {
        input: {
          newEmail: newEmail.trim(),
          currentPassword: emailChangePassword,
        },
      },
    });
  };

  const resetEmailForm = () => {
    setIsChangingEmail(false);
    setNewEmail('');
    setEmailChangePassword('');
    setEmailError('');
    setEmailSuccess('');
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
              />
            ) : (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {messages.auth.username}
                </Typography>
                <Typography variant="body1">
                  {currentUser?.username || messages.auth.noData}
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EmailIcon sx={{ mr: 2, color: 'text.secondary' }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {isChangingEmail ? messages.auth.currentEmail : messages.auth.email}
              </Typography>
              <Typography variant="body1" sx={{ mb: isChangingEmail ? 1 : 0 }}>
                {currentUser?.email}
              </Typography>
              {isChangingEmail && (
                <Box>
                  <TextField
                    fullWidth
                    label={messages.auth.newEmail}
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    size="small"
                    sx={{ mb: 1 }}
                  />
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
                  {emailError && (
                    <Alert severity="error" sx={{ mb: 1 }}>
                      {emailError}
                    </Alert>
                  )}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={resetEmailForm}
                      disabled={emailChangeLoading}
                    >
                      {messages.common.cancel}
                    </Button>
                    <Button size="small" onClick={handleChangeEmail} disabled={emailChangeLoading}>
                      {emailChangeLoading ? messages.common.loading : messages.auth.changeEmail}
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
            {!isChangingEmail && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => setIsChangingEmail(true)}
                sx={{ ml: 2, whiteSpace: 'nowrap' }}
              >
                {messages.auth.changeEmail}
              </Button>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarTodayIcon sx={{ mr: 2, color: 'text.secondary' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                {messages.auth.createdAt}
              </Typography>
              <Typography variant="body1">
                {currentUser?.createdAt
                  ? format(new Date(currentUser.createdAt), 'yyyy年MM月dd日', { locale: ja })
                  : messages.auth.noData}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* パスワード変更セクション */}
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
                >
                  {messages.common.cancel}
                </Button>
                <Button onClick={handleChangePassword} disabled={changePasswordLoading}>
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
              >
                {messages.auth.changePassword}
              </Button>
            </Box>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {isEditing ? (
            <>
              <Button
                variant="outlined"
                onClick={() => {
                  setIsEditing(false);
                  setUsername(user?.username || '');
                  setError('');
                }}
                disabled={updateLoading}
              >
                {messages.common.cancel}
              </Button>
              <Button onClick={handleUpdateProfile} disabled={updateLoading}>
                {updateLoading ? messages.common.loading : messages.common.save}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} sx={{ borderRadius: 10 }}>
              {messages.common.edit}
            </Button>
          )}
        </Box>

        <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
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
