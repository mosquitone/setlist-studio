'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { useAuth } from '@/components/providers/AuthProvider';
import { HeaderLogo } from './header/HeaderLogo';
import { DesktopNavigation } from './header/DesktopNavigation';
import { MobileNavigation } from './header/MobileNavigation';
import { UserMenu } from './header/UserMenu';
import { AuthButton } from './header/AuthButton';

export default function Header() {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout();
    } else {
      router.push('/login');
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <AppBar position="sticky" sx={{ borderRadius: 0 }}>
        <Toolbar>
          <MobileNavigation
            mobileOpen={mobileOpen}
            onToggle={handleDrawerToggle}
            onAuthClick={handleAuthClick}
          />

          <HeaderLogo />

          <DesktopNavigation />

          <Box sx={{ flexGrow: 1 }} />

          {isLoggedIn ? (
            <UserMenu onAuthClick={handleAuthClick} />
          ) : (
            <AuthButton onClick={handleAuthClick} />
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}
