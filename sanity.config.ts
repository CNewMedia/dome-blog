import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemas'
import { structure } from './sanity/structure'

export default defineConfig({
  name: 'dome-auctions',
  title: 'Dome Auctions Blog',
  projectId: 'r1yazroc',
  dataset: 'production',
  plugins: [
    structureTool({ structure }),
  ],
  schema: { types: schemaTypes },
  basePath: '/studio',
})
