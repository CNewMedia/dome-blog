import type { MetadataRoute } from 'next'
import { client } from '../sanity/client'
import { getSectorSlugs, getInsightSlugs, getBuyerSlugs } from '../sanity/queries'
import { activeLocales } from '../i18n/locales'
import { getBuyerBasePath } from '../lib/buyerPaths'

const DOMAIN = 'https://insights.dome-auctions.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [sectorPages, insightSlugs, buyerPages] = await Promise.all([
    client.fetch(getSectorSlugs) as Promise<{ slug: string; locale: string }[]>,
    client.fetch(getInsightSlugs) as Promise<{ slug: string; locale: string }[]>,
    client.fetch(getBuyerSlugs) as Promise<{ slug: string; locale: string }[]>,
  ])

  const entries: MetadataRoute.Sitemap = []

  for (const locale of activeLocales) {
    entries.push({
      url: `${DOMAIN}/${locale}/insights`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    })
  }

  for (const row of insightSlugs) {
    if (row.slug && row.locale) {
      entries.push({
        url: `${DOMAIN}/${row.locale}/articles/${row.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  for (const row of sectorPages) {
    if (row.slug && row.locale) {
      entries.push({
        url: `${DOMAIN}/${row.locale}/${row.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }
  }

  for (const row of buyerPages) {
    if (row.slug && row.locale) {
      entries.push({
        url: `${DOMAIN}/${row.locale}/${getBuyerBasePath(row.locale)}/${row.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.75,
      })
    }
  }

  return entries
}
