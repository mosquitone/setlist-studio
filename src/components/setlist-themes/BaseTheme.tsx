import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { SETLIST_FOOTER_TEXT } from './constants';
import { SetlistThemeProps } from '@/types/components';
import { formatEventDateJST } from '@/lib/shared/dateUtils';
import { isValidUrl } from '@/lib/security/security-utils';

interface ThemeColors {
  background: string;
  text: string;
  secondaryText: string;
  borderColor: string;
  footerText: string;
  qrBackground: string;
}

interface BaseThemeProps extends SetlistThemeProps {
  colors: ThemeColors;
}

/**
 * セットリストテーマの共通ベースコンポーネント
 * A4サイズ対応、テーマ別カラーパレット適用
 *
 * @param data - セットリストデータ（楽曲リスト、イベント情報等）
 * @param className - 追加のCSSクラス名
 * @param colors - テーマカラー設定オブジェクト
 */

export const BaseTheme: React.FC<BaseThemeProps> = ({ data, className, colors }) => {
  const { bandName, eventName, eventDate, openTime, startTime, items, qrCodeURL } = data;

  // A4 dimensions: 210mm x 297mm (roughly 794px x 1123px at 96 DPI)
  const A4_WIDTH = 794;
  const A4_HEIGHT = 1123;

  // Dynamic font size based on number of songs for A4 compatibility (memoized)
  const fontSize = useMemo(() => {
    const count = items.length;
    if (count <= 6) return '40px';
    if (count <= 8) return '34px';
    if (count <= 10) return '30px';
    if (count <= 12) return '26px';
    if (count <= 15) return '24px';
    if (count <= 18) return '22px';
    if (count <= 25) return '20px';
    return '18px';
  }, [items.length]);

  return (
    <div
      className={className}
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        padding: '40px',
        width: `${A4_WIDTH}px`,
        height: `${A4_HEIGHT}px`,
        margin: '0 auto',
        position: 'relative',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Inter, system-ui, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Header Section */}
      <Box sx={{ textAlign: 'left', mb: 6, pl: 2 }}>
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: '48px',
            fontWeight: 700,
            color: colors.text,
            mb: 1,
            letterSpacing: '2px',
            textTransform: 'lowercase',
            lineHeight: 1.1,
          }}
        >
          {bandName}
        </Typography>

        {eventName && (
          <Typography
            variant="h2"
            sx={{
              fontSize: '18px',
              color: colors.secondaryText,
              mb: 3,
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {eventName}
          </Typography>
        )}

        {/* Event Details */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {eventDate && (
            <Typography sx={{ fontSize: '16px', color: colors.text, fontWeight: 400 }}>
              {formatEventDateJST(eventDate)}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 2 }}>
            {openTime && (
              <Typography sx={{ fontSize: '16px', color: colors.text, fontWeight: 400 }}>
                OPEN {openTime}
              </Typography>
            )}
            {startTime && (
              <Typography sx={{ fontSize: '16px', color: colors.text, fontWeight: 400 }}>
                START: {startTime}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* QR Code */}
      {qrCodeURL && isValidUrl(qrCodeURL) && (
        <Box
          sx={{
            position: 'absolute',
            top: 30,
            right: 30,
            width: 80,
            height: 80,
            backgroundColor: colors.qrBackground,
            padding: '8px',
            borderRadius: '4px',
          }}
        >
          <img
            src={qrCodeURL}
            alt="QR Code"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </Box>
      )}

      {/* Songs List */}
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          pl: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 3.5,
        }}
      >
        {items.map((item) => (
          <Box key={item.id} sx={{}}>
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
                  fontSize: '16px',
                  color: colors.secondaryText,
                  fontWeight: 300,
                  pl: 0,
                }}
              >
                {item.note}
              </Typography>
            )}
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          mt: 'auto',
          pt: 2,
          textAlign: 'center',
          borderTop: `1px solid ${colors.borderColor}`,
        }}
      >
        <Typography sx={{ fontSize: '12px', color: colors.footerText }}>
          {SETLIST_FOOTER_TEXT}
        </Typography>
      </Box>
    </div>
  );
};

export { type ThemeColors };
