import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToasterProvider } from '@/components/providers/ToasterProvider';
import Script from 'next/script';
import { Suspense } from 'react';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import { FaviconProvider } from '@/components/FaviconProvider';
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
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
        {/* Preload Google Fonts for content - Load các font phổ biến với đầy đủ weights */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Load các font Sans-serif phổ biến cho tiếng Việt */}
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Open+Sans:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Nunito+Sans:wght@400;600;700&family=Be+Vietnam+Pro:wght@400;500;600;700&family=Source+Sans+Pro:wght@400;600;700&family=Raleway:wght@400;500;600;700&family=Lato:wght@400;700&family=Ubuntu:wght@400;500;700&display=swap&subset=latin,vietnamese"
          rel="stylesheet"
        />
        {/* Load các font Serif */}
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Merriweather:wght@400;700&family=Playfair+Display:wght@400;500;600;700&display=swap&subset=latin,vietnamese"
          rel="stylesheet"
        />
        {/* Load các font Display/Decorative */}
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Pacifico&display=swap&subset=latin,vietnamese"
          rel="stylesheet"
        />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XJGRHQTJEF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
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
