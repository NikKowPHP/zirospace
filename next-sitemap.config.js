module.exports = {
  siteUrl: 'https://ziro.space',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/server-sitemap.xml'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://ziro.space/server-sitemap.xml',
    ],
  },
} 