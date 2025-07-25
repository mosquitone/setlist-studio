import { Box, Typography } from '@mui/material';
import React from 'react';

import { isValidUrl } from '@/lib/security/security-utils';
import { formatEventDate } from '@/lib/shared/dateUtils';
import { SetlistThemeProps } from '@/types/components';

import { SETLIST_FOOTER_TEXT } from './constants';
import { SingleColumnLayout } from './SingleColumnLayout';
import { TwoColumnLayout } from './TwoColumnLayout';
import { BaseThemeColors } from './types';

interface BaseThemeProps extends SetlistThemeProps {
  colors: BaseThemeColors;
}

/**
 * セットリストテーマの共通ベースコンポーネント
 * A4サイズ対応、テーマ別カラーパレット適用
 *
 * @param data - セットリストデータ（楽曲リスト、イベント情報等）
 * @param className - 追加のCSSクラス名
 * @param colors - テーマカラー設定オブジェクト
 */

export const BaseTheme: React.FC<BaseThemeProps> = ({ data, className, colors, lang = 'ja' }) => {
  const { artistName, eventName, eventDate, openTime, startTime, items, qrCodeURL } = data;

  // 20曲制限を適用
  const limitedItems = items.slice(0, 20);

  // A4 dimensions: 210mm x 297mm (roughly 794px x 1123px at 96 DPI)
  const A4_WIDTH = 794;
  const A4_HEIGHT = 1123;

  // アーティスト名の文字数に応じたフォントサイズを決定
  const getArtistNameFontSize = (name: string): string => {
    const length = name.length;
    if (length <= 10) return '48px';
    if (length <= 20) return '41px';
    return '32px'; // 長い名前: 小さく表示
  };

  return (
    <div
      className={className}
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        padding: '30px',
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
      <Box sx={{ textAlign: 'left', mb: 5, pl: 2 }}>
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: getArtistNameFontSize(artistName),
            fontWeight: 700,
            width: '85%',
            color: colors.text,
            mb: 1,
            letterSpacing: '2px',
            lineHeight: 1.1,
          }}
        >
          {artistName}
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
              {formatEventDate(eventDate, lang)}
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
                START {startTime}
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
      {limitedItems.length <= 10 ? (
        <SingleColumnLayout items={limitedItems} colors={colors} />
      ) : (
        <TwoColumnLayout items={limitedItems} colors={colors} />
      )}

      {/* Footer */}
      <Box
        sx={{
          mt: 'auto',
          pt: 2,
          textAlign: 'center',
          borderTop: `1px solid ${colors.borderColor}`,
          flexShrink: 0, // フッターのサイズを固定
        }}
      >
        <Typography sx={{ fontSize: '20px', color: colors.footerText, fontWeight: 500 }}>
          {SETLIST_FOOTER_TEXT}
        </Typography>
      </Box>
    </div>
  );
};

export { type BaseThemeColors };
