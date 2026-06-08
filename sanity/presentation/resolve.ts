import { defineLocations, type PresentationPluginOptions } from 'sanity/presentation'
import { getBuyerBasePath } from '../../lib/buyerPaths'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    sectorPage: defineLocations({
      select: {
        title: 'heroTitle',
        slug: 'slug.current',
        locale: 'locale',
      },
      resolve: (doc) => {
        if (!doc?.locale || !doc?.slug) return { locations: [] }
        return {
          locations: [
            {
              title: doc.title || doc.slug,
              href: `/${doc.locale}/${doc.slug}`,
            },
          ],
        }
      },
    }),
    buyerPage: defineLocations({
      select: {
        title: 'heroTitle',
        slug: 'slug.current',
        locale: 'locale',
      },
      resolve: (doc) => {
        if (!doc?.locale || !doc?.slug) return { locations: [] }
        const base = getBuyerBasePath(doc.locale)
        return {
          locations: [
            {
              title: doc.title || doc.slug,
              href: `/${doc.locale}/${base}/${doc.slug}`,
            },
          ],
        }
      },
    }),
    post: defineLocations({
      select: {
        title: 'title',
        slug: 'slug.current',
        locale: 'locale',
      },
      resolve: (doc) => {
        if (!doc?.locale || !doc?.slug) return { locations: [] }
        return {
          locations: [
            {
              title: doc.title || doc.slug,
              href: `/${doc.locale}/insights/${doc.slug}`,
            },
            {
              title: 'Insights overview',
              href: `/${doc.locale}/insights`,
            },
          ],
        }
      },
    }),
  },
}
