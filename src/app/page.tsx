import HomeClient from './HomeClient';
import NoSSR from '@/components/common/ui/NoSSR';
import { Container, Box, Typography } from '@mui/material';

// Disable caching for authentication-dependent content
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <NoSSR
      fallback={
        <Container maxWidth="lg">
          <Box
            sx={{
              minHeight: '60vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" color="text.secondary">
              読み込み中...
            </Typography>
          </Box>
        </Container>
      }
    >
      <HomeClient />
    </NoSSR>
  );
}
