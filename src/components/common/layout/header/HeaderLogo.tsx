import Link from 'next/link';
import Image from 'next/image';
import { Box } from '@mui/material';

export function HeaderLogo() {
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
        <Image
          src="/setlist-studio-logo.png"
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
}
