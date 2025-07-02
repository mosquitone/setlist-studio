'use client';

import { useState, useRef, useCallback } from 'react';

interface UseImageGenerationProps {
  onSuccess?: () => void;
}

export function useImageGeneration({ onSuccess }: UseImageGenerationProps = {}) {
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const downloadFunctionRef = useRef<(() => Promise<void>) | null>(null);

  const handleDownloadReady = useCallback((downloadFn: () => Promise<void>) => {
    downloadFunctionRef.current = downloadFn;
  }, []);

  const handlePreviewReady = useCallback((imageUrl: string) => {
    setPreviewImage(imageUrl);
    setIsGeneratingPreview(false);
  }, []);

  const handlePreviewGenerationStart = useCallback(() => {
    setIsGeneratingPreview(true);
  }, []);

  const handleDownload = useCallback(async () => {
    if (downloadFunctionRef.current) {
      await downloadFunctionRef.current();
      onSuccess?.();
    }
  }, [onSuccess]);

  const handleDebugToggle = useCallback(() => {
    setShowDebug(prev => !prev);
  }, []);

  const resetPreview = useCallback(() => {
    setIsGeneratingPreview(true);
    setPreviewImage(null);
  }, []);

  return {
    isGeneratingPreview,
    previewImage,
    showDebug,
    handleDownloadReady,
    handlePreviewReady,
    handlePreviewGenerationStart,
    handleDownload,
    handleDebugToggle,
    resetPreview,
  };
}
