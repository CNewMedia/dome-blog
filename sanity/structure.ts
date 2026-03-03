import { StructureBuilder } from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Dome Auctions Blog')
    .items([
      S.listItem().title('Blog Posts').schemaType('post').child(
        S.documentList().title('Blog Posts').filter('_type == "post"').defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
      ),
      S.listItem().title('Categories').schemaType('category').child(
        S.documentList().title('Categories').filter('_type == "category"')
      ),
      S.listItem().title('Sector Landing Pages').schemaType('sectorPage').child(
        S.documentList().title('Sector Landing Pages').filter('_type == "sectorPage"')
      ),
      // Media library (sanity-plugin-media): list item id must match tool name so the plugin opens
      S.listItem().title('Media').id('media'),
    ])
