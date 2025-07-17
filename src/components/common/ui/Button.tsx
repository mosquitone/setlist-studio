import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { forwardRef } from 'react';

type CustomVariant = 'text' | 'outlined' | 'contained' | 'danger';

type ButtonProps = Omit<MuiButtonProps, 'variant'> & {
  authButton?: boolean;
  variant?: CustomVariant;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'contained', authButton = false, loading = false, sx, ...props }, ref) => {
    // 認証ボタン用の統一スタイル
    const authButtonStyles: SxProps<Theme> = authButton
      ? {
          borderRadius: 10,
          px: 4,
          py: 1.5,
          fontSize: '16px',
          fontWeight: 500,
          textTransform: 'none',
          border: variant === 'outlined' ? '2px solid' : undefined,
          minWidth: { xs: 140, sm: 160 },
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:focus-visible': {
            outline: '2px solid',
            outlineOffset: '2px',
            outlineColor: 'rgba(59, 130, 246, 0.7)',
          },
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow:
              variant === 'outlined'
                ? '0 4px 12px rgba(0, 0, 0, 0.15)'
                : '0 8px 25px rgba(0, 0, 0, 0.15)',
          },
          '&:active': {
            transform: 'translateY(-1px)',
            transition: 'all 0.1s ease-out',
          },
        }
      : {};

    // dangerバリアントの場合はMUIのバリアントを調整
    const muiVariant =
      variant === 'danger' ? 'contained' : (variant as 'text' | 'outlined' | 'contained');

    // dangerバリアントのスタイル
    const dangerStyles: SxProps<Theme> =
      variant === 'danger'
        ? {
            backgroundColor: '#dc2626',
            color: 'white',
            '&:hover': {
              backgroundColor: '#b91c1c',
            },
            '&:disabled': {
              backgroundColor: '#9ca3af',
              color: 'white',
            },
          }
        : {};

    return (
      <MuiButton
        ref={ref}
        variant={muiVariant}
        disabled={loading || props.disabled}
        sx={[
          {
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
            padding: '12px 24px',
            backgroundColor: variant === 'contained' ? '#2563eb' : undefined,
            '&:hover': {
              backgroundColor: variant === 'contained' ? '#1d4ed8' : undefined,
            },
          },
          authButtonStyles,
          dangerStyles,
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...props}
      >
        {loading ? (
          <CircularProgress
            size={20}
            sx={{
              color: 'inherit',
            }}
          />
        ) : (
          props.children
        )}
      </MuiButton>
    );
  },
);

Button.displayName = 'Button';
