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

// 楽曲アイテムの共通コンポーネント
const SongItem: React.FC<{
  item: any;
  displayIndex: number;
  fontSize: string;
  colors: ThemeColors;
}> = ({ item, displayIndex, fontSize, colors }) => (
  <Box key={item.id} sx={{ display: 'flex', gap: '0.5em' }}>
    <Box sx={{ flexShrink: 0, width: '4em', textAlign: 'right' }}>
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
            fontSize: '16px',
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

export const BaseTheme: React.FC<BaseThemeProps> = ({ data, className, colors }) => {
  const { bandName, eventName, eventDate, openTime, startTime, items, qrCodeURL } = data;

  // 20曲制限を適用
  const limitedItems = items.slice(0, 20);

  // A4 dimensions: 210mm x 297mm (roughly 794px x 1123px at 96 DPI)
  const A4_WIDTH = 794;
  const A4_HEIGHT = 1123;

  // Auto-calculated font size and spacing based on available space (memoized)
  const { fontSize, gap } = useMemo(() => {
    const count = Math.min(items.length, 20); // 20曲制限
    if (count === 0) return { fontSize: '32px', gap: 2.5 };

    // A4サイズから固定要素を差し引いた利用可能高さを厳密に計算
    const headerHeight = 200; // ヘッダーセクション厳密高さ
    const footerHeight = 90; // フッター厳密高さ（border + padding + text + margin）
    const padding = 60; // 上下パディング
    const headerMargin = 48; // ヘッダー下マージン (mb: 6 = 48px)
    const safetyMargin = 15; // 安全マージン（最小限に）
    const availableHeight =
      A4_HEIGHT - headerHeight - footerHeight - padding - headerMargin - safetyMargin;

    // 2列レイアウトでの1列あたりの楽曲数を計算
    const effectiveCount = count <= 10 ? count : 10; // 2列の場合は左列の10曲を基準に計算

    // オプション（note）がある楽曲の数をカウント（制限内のみ）
    const itemsForCalculation = limitedItems;

    // 11曲以上の場合は左列（1-10曲）の楽曲のみを考慮
    const leftColumnItems = count > 10 ? itemsForCalculation.slice(0, 10) : itemsForCalculation;
    const songsWithNotes = leftColumnItems.filter((item) => item.note).length;
    const songsWithoutNotes = effectiveCount - songsWithNotes;

    // 1曲あたりの平均必要高さを計算（noteありは1.7倍の高さ）
    const noteHeightMultiplier = 1.7;
    const totalSongUnits = songsWithoutNotes + songsWithNotes * noteHeightMultiplier;

    // 楽曲間のgap総高さを考慮
    const totalGapHeight = (effectiveCount - 1) * 16; // 基本gap = 16px
    const availableForSongs = availableHeight - totalGapHeight;

    // 1曲あたりの基本高さを計算
    const baseSongHeight = availableForSongs / totalSongUnits;

    // フォントサイズを楽曲数に応じて調整
    let calculatedFontSize;
    if (count <= 10) {
      // 10曲以下は大きめのフォントサイズ
      calculatedFontSize = Math.max(20, Math.min(50, baseSongHeight * 0.85));
    } else {
      // 11曲以上は2列レイアウトなので、折り返さないよう小さめに
      calculatedFontSize = Math.max(16, Math.min(32, baseSongHeight * 0.75));
    }

    // gapを楽曲数に応じて調整（ライブ会場用に最適化）
    const calculatedGap = Math.max(1.0, Math.min(2.8, 3.8 - effectiveCount * 0.18));

    return {
      fontSize: `${Math.round(calculatedFontSize)}px`,
      gap: calculatedGap,
    };
  }, [limitedItems, items.length]);

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

      {/* Songs List - 2列レイアウト */}
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          pl: 2,
          display: 'flex',
          flexDirection: limitedItems.length <= 10 ? 'column' : 'row',
          gap: limitedItems.length <= 10 ? gap : 4,
          minHeight: 0, // flexアイテムの最小高さを0に設定
        }}
      >
        {limitedItems.length <= 10 ? (
          // 10曲以下は1列レイアウト
          limitedItems.map((item, index) => (
            <SongItem
              key={item.id}
              item={item}
              displayIndex={index + 1}
              fontSize={fontSize}
              colors={colors}
            />
          ))
        ) : (
          // 11曲以上は2列レイアウト
          <>
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
              {limitedItems.slice(0, 10).map((item, index) => (
                <SongItem
                  key={item.id}
                  item={item}
                  displayIndex={index + 1}
                  fontSize={fontSize}
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
              {limitedItems.slice(10, 20).map((item, index) => (
                <SongItem
                  key={item.id}
                  item={item}
                  displayIndex={index + 11}
                  fontSize={fontSize}
                  colors={colors}
                />
              ))}
            </Box>
          </>
        )}
      </Box>

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

export { type ThemeColors };
