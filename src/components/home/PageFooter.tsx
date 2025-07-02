'use client'

import { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'

export function PageFooter() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Box sx={{ 
      mt: 8, 
      textAlign: 'center', 
      py: 4,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 1s ease-out, transform 1s ease-out'
    }}>
        <Typography color="text.secondary" variant="body2">
          © 2025 mosquitone
        </Typography>
    </Box>
  )
}
