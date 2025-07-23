'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

import { Snackbar, SnackbarMessage, SnackbarSeverity } from '@/components/common/ui/Snackbar';

interface SnackbarContextType {
  showSnackbar: (
    message: string,
    severity?: SnackbarSeverity,
    options?: {
      title?: string;
      autoHideDuration?: number;
    },
  ) => void;
  showError: (message: string, title?: string) => void;
  showSuccess: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

interface SnackbarProviderProps {
  children: React.ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [snackbarQueue, setSnackbarQueue] = useState<SnackbarMessage[]>([]);
  const [currentSnackbar, setCurrentSnackbar] = useState<SnackbarMessage | null>(null);
  const [open, setOpen] = useState(false);

  const processQueue = useCallback(() => {
    if (snackbarQueue.length > 0 && !currentSnackbar) {
      const nextMessage = snackbarQueue[0];
      setSnackbarQueue((prev) => prev.slice(1));
      setCurrentSnackbar(nextMessage);
      setOpen(true);
    }
  }, [snackbarQueue, currentSnackbar]);

  React.useEffect(() => {
    processQueue();
  }, [processQueue]);

  const hideSnackbar = useCallback(() => {
    setOpen(false);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    // アニメーション完了後にcurrentSnackbarをクリア
    setTimeout(() => {
      setCurrentSnackbar(null);
    }, 200);
  }, []);

  const showSnackbar = useCallback(
    (
      message: string,
      severity: SnackbarSeverity = 'info',
      options?: {
        title?: string;
        autoHideDuration?: number;
      },
    ) => {
      const snackbarMessage: SnackbarMessage = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        message,
        severity,
        title: options?.title,
        autoHideDuration: options?.autoHideDuration,
      };

      setSnackbarQueue((prev) => [...prev, snackbarMessage]);
    },
    [],
  );

  const showError = useCallback(
    (message: string, title?: string) => {
      showSnackbar(message, 'error', { title, autoHideDuration: 6000 });
    },
    [showSnackbar],
  );

  const showSuccess = useCallback(
    (message: string, title?: string) => {
      showSnackbar(message, 'success', { title, autoHideDuration: 4000 });
    },
    [showSnackbar],
  );

  const showWarning = useCallback(
    (message: string, title?: string) => {
      showSnackbar(message, 'warning', { title, autoHideDuration: 5000 });
    },
    [showSnackbar],
  );

  const showInfo = useCallback(
    (message: string, title?: string) => {
      showSnackbar(message, 'info', { title, autoHideDuration: 4000 });
    },
    [showSnackbar],
  );

  const value: SnackbarContextType = {
    showSnackbar,
    showError,
    showSuccess,
    showWarning,
    showInfo,
    hideSnackbar,
  };

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar message={currentSnackbar} open={open} onClose={handleClose} />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
