'use client';

import React, { useState, useEffect } from 'react';
import { Box, Paper, CircularProgress, Typography, Button } from '@mui/material';
import QRCode from 'qrcode';
import { SetlistData } from '@/types/components';
import { Theme } from '@/types/common';
import { SetlistRenderer } from '../setlist-themes/SetlistRenderer';

interface SetlistPreviewProps {
  data: SetlistData;
  selectedTheme: Theme;
  showDebug: boolean;
  isGeneratingPreview: boolean;
  previewImage: string | null;
  qrCodeURL?: string;
}

export function SetlistPreview({
  data,
  selectedTheme,
  showDebug,
  isGeneratingPreview,
  previewImage,
  qrCodeURL = '',
}: SetlistPreviewProps) {
  const [generatedQrCode, setGeneratedQrCode] = useState<string>('');

  // Generate QR code for DOM preview
  useEffect(() => {
    if (qrCodeURL && showDebug) {
      QRCode.toDataURL(qrCodeURL, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
        .then(setGeneratedQrCode)
        .catch(() => setGeneratedQrCode(''));
    }
  }, [qrCodeURL, showDebug]);
  const renderPreview = () => {
    if (showDebug) {
      // DOM Preview
      return (
        <Box
          sx={{
            border: '2px solid red',
            margin: 0,
            width: '700px',
            height: '990px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box sx={{ transform: 'scale(0.88)', transformOrigin: 'top left' }}>
            <SetlistRenderer data={{ ...data, theme: selectedTheme, qrCodeURL: generatedQrCode }} />
          </Box>
        </Box>
      );
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
      );
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
      );
    }

    // Error state - image generation failed
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '700px',
          height: '990px',
          border: '1px solid #e0e0e0',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
          画像が生成されませんでした
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 1 }}>
          画像生成を再試行
        </Button>
      </Box>
    );
  };

  return (
    <Paper sx={{ width: '100%', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: 400 }}>
        {renderPreview()}
      </Box>
    </Paper>
  );
}
