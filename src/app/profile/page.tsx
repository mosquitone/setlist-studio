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

const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      success
      message
    }
  }
`;

function ProfileContent() {
  const { user } = useAuth();
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

        setSuccess('プロフィールを更新しました');
        setIsEditing(false);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to update cache:', error);
        }
        setError('キャッシュの更新に失敗しました');
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

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    setError('');
    if (!username.trim()) {
      setError('ユーザー名を入力してください');
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
      setPasswordError('すべてのフィールドを入力してください');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('新しいパスワードが一致しません');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('パスワードは8文字以上である必要があります');
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(newPassword)) {
      setPasswordError('パスワードは8文字以上で、大文字・小文字・数字を含む必要があります');
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

  // ユーザー情報が取得できない場合の表示
  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" color="error" gutterBottom>
              プロフィール情報を取得できませんでした
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ページを再読み込みするか、再度ログインしてください。
            </Typography>
            <Button sx={{ mt: 2 }} onClick={() => window.location.reload()}>
              ページを再読み込み
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
              プロフィール
            </Typography>
            <Typography variant="body2" color="text.secondary">
              アカウント情報の確認と編集
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

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PersonIcon sx={{ mr: 2, color: 'text.secondary' }} />
            {isEditing ? (
              <TextField
                fullWidth
                label="ユーザー名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                size="small"
              />
            ) : (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  ユーザー名
                </Typography>
                <Typography variant="body1">{currentUser?.username || '未設定'}</Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EmailIcon sx={{ mr: 2, color: 'text.secondary' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                メールアドレス
              </Typography>
              <Typography variant="body1">{currentUser?.email}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarTodayIcon sx={{ mr: 2, color: 'text.secondary' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                アカウント作成日
              </Typography>
              <Typography variant="body1">
                {currentUser?.createdAt
                  ? format(new Date(currentUser.createdAt), 'yyyy年MM月dd日', { locale: ja })
                  : '不明'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* パスワード変更セクション */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LockIcon sx={{ mr: 2, color: 'text.secondary' }} />
            <Typography variant="h6">パスワード変更</Typography>
          </Box>

          {passwordError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {passwordError}
            </Alert>
          )}

          {isChangingPassword ? (
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="現在のパスワード"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                size="small"
                sx={{ mb: 2 }}
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
                label="新しいパスワード"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                size="small"
                sx={{ mb: 2 }}
                helperText="8文字以上で、大文字・小文字・数字を含む必要があります"
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
                label="新しいパスワード（確認）"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                size="small"
                sx={{ mb: 2 }}
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
                  キャンセル
                </Button>
                <Button onClick={handleChangePassword} disabled={changePasswordLoading}>
                  {changePasswordLoading ? '変更中...' : 'パスワードを変更'}
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
                パスワードを変更
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
                キャンセル
              </Button>
              <Button onClick={handleUpdateProfile} disabled={updateLoading}>
                {updateLoading ? '更新中...' : '保存'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} sx={{ borderRadius: 10 }}>
              プロフィールを編集
            </Button>
          )}
        </Box>

        <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            アカウントID: {currentUser?.id}
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
