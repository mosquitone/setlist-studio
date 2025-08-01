'use client';

import { Image as ImageIcon } from '@mui/icons-material';
import { Box, CircularProgress } from '@mui/material';
import { toBlob } from 'html-to-image';
import QRCode from 'qrcode';
import React, { useState, useEffect, memo } from 'react';

import { Button } from '@/components/common/ui/Button';
import { useSnackbar } from '@/components/providers/SnackbarProvider';
import { useI18n } from '@/hooks/useI18n';
import { isValidUrl } from '@/lib/security/security-utils';
import { Theme } from '@/types/common';
import { SetlistData } from '@/types/components';

import { SetlistRenderer } from '../setlist-themes/SetlistRenderer';

interface ImageGeneratorProps {
  data: SetlistData;
  selectedTheme: Theme;
  onDownloadReady?: (downloadFn: () => Promise<void>) => void;
  onPreviewReady?: (imageUrl: string) => void;
  onPreviewGenerationStart?: () => void;
  baseUrl?: string;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = memo(
  ({
    data,
    selectedTheme,
    onDownloadReady,
    onPreviewReady,
    onPreviewGenerationStart,
    baseUrl = typeof window !== 'undefined' ? window.location.origin : '',
  }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [hasGenerated, setHasGenerated] = useState(false);
    const { messages } = useI18n();
    const { showError, showSuccess } = useSnackbar();

    const generateQRCode = React.useCallback(
      async (setlistId: string): Promise<string> => {
        const url = `${baseUrl}/setlists/${setlistId}`;

        // URLの妥当性チェック
        if (!isValidUrl(url)) return '';

        try {
          const qrCodeDataURL = await QRCode.toDataURL(url, {
            width: 200,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF',
            },
          });

          // 生成されたData URLの検証
          if (!qrCodeDataURL.startsWith('data:image/')) return '';

          return qrCodeDataURL;
        } catch {
          return '';
        }
      },
      [baseUrl],
    );

    const generateImage = React.useCallback(
      async (theme: string): Promise<string | null> => {
        setIsGenerating(true);
        const isBlackTheme = theme === 'black';
        const backgroundColor = isBlackTheme ? '#000000' : '#ffffff';

        try {
          // QRコードを生成
          const qrCodeURL = await generateQRCode(data.id);

          const dataWithQR = { ...data, theme: theme as Theme, qrCodeURL };

          // 画像生成用の一時的なコンテナを作成
          const container = document.createElement('div');
          Object.assign(container.style, {
            position: 'absolute',
            left: '-9999px',
            top: '0',
            width: '794px',
            height: '1123px',
            backgroundColor,
            overflow: 'visible',
          });
          document.body.appendChild(container);

          // React 18のcreateRootを使用してコンポーネントをレンダリング
          const { createRoot } = await import('react-dom/client');
          const root = createRoot(container);

          // レンダリングとフォント読み込みを待機
          await new Promise<void>((resolve) => {
            root.render(<SetlistRenderer data={dataWithQR} className="setlist-image-generation" />);
            setTimeout(async () => {
              // フォントの読み込み完了を確認
              if (document.fonts?.ready) await document.fonts.ready;
              resolve();
            }, 500);
          });

          // レンダリングされた要素を取得
          const element = container.querySelector('.setlist-image-generation') as HTMLElement;
          if (!element) {
            throw new Error('Rendered element not found');
          }

          // html-to-imageでBlobを生成
          const blob = await toBlob(element, {
            pixelRatio: 2,
            cacheBust: true,
            backgroundColor,
            style: { opacity: '1', display: 'block' },
          });

          if (!blob) throw new Error('Failed to generate image blob');

          const imageURL = URL.createObjectURL(blob);

          // クリーンアップ
          root.unmount();
          document.body.removeChild(container);

          return imageURL;
        } catch (error) {
          showError(
            `${messages.common.generationError}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
          return null;
        } finally {
          setIsGenerating(false);
        }
      },
      [data, generateQRCode, messages.common.generationError, showError],
    );

    // プレビュー画像を生成
    const handleGeneratePreview = React.useCallback(async () => {
      if (onPreviewGenerationStart) {
        onPreviewGenerationStart();
      }
      const imageURL = await generateImage(selectedTheme);
      if (imageURL) {
        // 前のプレビュー画像URLを解放してから新しいURLを設定
        setPreviewImage((prevUrl) => {
          if (prevUrl) URL.revokeObjectURL(prevUrl);
          return imageURL;
        });
        if (onPreviewReady) {
          onPreviewReady(imageURL);
        }
      }
    }, [selectedTheme, generateImage, onPreviewGenerationStart, onPreviewReady]);

    // 画像をダウンロード
    const handleDownloadImage = React.useCallback(async () => {
      const imageURL = await generateImage(selectedTheme);
      if (imageURL) {
        // ダウンロードリンクを作成してクリック
        const link = document.createElement('a');
        link.href = imageURL;
        link.download = `setlist-${data.artistName}-${selectedTheme}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(imageURL);
        showSuccess(messages.setlistDetail.successMessage);
      }
    }, [
      selectedTheme,
      data.artistName,
      generateImage,
      showSuccess,
      messages.setlistDetail.successMessage,
    ]);

    // ダウンロード関数を親コンポーネントに渡す
    React.useEffect(() => {
      if (onDownloadReady) {
        onDownloadReady(handleDownloadImage);
      }
    }, [onDownloadReady, handleDownloadImage]);

    // テーマ変更時にプレビューをリセット
    React.useEffect(() => {
      setHasGenerated(false);
      setPreviewImage((prevUrl) => {
        if (prevUrl) URL.revokeObjectURL(prevUrl);
        return null;
      });
    }, [selectedTheme, data.id]);

    // コンポーネントのアンマウント時にプレビュー画像URLを解放
    useEffect(() => {
      return () => {
        if (previewImage) URL.revokeObjectURL(previewImage);
      };
    }, [previewImage]);

    // 初回レンダリング時に自動でプレビューを生成
    React.useEffect(() => {
      if (!hasGenerated && !isGenerating) {
        handleGeneratePreview();
        setHasGenerated(true);
      }
    }, [hasGenerated, isGenerating, handleGeneratePreview]);

    return (
      <Box>
        <Box sx={{ display: 'inline-flex', gap: 1, mb: 2 }}>
          <Button
            startIcon={isGenerating ? <CircularProgress size={20} /> : <ImageIcon />}
            onClick={handleDownloadImage}
            disabled={isGenerating}
            size="small"
          >
            {isGenerating ? messages.common.generating : messages.common.imageGeneration}
          </Button>
        </Box>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          {previewImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewImage}
              alt="Setlist Preview"
              style={{
                maxWidth: '100%',
                height: 'auto',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
              }}
            />
          )}
        </Box>
      </Box>
    );
  },
);

ImageGenerator.displayName = 'ImageGenerator';
