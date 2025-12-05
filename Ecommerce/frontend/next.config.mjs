/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static export to allow dynamic pages
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: process.env.NEXT_PUBLIC_API_PORT || '3012',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: process.env.NEXT_PUBLIC_API_PORT || '3012',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: 'ecommerce-api.banyco.vn',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'ecommerce-api.banyco.vn',
        pathname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    // Optimize image sizes for mobile performance
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  // Enable compression and optimization
  compress: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Note: optimizeCss requires Next.js 15+ or critters package, disabled for Next.js 14
}

export default nextConfig
