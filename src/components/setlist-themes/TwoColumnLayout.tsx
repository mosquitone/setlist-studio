import { Box } from '@mui/material';
import React, { useMemo } from 'react';

import { SongItem } from './SongItem';
import { BaseThemeColors } from './types';

interface TwoColumnLayoutProps {
  items: Array<{
    id: string;
    title: string;
    note?: string;
  }>;
  colors: BaseThemeColors;
}

export const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({ items, colors }) => {
  // 2列レイアウト用のfontSizeとgapを計算
  const { fontSize, gap, noteFontSize } = useMemo((): {
    fontSize: string;
    gap: number;
    noteFontSize?: string;
  } => {
    const count = items.length;
    if (count === 0) return { fontSize: '', gap: 0 };
    const isNoteExitst = items.some((item) => !!item.note);

    // 10曲以上は同じサイズが好ましい
    if (isNoteExitst) {
      return {
        fontSize: '28px',
        gap: 1.5,
        noteFontSize: '14px',
      };
    }

    return { fontSize: '30px', gap: 3 };
  }, [items]);

  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        gap: 3.5,
        minHeight: 0,
      }}
    >
      {/* 左列 (1-10曲) */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: gap,
          overflow: 'hidden',
          minHeight: 0,
        }}
      >
        {items.slice(0, 10).map((item, index) => (
          <SongItem
            key={item.id}
            item={item}
            displayIndex={index + 1}
            numberGap="0.7em"
            numberWidth="3em"
            fontSize={fontSize}
            noteFontSize={noteFontSize}
            colors={colors}
          />
        ))}
      </Box>

      {/* 右列 (11-20曲) */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: gap,
          overflow: 'hidden',
          minHeight: 0,
        }}
      >
        {items.slice(10, 20).map((item, index) => (
          <SongItem
            key={item.id}
            item={item}
            displayIndex={index + 11}
            numberGap="0.7em"
            numberWidth="3em"
            fontSize={fontSize}
            noteFontSize={noteFontSize}
            colors={colors}
          />
        ))}
      </Box>
    </Box>
  );
};
