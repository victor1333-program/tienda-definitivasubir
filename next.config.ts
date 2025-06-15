import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations for production
  experimental: {
    optimizeServerReact: true,
  },
  
  // Compression and caching
  compress: true,
  poweredByHeader: false,
  
  // Build optimizations for VPS
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false, // Enabled for production
  },
  
  // Image optimizations
  images: {
    formats: ['image/webp', 'image/avif'],
    domains: ['images.unsplash.com', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
    minimumCacheTTL: 86400, // 24 hours cache
  },
  
  // Bundle optimization
  webpack: (config, { isServer }) => {
    // Production optimizations
    if (process.env.NODE_ENV === 'production') {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
        minimize: true,
      };
    }
    
    return config;
  },
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Deployment configuration for VPS
  trailingSlash: false,
  output: 'standalone',
};

export default nextConfig;
