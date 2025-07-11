import React from 'react';
import { Link, Typography } from '@mui/material';

export default function Footer() {
  return (
    <footer style={{ textAlign: 'center', padding: '1rem' }}>
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
    </footer>
  );
}
