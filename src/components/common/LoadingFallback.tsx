import { Container, CircularProgress, Typography, Box } from '@mui/material'

export default function LoadingFallback() {
  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          読み込み中...
        </Typography>
      </Box>
    </Container>
  )
}
