import { Box, BoxProps } from '@mui/material';
import React from 'react';

interface AspectRatioBoxProps extends BoxProps {
  ratio?: number; // width / height ratio (e.g., 16/9, 4/3, 1)
  children: React.ReactNode;
}

/**
 * A container that maintains a specific aspect ratio
 * Prevents layout shift when content loads
 */
export const AspectRatioBox = React.memo(function AspectRatioBox({
  ratio = 1,
  children,
  sx,
  ...props
}: AspectRatioBoxProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        paddingBottom: `${(1 / ratio) * 100}%`,
        ...sx,
      }}
      {...props}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
});