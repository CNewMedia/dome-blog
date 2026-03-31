import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { cloudinarySchemaPlugin } from 'sanity-plugin-cloudinary'
import { DocumentIcon, SparklesIcon, UsersIcon } from '@sanity/icons'
import { schemaTypes } from './sanity/schemas'
import { defaultDocumentNode, structure } from './sanity/structure'
import { resolveProductionUrl } from './sanity/resolveProductionUrl'

export default defineConfig({
  name: 'dome-auctions',
  title: 'Dome Auctions Blog',
  projectId: 'r1yazroc',
  dataset: 'production',
  plugins: [
    structureTool({ structure, defaultDocumentNode }),
    cloudinarySchemaPlugin(),
  ],
  document: {
    productionUrl: async (prev, context) => {
      const url = resolveProductionUrl(context.document as any)
      if (!url) return prev

      const path = url.replace('https://insights.dome-auctions.com', '') || '/'
      const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://insights.dome-auctions.com'
      const preview = new URL('/api/preview', base)

      if (process.env.SANITY_PREVIEW_SECRET) {
        preview.searchParams.set('secret', process.env.SANITY_PREVIEW_SECRET)
      }
      preview.searchParams.set('redirect', path)

      return preview.toString()
    },
  },
  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev,
      {
        id: 'sector-page-klassiek',
        title: 'Nieuwe sector page',
        schemaType: 'sectorPage',
        description: 'Klassieke sector-landing; paginatype staat op Sector.',
        icon: DocumentIcon,
        value: () => ({
          pageCategory: 'sector',
        }),
      },
      {
        id: 'sector-page-buyer',
        title: 'Nieuwe buyer page',
        schemaType: 'sectorPage',
        description: 'Doelgroeppagina voor kopers; vul sector-koppeling en slug in.',
        icon: UsersIcon,
        value: () => ({
          pageCategory: 'audience',
          audienceType: 'buyer',
        }),
      },
      {
        id: 'buyer-page-new',
        title: 'Nieuwe buyer registratiepagina',
        schemaType: 'buyerPage',
        description: 'Algemene veilingmeldingen / buyer registration; URL /{locale}/buyers/{slug}.',
        icon: SparklesIcon,
        value: () => ({}),
      },
    ],
  },
  basePath: '/studio',
})
