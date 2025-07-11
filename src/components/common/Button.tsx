import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { forwardRef } from 'react';

type ButtonProps = MuiButtonProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'contained', sx, ...props }, ref) => {
    return (
      <MuiButton
        ref={ref}
        variant={variant}
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 500,
          padding: '12px 24px',
          backgroundColor: variant === 'contained' ? '#2563eb' : undefined,
          '&:hover': {
            backgroundColor: variant === 'contained' ? '#1d4ed8' : undefined,
          },
          ...sx,
        }}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
