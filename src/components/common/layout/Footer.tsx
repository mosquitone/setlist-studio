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
      {/* 法的情報 */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <NextLink href="/terms" style={{ textDecoration: 'none', fontSize: '0.875rem' }}>
          利用規約
        </NextLink>
        <NextLink href="/privacy" style={{ textDecoration: 'none', fontSize: '0.875rem' }}>
          プライバシーポリシー
        </NextLink>
      </Box>

      {/* サポート連絡先 */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', mb: 1 }}>
          お問い合わせはこちらまで
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
            mosquitone8+setliststudiosupport@gmail.com
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
            |
          </Typography>
          <Link
            href="https://x.com/mosquitone_info"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ textDecoration: 'none', fontSize: '0.875rem' }}
          >
            X
          </Link>
        </Box>
      </Box>

      {/* コピーライト */}
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
        © 2025
        <Link
          href="https://www.mosquit.one/"
          target="_blank"
          rel="noopener noreferrer"
          underline="hover"
          ml={1}
        >
          mosquitone
        </Link>
      </Typography>
    </Box>
  );
}
