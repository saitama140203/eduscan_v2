// @ts-check

import withBundleAnalyzer from "@next/bundle-analyzer";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  experimental: {
    // Enable turbo mode for faster builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    // Enable optimizePackageImports for better tree shaking
    optimizePackageImports: [
      '@radix-ui/react-icons',
      'lucide-react',
      '@hookform/resolvers',
      'react-hook-form',
      'zod'
    ],
  },

  // Server external packages (moved from experimental)
  serverExternalPackages: ['@prisma/client'],

  // Compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  // Bundle analyzer (optional, uncomment to analyze bundle)
  // bundleAnalyzer: {
  //   enabled: process.env.ANALYZE === 'true',
  // },

  // Webpack optimizations
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle splitting
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk for React & Next.js
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /(?:react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // Vendor chunk for UI libraries
          lib: {
            test: /[\\/]node_modules[\\/](@radix-ui|lucide-react|class-variance-authority|clsx|tailwind-merge)[\\/]/,
            name: 'lib',
            priority: 30,
            chunks: 'all',
          },
          // Commons chunk for shared components
          commons: {
            name: 'commons',
            minChunks: 2,
            chunks: 'all',
            priority: 20,
          },
        },
      };
    }

    // Optimize for development
    if (dev) {
      // Faster builds in development
      config.optimization = {
        ...config.optimization,
        // splitChunks: false,
        // Speed up rebuilds
        removeAvailableModules: false,
        removeEmptyChunks: false,
      };
    }

    return config;
  },

  // Headers for better caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Disable x-powered-by header
  poweredByHeader: false,

  // Enable strict mode for better debugging
  reactStrictMode: true,

  // Disable source maps in production for better performance
  productionBrowserSourceMaps: false,

  // ESLint configuration
  eslint: {
    // Only run ESLint on these directories during build
    dirs: ['app', 'components', 'hooks', 'lib'],
    // Allow production builds even with ESLint warnings
    ignoreDuringBuilds: false,
  },

  // TypeScript configuration
  typescript: {
    // Allow production builds even with TypeScript errors (not recommended)
    ignoreBuildErrors: false,
  },

  // Redirects for better SEO
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },

  // Rewrites to proxy API calls to backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/:path*`,
      },
    ];
  },
};

const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzerConfig(nextConfig);
