const createNextIntlPlugin = require('next-intl/plugin')
const withBundleAnalyzer = require('@next/bundle-analyzer')
const { PERFORMANCE_CONFIG } = require('./src/config/performance')

const withNextIntl = createNextIntlPlugin()
const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
})

const config = {
  // Disable font optimization to prevent build issues with Google Fonts
  optimizeFonts: false,

  // Image optimization
  images: {
    domains: [
      "*",
      "i.postimg.cc",
      "i.ytimg.com",
      "picsum.photos"
    ],
    deviceSizes: PERFORMANCE_CONFIG.images.deviceSizes,
    imageSizes: PERFORMANCE_CONFIG.images.imageSizes,
    minimumCacheTTL: PERFORMANCE_CONFIG.images.minimumCacheTTL,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Enable compression
  compress: true,

  // Experimental features
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    turbo: {
      rules: {
        '*.png': ['file-loader'],
        '*.svg': ['@svgr/webpack'],
        '*.jpg': ['file-loader'],
        '*.jpeg': ['file-loader'],
      },
      resolveAlias: {
        '@': './src',
      },
    },
    optimizePackageImports: [
      '@heroicons/react',
      '@iconify/react',
      'clsx',
      'tailwind-merge',
    ],
    webpackBuildWorker: true,
  },

  // Headers optimization
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ]
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/:path*',
        destination: 'https://ziro.health/:path*',
        permanent: true,
        has: [
          {
            type: 'host',
            value: 'ziro.space',
          },
        ],
      },
    ]
  },

  // Powered by header removal & React strict mode
  poweredByHeader: false,
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
}

// Export your configuration using CommonJS
module.exports = withNextIntl(withAnalyzer(config))
