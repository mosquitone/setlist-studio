'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu'
import Link from 'next/link'
import { useAuth } from '@/components/providers/AuthProvider'

const navigationItems = [
  { label: 'ホーム', path: '/' },
  { label: 'セットリスト', path: '/setlists' },
  { label: '曲', path: '/songs' },
]

export default function Header() {
  const { isLoggedIn, isLoading, logout, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout()
    } else {
      router.push('/login')
    }
  }

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setAnchorEl(null)
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Setlist Studio
      </Typography>
      <Divider />
      {isLoggedIn && (
        <>
          <List>
            {navigationItems.map(item => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.path}
                  selected={pathname === item.path}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    },
                  }}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </>
      )}
      {isLoggedIn && user && (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {user.username || user.email}
          </Typography>
        </Box>
      )}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={handleAuthClick}
          disabled={isLoading}
          sx={{
            borderRadius: 10,
            py: 1.5,
            textTransform: 'none',
          }}
        >
          {isLoading ? '読込中…' : isLoggedIn ? 'ログアウト' : 'ログイン'}
        </Button>
      </Box>
    </Box>
  )

  return (
    <>
      <AppBar position="sticky" sx={{ borderRadius: 0 }}>
        <Toolbar>
          {isLoggedIn && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Link href="/" passHref>
            <Box
              component="img"
              src="/MQT_LOGO_BLACK.png"
              alt="Logo"
              sx={{ height: 40, cursor: 'pointer' }}
            />
          </Link>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' }, ml: 4 }}>
            {isLoggedIn &&
              navigationItems.map(item => (
                <Button
                  key={item.path}
                  component={Link}
                  href={item.path}
                  sx={{
                    color: 'white',
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: pathname === item.path ? 700 : 500,
                    mx: 1,
                    borderBottom: pathname === item.path ? '2px solid white' : 'none',
                    borderRadius: 0,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', sm: 'none' } }} />

          {isLoggedIn && user ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'white',
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  {user.username || user.email}
                </Typography>
                <IconButton
                  onClick={handleUserMenuOpen}
                  sx={{
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                    {(user.username || user.email || '?').charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Box>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleUserMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleUserMenuClose()
                    router.push('/profile')
                  }}
                >
                  プロフィール
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => {
                    handleUserMenuClose()
                    handleAuthClick()
                  }}
                >
                  ログアウト
                </MenuItem>
              </Menu>
            </>
          ) : (
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
              {isLoading ? '読込中…' : 'ログイン'}
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  )
}
