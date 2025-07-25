import { Box, Skeleton } from '@mui/material';
import React from 'react';

interface SkeletonLoaderProps {
  height?: number | string;
  width?: number | string;
  variant?: 'text' | 'rectangular' | 'circular';
  animation?: 'pulse' | 'wave' | false;
  count?: number;
  spacing?: number;
}

/**
 * Skeleton loader component for preventing layout shift during content loading
 */
export const SkeletonLoader = React.memo(function SkeletonLoader({
  height = 20,
  width = '100%',
  variant = 'rectangular',
  animation = 'wave',
  count = 1,
  spacing = 1,
}: SkeletonLoaderProps) {
  return (
    <Box>
      {Array.from({ length: count }).map((_, index) => (
        <Box key={index} sx={{ mb: index < count - 1 ? spacing : 0 }}>
          <Skeleton variant={variant} width={width} height={height} animation={animation} />
        </Box>
      ))}
    </Box>
  );
});
