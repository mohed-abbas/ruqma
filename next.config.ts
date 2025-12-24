import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // =============================================================================
  // IMAGE OPTIMIZATION
  // =============================================================================
  images: {
    // Modern image formats for better performance
    formats: ['image/avif', 'image/webp'],

    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],

    // Image sizes for different breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Allow images from external domains
    remotePatterns: [
      // Sanity CDN for CMS images
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },

  // =============================================================================
  // PERFORMANCE OPTIMIZATIONS
  // =============================================================================

  // Enable Gzip compression for better transfer speeds
  compress: true,

  // Remove X-Powered-By header for security
  poweredByHeader: false,

  // Strict mode for better React practices
  reactStrictMode: true,

  // =============================================================================
  // SECURITY HEADERS
  // =============================================================================
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          // Prevent clickjacking attacks
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Control referrer information
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          // Enable browser XSS protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Permissions Policy (formerly Feature Policy)
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // =============================================================================
  // WEBPACK CONFIGURATION
  // =============================================================================
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable filesystem cache in development to prevent corruption
      // when files are modified by external tools (like Claude Code)
      config.cache = false;
    }
    return config;
  },

  // =============================================================================
  // REDIRECTS (if needed)
  // =============================================================================
  // async redirects() {
  //   return [
  //     {
  //       source: '/old-path',
  //       destination: '/new-path',
  //       permanent: true,
  //     },
  //   ];
  // },

  // =============================================================================
  // REWRITES (for API proxying if needed)
  // =============================================================================
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'https://api.example.com/:path*',
  //     },
  //   ];
  // },
};

export default nextConfig;
