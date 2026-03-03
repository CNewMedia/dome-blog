import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { media } from 'sanity-plugin-media'
import { schemaTypes } from './sanity/schemas'
import { structure } from './sanity/structure'

export default defineConfig({
  name: 'dome-auctions',
  title: 'Dome Auctions Blog',
  projectId: 'r1yazroc',
  dataset: 'production',
  plugins: [
    structureTool({ structure }),
    media({
      // Optional: enable credit line and set max upload size (bytes)
      creditLine: { enabled: true },
      directUploads: true,
    }),
  ],
  schema: { types: schemaTypes },
  basePath: '/studio',
})
