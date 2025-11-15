/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3011',
        pathname: '**', // Cho phép load ảnh từ CMS (ví dụ /uploads/..)
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3011',
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
