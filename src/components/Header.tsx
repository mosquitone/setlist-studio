'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from 'next/link';

export default function Header() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('token');
    setToken(stored);
    setLoading(false);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'token') {
        setToken(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleAuthClick = () => {
    if (token) {
      localStorage.removeItem('token');
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'token',
        newValue: null,
        storageArea: localStorage,
      }));
      router.push('/');
    } else {
      router.push('/login');
    }
  };

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
          color="inherit"
          sx={{ borderColor: 'inherit', ml: 1 }}
          onClick={handleAuthClick}
          disabled={loading}
        >
          {loading ? '読込中…' : token ? 'ログアウト' : 'ログイン'}
        </Button>
      </Toolbar>
    </AppBar>
  );
}
