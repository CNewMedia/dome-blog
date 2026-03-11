import type { MetadataRoute } from 'next'

const DOMAIN = 'https://insights.dome-auctions.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/studio', '/studio/', '/api/'] },
    ],
    sitemap: `${DOMAIN}/sitemap.xml`,
  }
}
