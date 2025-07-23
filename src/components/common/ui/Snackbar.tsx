'use client';

import {
  Alert,
  AlertTitle,
  Snackbar as MuiSnackbar,
  Slide,
  SlideProps,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React from 'react';

export type SnackbarSeverity = 'error' | 'warning' | 'info' | 'success';

export interface SnackbarMessage {
  id: string;
  message: string;
  severity: SnackbarSeverity;
  title?: string;
  autoHideDuration?: number;
}

interface SnackbarProps {
  message: SnackbarMessage | null;
  open: boolean;
  onClose: () => void;
}

function SlideTransition(props: SlideProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return <Slide {...props} direction={isMobile ? 'down' : 'left'} />;
}

export const Snackbar: React.FC<SnackbarProps> = ({ message, open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!message) return null;

  const getAnchorOrigin = () => {
    if (isMobile) {
      return { vertical: 'top' as const, horizontal: 'center' as const };
    }
    return { vertical: 'bottom' as const, horizontal: 'right' as const };
  };

  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={message.autoHideDuration || 5000}
      onClose={onClose}
      anchorOrigin={getAnchorOrigin()}
      TransitionComponent={SlideTransition}
      sx={{
        // モバイル時の上部余白調整
        ...(isMobile && {
          top: { xs: 80, sm: 24 }, // ヘッダーの下に表示
        }),
        // デスクトップ時の右下余白調整
        ...(!isMobile && {
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
        }),
      }}
    >
      <Alert
        onClose={onClose}
        severity={message.severity}
        variant="filled"
        sx={{
          width: '100%',
          maxWidth: isMobile ? '90vw' : 400,
          minWidth: isMobile ? 280 : 300,
          boxShadow: theme.shadows[6],
          '& .MuiAlert-message': {
            width: '100%',
          },
        }}
      >
        {message.title && (
          <AlertTitle sx={{ mb: message.title ? 1 : 0 }}>{message.title}</AlertTitle>
        )}
        {message.message}
      </Alert>
    </MuiSnackbar>
  );
};
