  exports.PERFORMANCE_CONFIG = {
  // Image optimization
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['ziro.space'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  
  // Route segments to prefetch
  prefetch: {
    routes: ['/work', '/pricing'],
  },
  
  // Cache control headers
  cacheControl: {
    static: 'public, max-age=31536000, immutable',
    dynamic: 'public, max-age=0, must-revalidate',
  }
} 