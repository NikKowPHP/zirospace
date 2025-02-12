const createNextIntlPlugin = require('next-intl/plugin');
const withBundleAnalyzer = require('@next/bundle-analyzer');
const { PERFORMANCE_CONFIG } = require('./src/config/performance');

const withNextIntl = createNextIntlPlugin();
const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

const config = {
  // Image optimization
  images: {
    domains: ['localhost', 'ziro.space', 'drive.google.com', 'i.ibb.co', 'i.postimg.cc', 'i.ytimg.com'],
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

  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: true,
        minimize: true,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          cacheGroups: {
            default: false,
            vendors: false,
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /[\\/]node_modules[\\/]/,
              priority: 20,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      };
    }
    return config;
  },

  // Headers optimization
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Powered by header removal & React strict mode
  poweredByHeader: false,
  reactStrictMode: true,
};

// Install critters for CSS optimization
try {
  require('critters');
} catch (e) {
  console.warn('Installing critters...');
  require('child_process').execSync('npm install critters');
}

// Export your configuration using CommonJS
module.exports = withNextIntl(withAnalyzer(config));
