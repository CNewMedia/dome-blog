import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { cloudinarySchemaPlugin } from 'sanity-plugin-cloudinary'
import { DocumentIcon, SparklesIcon } from '@sanity/icons'
import { schemaTypes } from './sanity/schemas'
import { structure } from './sanity/structure'

export default defineConfig({
  name: 'dome-auctions',
  title: 'Dome Auctions Blog',
  projectId: 'r1yazroc',
  dataset: 'production',
  plugins: [
    structureTool({ structure }),
    cloudinarySchemaPlugin(),
  ],
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
        description: 'Algemene veilingmeldingen / buyer registration; URL /{locale}/buyers/{slug}.',
        icon: SparklesIcon,
        value: () => ({}),
      },
    ],
  },
  basePath: '/studio',
})
