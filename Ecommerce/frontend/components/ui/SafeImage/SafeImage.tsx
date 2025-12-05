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

  // Optimize external images through Next.js Image Optimization
  // Enable optimization for external images - Next.js config handles remotePatterns
  const useUnoptimized = false;

  // Default sizes for responsive images if not provided
  const defaultSizes = sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

  if (fill) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className={className}
          priority={priority}
          sizes={defaultSizes}
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
      sizes={defaultSizes}
      unoptimized={useUnoptimized}
      onError={() => {
        if (!hasError) {
          setHasError(true);
        }
      }}
    />
  );
}




