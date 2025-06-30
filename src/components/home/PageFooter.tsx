'use client'

import { Box, Typography, Fade } from '@mui/material'

export function PageFooter() {
  return (
    <Fade in timeout={1000} style={{ transitionDelay: '600ms' }}>
      <Box sx={{ mt: 8, textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary" variant="body2">
          © 2025 mosquitone
        </Typography>
      </Box>
    </Fade>
  )
}
