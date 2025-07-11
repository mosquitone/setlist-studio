import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import { useAuth } from '@/components/providers/AuthProvider';

interface UserMenuProps {
  onAuthClick: () => void;
}

export function UserMenu({ onAuthClick }: UserMenuProps) {
  const { user } = useAuth();
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
        <MenuItem onClick={handleUserMenuClose}>
          <Link href="/profile" underline="none" color="inherit">
            プロフィール
          </Link>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handleUserMenuClose();
            onAuthClick();
          }}
        >
          ログアウト
        </MenuItem>
      </Menu>
    </>
  );
}
