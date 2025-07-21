'use client';

import React, { useState, useEffect } from 'react';
import { Box, Alert, CircularProgress } from '@mui/material';
import { Button } from '@/components/common/ui/Button';
import { Image as ImageIcon } from '@mui/icons-material';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import { SetlistData } from '@/types/components';
import { Theme } from '@/types/common';
import { SetlistRenderer } from '../setlist-themes/SetlistRenderer';
import { isValidUrl } from '@/lib/security/security-utils';
import { useI18n } from '@/hooks/useI18n';

interface ImageGeneratorProps {
  data: SetlistData;
  selectedTheme: Theme;
  onDownloadReady?: (downloadFn: () => Promise<void>) => void;
  onPreviewReady?: (imageUrl: string) => void;
  onPreviewGenerationStart?: () => void;
  baseUrl?: string;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({
  data,
  selectedTheme,
  onDownloadReady,
  onPreviewReady,
  onPreviewGenerationStart,
  baseUrl = typeof window !== 'undefined' ? window.location.origin : '',
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const { messages } = useI18n();

  const generateQRCode = React.useCallback(
    async (setlistId: string): Promise<string> => {
      const url = `${baseUrl}/setlists/${setlistId}`;

      // Validate the URL before generating QR code
      if (!isValidUrl(url)) {
        return '';
      }

      try {
        const qrCodeDataURL = await QRCode.toDataURL(url, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });

        // Additional validation for the generated data URL
        if (!qrCodeDataURL.startsWith('data:image/')) {
          return '';
        }

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
      setError(null);

      try {
        // Temporarily disable QR code for image generation
        const qrCodeURL = await generateQRCode(data.id);

        // Create data with QR code
        const dataWithQR = { ...data, theme: theme as Theme, qrCodeURL };

        // Create a temporary container for rendering
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
          root.render(<SetlistRenderer data={dataWithQR} className="setlist-image-generation" />);
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
          scale: 1,
          logging: false,
          useCORS: false,
          allowTaint: false,
        });

        // Convert to blob URL
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
            },
            'image/png',
            1,
          );
        });

        const imageURL = URL.createObjectURL(blob);

        // Cleanup
        root.unmount();
        document.body.removeChild(container);

        return imageURL;
      } catch (error) {
        setError(
          `${messages.common.generationError}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [data, baseUrl, generateQRCode],
  );

  const handleGeneratePreview = React.useCallback(async () => {
    if (onPreviewGenerationStart) {
      onPreviewGenerationStart();
    }
    const imageURL = await generateImage(selectedTheme);
    if (imageURL) {
      // Clean up previous preview image URL
      setPreviewImage((prevUrl) => {
        if (prevUrl) {
          URL.revokeObjectURL(prevUrl);
        }
        return imageURL;
      });
      if (onPreviewReady) {
        onPreviewReady(imageURL);
      }
    }
  }, [selectedTheme, generateImage, onPreviewGenerationStart, onPreviewReady]);

  const handleDownloadImage = React.useCallback(async () => {
    const imageURL = await generateImage(selectedTheme);
    if (imageURL) {
      const link = document.createElement('a');
      link.href = imageURL;
      link.download = `setlist-${data.bandName}-${selectedTheme}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(imageURL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTheme, data.bandName]);

  React.useEffect(() => {
    if (onDownloadReady) {
      onDownloadReady(handleDownloadImage);
    }
  }, [onDownloadReady, handleDownloadImage]);

  // Reset generation flag when theme changes
  React.useEffect(() => {
    setHasGenerated(false);
    setPreviewImage((prevUrl) => {
      if (prevUrl) {
        URL.revokeObjectURL(prevUrl);
      }
      return null;
    });
  }, [selectedTheme, data.id]);

  // Cleanup preview image on unmount
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  // Auto-generate preview when not generated yet
  React.useEffect(() => {
    if (!hasGenerated && !isGenerating) {
      handleGeneratePreview();
      setHasGenerated(true);
    }
  }, [hasGenerated, isGenerating, handleGeneratePreview]);

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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

      {/* Preview Section */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        {previewImage && (
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
};
