'use client';

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
import React, { useState, useEffect } from 'react';

import { useContainerWidth } from '@/hooks/useContainerWidth';
import { useI18n } from '@/hooks/useI18n';
import { Theme } from '@/types/common';
import { SetlistData } from '@/types/components';

import { SetlistRenderer } from '../setlist-themes/SetlistRenderer';

// 定数定義
const A4_ASPECT_RATIO = 990 / 700; // 約1.414
const RENDERER_BASE_WIDTH = 794; // BaseTheme.tsxのA4_WIDTH
const DEFAULT_SCALE = 0.88;
const QR_CODE_CONFIG = {
  width: 200,
  margin: 2,
  color: { dark: '#000000', light: '#FFFFFF' },
};

// 型定義
interface SetlistPreviewProps {
  data: SetlistData;
  selectedTheme: Theme;
  showDebug: boolean;
  isGeneratingPreview: boolean;
  previewImage: string | null;
  qrCodeURL?: string;
}

interface PreviewDimensions {
  width: string;
  maxWidth: string;
  aspectRatio: string;
}

interface RenderProps {
  previewStyle: PreviewDimensions;
  scale: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  data: SetlistData;
  selectedTheme: Theme;
  generatedQrCode: string;
  messages: any;
  isMobile: boolean;
}

// スタイル定義
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    overflow: 'auto',
    backgroundColor: '#e0e0e0',
    borderRadius: 1,
    p: 2,
  },
  previewBase: {
    width: '100%',
    aspectRatio: '700 / 990',
  },
  errorState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #e0e0e0',
    backgroundColor: '#f5f5f5',
  },
  debugPreview: {
    border: '2px solid red',
    margin: 0,
    overflow: 'hidden',
    position: 'relative' as const,
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
  },
} as const;

// レンダリング関数
const renderDOMPreview = (props: RenderProps) => {
  const { previewStyle, scale, containerRef, data, selectedTheme, generatedQrCode } = props;

  return (
    <Box
      ref={containerRef}
      sx={{
        ...styles.debugPreview,
        ...previewStyle,
      }}
    >
      <Box
        sx={{
          width: `${RENDERER_BASE_WIDTH}px`,
          height: `${RENDERER_BASE_WIDTH * A4_ASPECT_RATIO}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <SetlistRenderer data={{ ...data, theme: selectedTheme, qrCodeURL: generatedQrCode }} />
      </Box>
    </Box>
  );
};

const renderLoadingState = (props: RenderProps) => {
  const { previewStyle, messages } = props;

  return (
    <Box
      sx={{
        ...styles.loadingState,
        ...previewStyle,
      }}
    >
      <CircularProgress />
      <Typography sx={{ mt: 2, color: 'text.secondary' }}>{messages.common.generating}</Typography>
    </Box>
  );
};

const renderImagePreview = (props: RenderProps & { previewImage: string }) => {
  const { previewStyle, containerRef, previewImage, messages } = props;

  return (
    <Box ref={containerRef} sx={{ ...previewStyle, position: 'relative' }}>
      <img
        src={previewImage}
        alt={messages.common.setlistPreview}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          border: '1px solid #e0e0e0',
        }}
      />
    </Box>
  );
};

const renderErrorState = (props: RenderProps) => {
  const { previewStyle, isMobile } = props;

  return (
    <Box
      sx={{
        ...styles.errorState,
        ...previewStyle,
      }}
    >
      <Typography
        variant={isMobile ? 'body1' : 'h6'}
        sx={{ mb: 2, color: 'text.secondary', textAlign: 'center', px: 2 }}
      >
        画像が生成されませんでした
      </Typography>
      <Button
        onClick={() => window.location.reload()}
        sx={{ mt: 1 }}
        size={isMobile ? 'small' : 'medium'}
      >
        画像生成を再試行
      </Button>
    </Box>
  );
};

export function SetlistPreview({
  data,
  selectedTheme,
  showDebug,
  isGeneratingPreview,
  previewImage,
  qrCodeURL = '',
}: SetlistPreviewProps) {
  const { messages } = useI18n();
  const [generatedQrCode, setGeneratedQrCode] = useState<string>('');
  const { containerRef, containerWidth } = useContainerWidth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Generate QR code for DOM preview
  useEffect(() => {
    if (qrCodeURL && showDebug) {
      QRCode.toDataURL(qrCodeURL, QR_CODE_CONFIG)
        .then(setGeneratedQrCode)
        .catch(() => setGeneratedQrCode(''));
    }
  }, [qrCodeURL, showDebug]);

  // レスポンシブなサイズ設定（パーセンテージベース）
  const getPreviewStyle = (): PreviewDimensions => {
    return {
      width: '100%',
      maxWidth: isMobile ? '100%' : '700px',
      aspectRatio: `700 / 990`,
    };
  };

  // 動的なスケール計算
  const calculateScale = (): number => {
    if (!containerWidth) return DEFAULT_SCALE;

    const maxWidth = isMobile ? containerWidth : Math.min(containerWidth, 700);
    const scale = maxWidth / RENDERER_BASE_WIDTH;

    return isMobile ? scale : Math.min(scale, DEFAULT_SCALE);
  };

  const renderPreview = () => {
    const previewStyle = getPreviewStyle();
    const scale = calculateScale();

    const renderProps: RenderProps = {
      previewStyle,
      scale,
      containerRef,
      data,
      selectedTheme,
      generatedQrCode,
      messages,
      isMobile,
    };

    if (showDebug) {
      return renderDOMPreview(renderProps);
    }

    if (isGeneratingPreview) {
      return renderLoadingState(renderProps);
    }

    if (previewImage) {
      return renderImagePreview({ ...renderProps, previewImage });
    }

    return renderErrorState(renderProps);
  };

  return (
    <Paper sx={{ width: '100%', p: isMobile ? 1 : 3 }}>
      <Box
        sx={{
          ...styles.container,
          minHeight: isMobile ? 300 : 400,
        }}
      >
        {renderPreview()}
      </Box>
    </Paper>
  );
}
