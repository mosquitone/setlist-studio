import React from 'react';
import { Box, Link, Typography } from '@mui/material';

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
