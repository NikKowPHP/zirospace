module.exports = {
  siteUrl: 'https://ziro.agency',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/server-sitemap.xml'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://ziro.agency/server-sitemap.xml',
    ],
  },
} 