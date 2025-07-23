'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/ja';
import 'dayjs/locale/en';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      light: '#60a5fa',
      dark: '#1d4ed8',
    },
    secondary: {
      main: '#dc2626',
      light: '#f87171',
      dark: '#b91c1c',
    },
    background: {
      default: '#f0f4f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    // アクセシビリティの問題を修正
    MuiPopover: {
      defaultProps: {
        // ポップオーバーのアクセシビリティ改善
        disablePortal: false,
        disableScrollLock: true,
        // ポータルではなく通常のDOMツリーに配置することで aria-hidden の問題を回避
        container: undefined,
      },
    },
    MuiMenu: {
      defaultProps: {
        // メニューのアクセシビリティ向上
        disablePortal: false,
        keepMounted: false,
        disableScrollLock: true,
      },
    },
    MuiModal: {
      defaultProps: {
        // モーダルのアクセシビリティ改善
        disablePortal: false,
        keepMounted: false,
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          // バックドロップのアクセシビリティ改善
          '&[aria-hidden="true"]': {
            // inert属性でフォーカス管理を改善
            pointerEvents: 'auto',
          },
        },
      },
    },
  },
});

export default function MUIProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>{children}</LocalizationProvider>
    </ThemeProvider>
  );
}
