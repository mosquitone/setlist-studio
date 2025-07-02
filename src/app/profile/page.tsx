'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { useAuth } from '@/components/providers/AuthProvider'
import { useMutation, useQuery } from '@apollo/client'
import { GET_ME_QUERY, UPDATE_USER_MUTATION } from '@/lib/server/graphql/apollo-operations'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export default function ProfilePage() {
  const { isLoggedIn, isLoading: authLoading, user } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { data, loading: queryLoading, refetch } = useQuery(GET_ME_QUERY, {
    skip: !isLoggedIn,
  })

  const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: () => {
      setSuccess('プロフィールを更新しました')
      setIsEditing(false)
      refetch()
      setTimeout(() => setSuccess(''), 3000)
    },
    onError: (error) => {
      setError(error.message)
    },
  })

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/login')
    }
  }, [isLoggedIn, authLoading, router])

  useEffect(() => {
    if (data?.me) {
      setUsername(data.me.username || '')
    }
  }, [data])

  const handleUpdateProfile = async () => {
    setError('')
    if (!username.trim()) {
      setError('ユーザー名を入力してください')
      return
    }

    try {
      await updateUser({
        variables: {
          username: username.trim(),
        },
      })
    } catch (err) {
      // Error handled in onError
    }
  }

  if (authLoading || queryLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  const currentUser = data?.me || user

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
                autoFocus
              />
            ) : (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  ユーザー名
                </Typography>
                <Typography variant="body1">
                  {currentUser?.username || '未設定'}
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <EmailIcon sx={{ mr: 2, color: 'text.secondary' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                メールアドレス
              </Typography>
              <Typography variant="body1">
                {currentUser?.email}
              </Typography>
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

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {isEditing ? (
            <>
              <Button
                variant="outlined"
                onClick={() => {
                  setIsEditing(false)
                  setUsername(data?.me?.username || '')
                  setError('')
                }}
                disabled={updateLoading}
              >
                キャンセル
              </Button>
              <Button
                variant="contained"
                onClick={handleUpdateProfile}
                disabled={updateLoading}
              >
                {updateLoading ? '更新中...' : '保存'}
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              onClick={() => setIsEditing(true)}
              sx={{ borderRadius: 10 }}
            >
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
  )
}