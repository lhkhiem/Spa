import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Import DOM patch EARLY - before React components
import "@/lib/dom-safe-patch";
import { DOMPatchScript } from "@/components/dom-patch-script";
import { ThemeProvider } from "@/hooks/use-theme";
import { AppearanceProvider } from "@/hooks/use-appearance";
import { FaviconProvider } from "@/components/FaviconProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Banyco CMS - Bảng điều khiển",
  description: "Hệ thống quản lý nội dung hiện đại",
};

// DOM patch is now imported from @/lib/dom-safe-patch

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <DOMPatchScript />
        <FaviconProvider />
        <ThemeProvider defaultTheme="light" storageKey="pressup-cms-theme">
          <AppearanceProvider>
            {children}
          </AppearanceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
