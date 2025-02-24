module.exports = {
  siteUrl: 'https://www.ziro.space',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/server-sitemap.xml'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://www.ziro.space/server-sitemap.xml',
    ],
  },
} 