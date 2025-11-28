import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToasterProvider } from '@/components/providers/ToasterProvider';
import Script from 'next/script';
import { Suspense } from 'react';
import AnalyticsTracker from '@/components/AnalyticsTracker';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

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
    url: process.env.NEXT_PUBLIC_SITE_URL,
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
      <body className={inter.className}>
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <ToasterProvider />
        {children}
      </body>
    </html>
  );
}
