'use client';

import React from 'react';

interface ParallaxSectionProps {
  backgroundImage: string;
  children: React.ReactNode;
  minHeight?: 'full' | 'tall' | 'medium' | 'short';
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: string;
  className?: string;
}

/**
 * ParallaxSection - TRUE Duda-style parallax scrolling effect
 * 
 * DESKTOP: Background attachment fixed (parallax effect)
 * MOBILE/TABLET: Background attachment scroll (normal scrolling)
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
  overlayColor = 'bg-black',
  overlayOpacity = 'bg-opacity-60',
  className = '',
}: ParallaxSectionProps) {
  // Map height presets
  const heightClasses = {
    full: 'min-h-screen',
    tall: 'min-h-[40vh] sm:min-h-[50vh] lg:min-h-[60vh]',
    medium: 'min-h-[30vh] sm:min-h-[40vh] lg:min-h-[50vh]',
    short: 'min-h-[25vh] sm:min-h-[30vh] lg:min-h-[40vh]',
  };

  return (
    <>
      <section
        className={`parallax-section relative overflow-hidden ${heightClasses[minHeight]} ${className}`}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll', // Default for mobile
        }}
      >
        {/* Overlay for better text visibility */}
        {overlay && (
          <div className={`absolute inset-0 ${overlayColor} ${overlayOpacity}`} />
        )}

        {/* Content wrapper */}
        <div className="parallax-inner relative z-10 flex items-center justify-center min-h-[inherit] w-full px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </section>

      {/* CSS for parallax effect - desktop only */}
      <style jsx>{`
        /* Mobile and Tablet: Normal scroll (no parallax) */
        .parallax-section {
          background-attachment: scroll;
        }

        /* Desktop (lg breakpoint): Enable parallax with fixed background */
        @media (min-width: 1024px) {
          .parallax-section {
            background-attachment: fixed;
          }
        }
      `}</style>
    </>
  );
}
