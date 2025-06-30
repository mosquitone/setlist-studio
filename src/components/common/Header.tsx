'use client'

import { useRouter } from 'next/navigation'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from 'next/link'
import { useAuth } from '../../hooks/useAuth'

export default function Header() {
  const { isLoggedIn, isLoading, logout } = useAuth()
  const router = useRouter()

  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout()
    } else {
      router.push('/login')
    }
  }

  return (
    <AppBar position="static" sx={{ borderRadius: 0 }}>
      <Toolbar>
        <Link href="/" passHref>
          <Box
            component="img"
            src="/MQT_LOGO_BLACK.png"
            alt="Logo"
            sx={{ height: 40, cursor: 'pointer' }}
          />
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="outlined"
          onClick={handleAuthClick}
          disabled={isLoading}
          sx={{
            borderRadius: 10,
            px: 4,
            py: 1.5,
            borderColor: 'white',
            color: 'white',
            fontSize: '16px',
            fontWeight: 500,
            textTransform: 'none',
            border: '2px solid white',
            ml: 1,
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.8)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
            '&:disabled': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
              color: 'rgba(255, 255, 255, 0.5)',
            },
          }}
        >
          {isLoading ? '読込中…' : isLoggedIn ? 'ログアウト' : 'ログイン'}
        </Button>
      </Toolbar>
    </AppBar>
  )
}
