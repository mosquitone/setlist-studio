'use client'

import React from 'react'
import { Box, Paper, CircularProgress, Typography } from '@mui/material'
import { SetlistData } from './setlist-themes/types'
import { SetlistRenderer } from './setlist-themes/SetlistRenderer'

interface SetlistPreviewProps {
  data: SetlistData
  selectedTheme: 'black' | 'white'
  showDebug: boolean
  isGeneratingPreview: boolean
  previewImage: string | null
  qrCodeURL?: string
}

export function SetlistPreview({
  data,
  selectedTheme,
  showDebug,
  isGeneratingPreview,
  previewImage,
  qrCodeURL = '',
}: SetlistPreviewProps) {
  const renderPreview = () => {
    if (showDebug) {
      // DOM Preview
      return (
        <Box
          sx={{
            border: '2px solid red',
            margin: '1rem 0',
            width: '700px',
            height: '990px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box sx={{ transform: 'scale(0.88)', transformOrigin: 'top left' }}>
            <SetlistRenderer data={{ ...data, theme: selectedTheme, qrCodeURL }} />
          </Box>
        </Box>
      )
    }

    if (isGeneratingPreview) {
      // Loading State
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '700px',
            height: '990px',
          }}
        >
          <CircularProgress />
          <Typography sx={{ mt: 2, color: 'text.secondary' }}>画像を生成中...</Typography>
        </Box>
      )
    }

    if (previewImage) {
      // Image Preview
      return (
        <img
          src={previewImage}
          alt="Setlist Preview"
          style={{
            width: '700px',
            height: '990px',
            objectFit: 'contain',
            border: '1px solid #e0e0e0',
          }}
        />
      )
    }

    // Fallback to DOM Preview
    return (
      <Box
        sx={{
          width: '700px',
          height: '990px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box sx={{ transform: 'scale(0.88)', transformOrigin: 'top left' }}>
          <SetlistRenderer data={{ ...data, theme: selectedTheme, qrCodeURL }} />
        </Box>
      </Box>
    )
  }

  return (
    <Paper sx={{ width: '100%', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: 400 }}>
        {renderPreview()}
      </Box>
    </Paper>
  )
}
