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
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
}

export default nextConfig
