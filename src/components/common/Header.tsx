'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useAuth } from '@/components/providers/AuthProvider';
import { HeaderLogo } from './header/HeaderLogo';
import { DesktopNavigation } from './header/DesktopNavigation';
import { MobileNavigation } from './header/MobileNavigation';
import { UserMenu } from './header/UserMenu';
import { AuthButton } from './header/AuthButton';
import { authenticatedNavigationItems, publicNavigationItems } from './header/navigationItems';

export default function Header() {
  const { isLoggedIn, isLoading, logout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // ログイン状態に応じて表示するナビゲーション項目を決定（共通化）
  const navigationItems = isLoggedIn
    ? [...publicNavigationItems, ...authenticatedNavigationItems]
    : publicNavigationItems;

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
            items={navigationItems}
            isLoading={isLoading}
            mobileOpen={mobileOpen}
            onToggle={handleDrawerToggle}
            onAuthClick={handleAuthClick}
          />

          <HeaderLogo />

          <DesktopNavigation items={navigationItems} isLoading={isLoading} />

          <Box sx={{ flexGrow: 1 }} />

          {isLoading ? (
            <Skeleton
              variant="rounded"
              width={80}
              height={36}
              sx={{ borderRadius: 5, bgcolor: 'rgba(255, 255, 255, 0.1)' }}
            />
          ) : isLoggedIn ? (
            <UserMenu onAuthClick={handleAuthClick} />
          ) : (
            <AuthButton onClick={handleAuthClick} />
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}
