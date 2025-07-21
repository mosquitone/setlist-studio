import React from 'react';
import { Box } from '@mui/material';

interface StepIconProps {
  /** ステップ番号 */
  step: number;
}

export const StepIcon: React.FC<StepIconProps> = ({ step }) => {
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
};
