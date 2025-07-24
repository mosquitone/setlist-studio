import { Box, Typography } from '@mui/material';
import React from 'react';

import { BaseThemeColors } from './types';

interface SongItemProps {
  item: {
    id: string;
    title: string;
    note?: string;
  };
  displayIndex: number;
  numberGap?: string;
  numberWidth?: string;
  fontSize: string;
  noteFontSize?: string;
  colors: BaseThemeColors;
}

export const SongItem: React.FC<SongItemProps> = ({
  item,
  displayIndex,
  numberGap = '0.5em',
  fontSize,
  noteFontSize = '16px',
  numberWidth = '4em',
  colors,
}) => (
  <Box key={item.id} sx={{ display: 'flex', gap: numberGap }}>
    <Box sx={{ flexShrink: 0, width: numberWidth, textAlign: 'right' }}>
      <Typography
        sx={{
          fontSize: fontSize,
          color: colors.text,
          fontWeight: 400,
          lineHeight: 1.2,
        }}
      >
        {displayIndex}.
      </Typography>
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography
        sx={{
          fontSize: fontSize,
          color: colors.text,
          fontWeight: 400,
          lineHeight: 1.2,
          mb: item.note ? 0.5 : 0,
        }}
      >
        {item.title}
      </Typography>
      {item.note && (
        <Typography
          sx={{
            fontSize: noteFontSize,
            color: colors.secondaryText,
            fontWeight: 300,
            mt: 0.1,
          }}
        >
          {item.note}
        </Typography>
      )}
    </Box>
  </Box>
);
