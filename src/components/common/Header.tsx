'use client';

import { useState, useMemo } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useAuth } from '@/components/providers/AuthProvider';
import { HeaderLogo } from './header/HeaderLogo';
import { DesktopNavigation } from './header/DesktopNavigation';
import { MobileNavigation } from './header/MobileNavigation';
import { UserMenu } from './header/UserMenu';
import { LoginLink } from './LoginLink';
import { authenticatedNavigationItems, publicNavigationItems } from './header/navigationItems';

/**
 * アプリケーションヘッダーコンポーネント
 * 認証状態に応じてナビゲーションとユーザーメニューを表示
 * デスクトップ・モバイル両対応のレスポンシブデザイン
 */
export default function Header() {
  const { isLoggedIn, isLoading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // ログイン状態に応じて表示するナビゲーション項目を決定（useMemoで最適化）
  const navigationItems = useMemo(
    () =>
      isLoggedIn
        ? [...publicNavigationItems, ...authenticatedNavigationItems]
        : publicNavigationItems,
    [isLoggedIn],
  );

  const handleLogout = () => {
    logout();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <AppBar position="sticky" sx={{ borderRadius: 0 }}>
        <Toolbar>
          {/* モバイルハンバーガーメニュー */}
          <MobileNavigation
            items={navigationItems}
            isLoading={isLoading}
            mobileOpen={mobileOpen}
            onToggle={handleDrawerToggle}
          />

          {/* モバイル: ロゴを中央配置、デスクトップ: 左寄せ */}
          <Box
            sx={{
              display: { xs: 'flex', sm: 'none' },
              justifyContent: 'center',
              flexGrow: 1,
            }}
          >
            <HeaderLogo />
          </Box>

          {/* デスクトップ: ロゴを左に配置 */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <HeaderLogo />
          </Box>

          {/* デスクトップナビゲーション */}
          <DesktopNavigation items={navigationItems} isLoading={isLoading} />

          <Box sx={{ flexGrow: 1 }} />

          {/* デスクトップのみ: 認証ボタン/ユーザーメニュー */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {isLoading ? (
              <Skeleton
                variant="rounded"
                width={80}
                height={36}
                sx={{ borderRadius: 5, bgcolor: 'rgba(255, 255, 255, 0.1)' }}
              />
            ) : isLoggedIn ? (
              <UserMenu onAuthClick={handleLogout} />
            ) : (
              <LoginLink variant="header" />
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
