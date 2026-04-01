import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { cloudinarySchemaPlugin } from 'sanity-plugin-cloudinary'
import { DocumentIcon, SparklesIcon } from '@sanity/icons'
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
    newDocumentOptions: (prev, context) => {
      const creationContext = (context as any)?.creationContext as Record<string, unknown> | undefined
      if (!creationContext || creationContext.type !== 'structure') return prev

      // Sanity's structure creation context shape varies by version/tooling.
      // Use a defensive text snapshot to detect our locale pane ids.
      const ctxText = JSON.stringify(creationContext)
      const inBuyerLocalePane = ctxText.includes('lp-buyer-locale-')
      const inSectorLocalePane = ctxText.includes('lp-sector-locale-')

      if (inBuyerLocalePane) {
        return prev.filter((item) => item.templateId === 'buyer-page-new')
      }

      if (inSectorLocalePane) {
        return prev.filter((item) => item.templateId === 'sector-page-klassiek')
      }

      return prev
    },
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
        id: 'buyer-page-new',
        title: 'Nieuwe buyer registratiepagina',
        schemaType: 'buyerPage',
        description: 'Algemene veilingmeldingen / buyer registration; URL /{locale}/{kopers|acheteurs|buyers}/{slug}.',
        icon: SparklesIcon,
        value: () => ({}),
      },
    ],
  },
  basePath: '/studio',
})
