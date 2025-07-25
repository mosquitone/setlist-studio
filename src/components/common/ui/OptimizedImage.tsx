import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  fallbackSrc?: string;
}

export default function OptimizedImage({ src, fallbackSrc, alt, ...props }: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (fallbackSrc && !hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  // WebP対応のため、拡張子を自動的に変換
  const webpSrc = imgSrc.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  const originalSrc = imgSrc;

  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <Image
        {...props}
        src={hasError ? originalSrc : webpSrc}
        alt={alt}
        onError={handleError}
        loading={props.priority ? undefined : 'lazy'}
      />
    </picture>
  );
}
