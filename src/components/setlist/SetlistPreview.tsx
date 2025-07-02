'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  CircularProgress,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  // レスポンシブなサイズ設定
  const getPreviewDimensions = () => {
    if (isMobile) {
      // モバイル: 最大350pxまたはビューポート幅の90%、A4比率（700:990）を維持
      const maxWidth = 350; // 固定値に変更してSSRエラーを回避
      const height = (maxWidth * 990) / 700;
      return { width: maxWidth, height };
    }
    // デスクトップ: 元のサイズ
    return { width: 700, height: 990 };
  };

  const { width: previewWidth, height: previewHeight } = getPreviewDimensions();

  const renderPreview = () => {
    if (showDebug) {
      // DOM Preview
      return (
        <Box
          sx={{
            border: '2px solid red',
            margin: 0,
            width: `${previewWidth}px`,
            height: `${previewHeight}px`,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              transform: isMobile ? `scale(${previewWidth / 700})` : 'scale(0.88)',
              transformOrigin: 'top left',
            }}
          >
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
            width: `${previewWidth}px`,
            height: `${previewHeight}px`,
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
            width: `${previewWidth}px`,
            height: `${previewHeight}px`,
            objectFit: 'contain',
            border: '1px solid #e0e0e0',
            maxWidth: '100%',
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
          width: `${previewWidth}px`,
          height: `${previewHeight}px`,
          border: '1px solid #e0e0e0',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Typography
          variant={isMobile ? 'body1' : 'h6'}
          sx={{ mb: 2, color: 'text.secondary', textAlign: 'center', px: 2 }}
        >
          画像が生成されませんでした
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
          sx={{ mt: 1 }}
          size={isMobile ? 'small' : 'medium'}
        >
          画像生成を再試行
        </Button>
      </Box>
    );
  };

  return (
    <Paper sx={{ width: '100%', p: isMobile ? 1 : 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          minHeight: isMobile ? 300 : 400,
          overflow: 'auto',
        }}
      >
        {renderPreview()}
      </Box>
    </Paper>
  );
}
