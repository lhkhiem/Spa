import React from 'react';

interface ParallaxSectionProps {
  backgroundImage: string;
  children: React.ReactNode;
  minHeight?: 'full' | 'tall' | 'medium' | 'short';
  overlay?: boolean;
  overlayOpacity?: number;
  className?: string;
}

/**
 * ParallaxSection - Duda-style parallax scrolling effect
 * 
 * DESKTOP: Background stays fixed while content scrolls (parallax effect)
 * MOBILE: Normal scrolling (no parallax to avoid mobile browser bugs)
 * 
 * Usage:
 * <ParallaxSection backgroundImage="/images/hero.jpg">
 *   <h1>Your Title</h1>
 *   <p>Your content</p>
 * </ParallaxSection>
 */
export default function ParallaxSection({
  backgroundImage,
  children,
  minHeight = 'tall',
  overlay = true,
  overlayOpacity = 50,
  className = '',
}: ParallaxSectionProps) {
  // Map height presets
  const heightClasses = {
    full: 'min-h-screen',
    tall: 'min-h-[60vh] md:min-h-[60vh] sm:min-h-[50vh]',
    medium: 'min-h-[50vh] md:min-h-[50vh] sm:min-h-[40vh]',
    short: 'min-h-[40vh] md:min-h-[40vh] sm:min-h-[30vh]',
  };

  return (
    <section
      className={`parallax-section relative overflow-hidden ${heightClasses[minHeight]} ${className}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay for better text visibility */}
      {overlay && (
        <div 
          className="absolute inset-0 bg-black z-10" 
          style={{ opacity: overlayOpacity / 100 }}
        />
      )}

      {/* Content wrapper */}
      <div className="parallax-inner relative z-20 flex items-center justify-center w-full h-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </div>
    </section>
  );
}
