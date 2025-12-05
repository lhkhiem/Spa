'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fallbackSrc?: string;
}

export default function SafeImage({
  src,
  alt,
  fill,
  width,
  height,
  className = '',
  priority,
  sizes,
  fallbackSrc = '/images/placeholder-product.jpg',
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const imageSrc = hasError || !src ? fallbackSrc : src;

  // Use unoptimized for external images to avoid 404 errors in Next.js Image Optimization
  // This prevents console errors when image doesn't exist
  const isExternal = imageSrc.startsWith('http://') || imageSrc.startsWith('https://');
  const useUnoptimized = isExternal;

  if (fill) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className={className}
          priority={priority}
          sizes={sizes}
          unoptimized={useUnoptimized}
          onError={() => {
            if (!hasError) {
              setHasError(true);
            }
          }}
        />
      </div>
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
      unoptimized={useUnoptimized}
      onError={() => {
        if (!hasError) {
          setHasError(true);
        }
      }}
    />
  );
}



