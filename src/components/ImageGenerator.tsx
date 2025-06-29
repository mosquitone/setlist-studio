'use client';

import React, { useState } from 'react';
import { Box, Button, Alert, CircularProgress } from '@mui/material';
import { Download as DownloadIcon, Image as ImageIcon } from '@mui/icons-material';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import { SetlistData } from './setlist-themes/types';
import { SetlistRenderer } from './setlist-themes/SetlistRenderer';

interface ImageGeneratorProps {
  data: SetlistData;
  baseUrl?: string;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ 
  data, 
  baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);

  const generateQRCode = async (setlistId: string): Promise<string> => {
    const url = `${baseUrl}/setlists/${setlistId}`;
    try {
      const qrCodeDataURL = await QRCode.toDataURL(url, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      return qrCodeDataURL;
    } catch (err) {
      console.error('Error generating QR code:', err);
      return '';
    }
  };

  const generateImage = async (theme: string): Promise<string | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      // Generate QR code
      const qrCodeURL = await generateQRCode(data.id);
      
      // Create data with QR code
      const dataWithQR = { ...data, theme: theme as any, qrCodeURL };

      // Create a temporary container
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.width = 'auto';
      container.style.height = 'auto';
      document.body.appendChild(container);

      // Create React root and render component
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(container);
      
      // Render the component
      await new Promise<void>((resolve) => {
        root.render(
          <SetlistRenderer 
            data={dataWithQR} 
            className="setlist-image-generation"
          />
        );
        // Wait for rendering to complete
        setTimeout(resolve, 1000);
      });

      // Find the rendered element
      const element = container.querySelector('.setlist-image-generation') as HTMLElement;
      if (!element) {
        throw new Error('Rendered element not found');
      }

      // Generate image with html2canvas
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      // Convert to blob URL
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/png', 1);
      });

      const imageURL = URL.createObjectURL(blob);

      // Cleanup
      root.unmount();
      document.body.removeChild(container);

      return imageURL;
    } catch (err) {
      console.error('Error generating image:', err);
      setError(`画像生成エラー: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async (theme: string) => {
    const imageURL = await generateImage(theme);
    if (imageURL) {
      setGeneratedImages(prev => ({ ...prev, [theme]: imageURL }));
    }
  };

  const handleDownloadImage = (theme: string) => {
    const imageURL = generatedImages[theme];
    if (imageURL) {
      const link = document.createElement('a');
      link.href = imageURL;
      link.download = `setlist-${data.bandName}-${theme}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleGenerateAllImages = async () => {
    const themes = ['basic', 'mqtn', 'minimal', 'mqtn2'];
    setIsGenerating(true);
    
    try {
      for (const theme of themes) {
        await handleGenerateImage(theme);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const themes = [
    { key: 'basic', label: 'Basic' },
    { key: 'mqtn', label: 'MQTN' },
    { key: 'minimal', label: 'Minimal' },
    { key: 'mqtn2', label: 'MQTN2' },
  ];

  return (
    <Box sx={{ mt: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={isGenerating ? <CircularProgress size={20} /> : <ImageIcon />}
          onClick={handleGenerateAllImages}
          disabled={isGenerating}
          size="large"
        >
          {isGenerating ? '生成中...' : '全テーマの画像を生成'}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {themes.map((theme) => (
          <Box key={theme.key} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<ImageIcon />}
              onClick={() => handleGenerateImage(theme.key)}
              disabled={isGenerating}
              size="small"
            >
              {theme.label}を生成
            </Button>
            
            {generatedImages[theme.key] && (
              <Button
                variant="contained"
                color="success"
                startIcon={<DownloadIcon />}
                onClick={() => handleDownloadImage(theme.key)}
                size="small"
              >
                {theme.label}をダウンロード
              </Button>
            )}
          </Box>
        ))}
      </Box>

      {/* Preview generated images */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {Object.entries(generatedImages).map(([theme, imageURL]) => (
          <Box key={theme} sx={{ maxWidth: 200 }}>
            <img
              src={imageURL}
              alt={`${theme} theme preview`}
              style={{
                width: '100%',
                height: 'auto',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};