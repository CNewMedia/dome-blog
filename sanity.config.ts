import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { cloudinarySchemaPlugin } from 'sanity-plugin-cloudinary'
import { DocumentIcon, UsersIcon } from '@sanity/icons'
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
    ],
  },
  basePath: '/studio',
})
