'use client';

import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import { useAuth } from '@/components/providers/AuthProvider';
import { useI18n } from '@/hooks/useI18n';

interface UserMenuProps {
  onAuthClick: () => void;
}

export function UserMenu({ onAuthClick }: UserMenuProps) {
  const { user } = useAuth();
  const { messages } = useI18n();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  if (!user) return null;

  return (
    <>
      <Box
        id="user-menu-button"
        onClick={handleUserMenuOpen}
        role="button"
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={Boolean(anchorEl)}
        aria-controls={Boolean(anchorEl) ? 'user-menu' : undefined}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            handleUserMenuOpen(event as any);
          }
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: 1,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
          '&:focus': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            outline: '2px solid rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
          {(user.username || user.email || '?').charAt(0).toUpperCase()}
        </Avatar>
        <Typography
          variant="body2"
          sx={{
            color: 'white',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          {user.username || user.email}
        </Typography>
      </Box>
      <Menu
        id="user-menu"
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
        MenuListProps={{
          'aria-labelledby': 'user-menu-button',
          role: 'menu',
        }}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              mt: 1,
              '& .MuiMenuItem-root': {
                minHeight: 36,
              },
            },
          },
        }}
      >
        <MenuItem
          onClick={handleUserMenuClose}
          role="menuitem"
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <PersonIcon fontSize="small" />
          <Link href="/profile" underline="none" color="inherit">
            {messages.navigation.profile}
          </Link>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handleUserMenuClose();
            onAuthClick();
          }}
          role="menuitem"
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <LogoutIcon fontSize="small" />
          {messages.navigation.logout}
        </MenuItem>
      </Menu>
    </>
  );
}
