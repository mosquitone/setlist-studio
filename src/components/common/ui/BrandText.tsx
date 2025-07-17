import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

interface BrandTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2';
  component?: React.ElementType;
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
}

export function BrandText({
  variant = 'h4',
  component = 'div',
  sx = {},
  children = 'Setlist Studio',
  ...props
}: BrandTextProps) {
  return (
    <Typography
      variant={variant}
      component={component}
      sx={{
        fontFamily: '"Impact", "Arial Black", "Helvetica", sans-serif',
        fontWeight: '900',
        fontSize: variant === 'h6' ? '1.25rem' : '1.85rem',
        color: 'primary.main',
        backgroundColor: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
        display: 'inline-block',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
}
