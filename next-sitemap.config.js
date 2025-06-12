module.exports = {
  siteUrl: 'https://www.ziro.health',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/server-sitemap.xml'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://www.ziro.health/server-sitemap.xml',
    ],
  },
} 