import { Box } from '@mui/material';
import React from 'react';

interface StepIconProps {
  /** ステップ番号 */
  step: number;
}

export const StepIcon: React.FC<StepIconProps> = React.memo(({ step }) => {
  return (
    <Box
      sx={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        bgcolor: 'primary.main',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.8rem',
        fontWeight: 'bold',
      }}
    >
      {step}
    </Box>
  );
});

StepIcon.displayName = 'StepIcon';
