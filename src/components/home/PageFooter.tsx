'use client'

import { Typography } from '@mui/material'
import { FadeInBox } from '@/components/common/FadeInBox'

export function PageFooter() {
  return (
    <FadeInBox delay={600} sx={{ mt: 8, textAlign: 'center', py: 4 }}>
      <Typography color="text.secondary" variant="body2">
        © 2025 mosquitone
      </Typography>
    </FadeInBox>
  )
}
