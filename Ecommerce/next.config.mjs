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
      {
        protocol: 'http',
        hostname: '14.225.205.116',
        port: '3011',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: 'banyco-demo.pressup.vn',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'banyco-demo.pressup.vn',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: 'admin.banyco-demo.pressup.vn',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'admin.banyco-demo.pressup.vn',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: 'api.banyco-demo.pressup.vn',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'api.banyco-demo.pressup.vn',
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
