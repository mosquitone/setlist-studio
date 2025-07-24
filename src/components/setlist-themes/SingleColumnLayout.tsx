import { Box } from '@mui/material';
import React, { useMemo } from 'react';

import { SongItem } from './SongItem';
import { BaseThemeColors } from './types';

interface SingleColumnLayoutProps {
  items: Array<{
    id: string;
    title: string;
    note?: string;
  }>;
  colors: BaseThemeColors;
}

export const SingleColumnLayout: React.FC<SingleColumnLayoutProps> = ({ items, colors }) => {
  // 1列レイアウト用のfontSizeとgapを計算
  const { fontSize, gap, noteFontSize } = useMemo((): {
    fontSize: string;
    gap: number;
    noteFontSize?: string;
  } => {
    const count = items.length;
    if (count === 0) return { fontSize: '', gap: 0 };
    const isNoteExitst = items.some((item) => !!item.note);

    if (isNoteExitst) {
      const defalt = { fontSize: '40px' };
      if (count < 4) return { ...defalt, gap: 3, noteFontSize: '22px' };
      if (count <= 6) return { ...defalt, gap: 3, noteFontSize: '20px' };
      if (count <= 8) return { fontSize: '38px', gap: 2, noteFontSize: '18px' };
      if (count <= 10) return { fontSize: '30px', gap: 1.5, noteFontSize: '16px' };
    }

    const defalut = { fontSize: '46px' };
    if (count < 4) return { ...defalut, gap: 5 };
    if (count <= 6) return { ...defalut, gap: 4 };
    if (count <= 8) return { ...defalut, gap: 3 };
    return { fontSize: '40px', gap: 3 };
  }, [items]);

  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: gap,
        minHeight: 0,
      }}
    >
      {items.map((item, index) => (
        <SongItem
          key={item.id}
          item={item}
          displayIndex={index + 1}
          fontSize={fontSize}
          noteFontSize={noteFontSize}
          colors={colors}
        />
      ))}
    </Box>
  );
};
