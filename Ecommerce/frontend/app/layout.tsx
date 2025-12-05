import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToasterProvider } from '@/components/providers/ToasterProvider';
import Script from 'next/script';
import { Suspense } from 'react';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import { FaviconProvider } from '@/components/FaviconProvider';

// Optimized font loading - only load Inter with Vietnamese subset and necessary weights
// Using 'optional' for faster FCP - font will use system fallback if not ready
const inter = Inter({ 
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'optional', // Faster FCP - won't block rendering
  preload: true,
  weight: ['400', '500', '600', '700'],
  adjustFontFallback: true,
});

// Get site URL for metadata (must be static value, not function call)
const getMetadataSiteUrl = (): string => {
  // Use env var directly for metadata (must be serializable)
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl;
  
  // Fallback for production
  if (process.env.NODE_ENV === 'production') {
    return 'https://banyco.vn';
  }
  
  // Development fallback
  return 'http://localhost:3000';
};

export const metadata: Metadata = {
  title: {
    default: 'Banyco - Spa & Salon Supplies, Products, and Equipment',
    template: '%s | Banyco',
  },
  description: 'Leading supplier of spa and salon supplies, professional skincare products, massage equipment, and wellness solutions for estheticians, massage therapists, and beauty professionals.',
  keywords: ['spa supplies', 'salon equipment', 'skincare products', 'massage supplies', 'beauty products', 'esthetician supplies'],
  authors: [{ name: 'Banyco' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: getMetadataSiteUrl(),
    siteName: 'Banyco',
    title: 'Banyco - Spa & Salon Supplies',
    description: 'Leading supplier of spa and salon supplies, products, and equipment',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Banyco',
    description: 'Leading supplier of spa and salon supplies',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable}>
      <head>
        {/* Resource hints for API - improve connection speed */}
        <link rel="dns-prefetch" href="https://ecommerce-api.banyco.vn" />
        <link rel="preconnect" href="https://ecommerce-api.banyco.vn" crossOrigin="anonymous" />
        {/* Preconnect for images - critical for LCP */}
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        {/* Preconnect for Google Analytics */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {/* Google Analytics - Defer to not block rendering */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XJGRHQTJEF"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XJGRHQTJEF');
          `}
        </Script>
      </head>
      <body className={`${inter.className} bg-white`}>
        <FaviconProvider />
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <ToasterProvider />
        {children}
      </body>
    </html>
  );
}
