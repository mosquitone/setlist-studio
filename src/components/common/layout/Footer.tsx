import React from 'react';
import { Box, Link, Typography } from '@mui/material';
import NextLink from 'next/link';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        textAlign: 'center',
        padding: '1rem',
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        marginTop: 'auto',
      }}
    >
      {/* 内部リンク - SEO向上のため */}
      <Box sx={{ mb: 2 }}>
        <NextLink href="/guide" style={{ textDecoration: 'none', margin: '0 8px' }}>
          利用ガイド
        </NextLink>
        <NextLink href="/login" style={{ textDecoration: 'none', margin: '0 8px' }}>
          ログイン
        </NextLink>
        <NextLink href="/register" style={{ textDecoration: 'none', margin: '0 8px' }}>
          新規登録
        </NextLink>
      </Box>

      {/* 法的情報リンク */}
      <Box sx={{ mb: 2 }}>
        <NextLink href="/terms" style={{ textDecoration: 'none', margin: '0 8px', fontSize: '0.875rem' }}>
          利用規約
        </NextLink>
        <NextLink href="/privacy" style={{ textDecoration: 'none', margin: '0 8px', fontSize: '0.875rem' }}>
          プライバシーポリシー
        </NextLink>
      </Box>

      <Typography variant="body2" color="text.secondary">
        © 2025{' '}
        <Link
          href="https://www.mosquit.one/"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
        >
          mosquitone
        </Link>{' '}
        | Powered by{' '}
        <Link
          href="https://www.mosquit.one/"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
        >
          mosquitone
        </Link>
      </Typography>
    </Box>
  );
}
