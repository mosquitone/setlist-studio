import { Box } from '@mui/material';
import Link from 'next/link';
import React from 'react';

import OptimizedImage from '@/components/common/ui/OptimizedImage';

export const HeaderLogo = React.memo(function HeaderLogo() {
  return (
    <Link href="/" passHref style={{ textDecoration: 'none' }}>
      <Box
        sx={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          '&:hover': {
            transform: 'scale(1.02)',
          },
          transition: 'transform 0.2s ease-in-out',
        }}
      >
        <OptimizedImage
          src="/setlist-studio-logo.png"
          fallbackSrc="/setlist-studio-logo.png"
          alt="Setlist Studio"
          width={200}
          height={64}
          style={{
            objectFit: 'contain',
            filter: 'invert(1)',
            borderRadius: '4px',
            padding: '2px 4px',
          }}
          priority
        />
      </Box>
    </Link>
  );
});
