'use client'

import { useState, useEffect, ReactNode } from 'react'
import { Box, SxProps, Theme } from '@mui/material'

interface FadeInBoxProps {
  delay?: number
  children: ReactNode
  sx?: SxProps<Theme>
}

export function FadeInBox({ delay = 0, children, sx = {} }: FadeInBoxProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  const fadeStyle: SxProps<Theme> = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
  }

  return <Box sx={{ ...sx, ...fadeStyle }}>{children}</Box>
}
