import { StructureBuilder } from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Dome Auctions Blog')
    .items([
      S.listItem()
        .title('Site Instellingen')
        .schemaType('siteSettings')
        .child(
          S.editor()
            .id('siteSettings')
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
      S.listItem()
        .title('Site Chrome')
        .schemaType('siteChrome')
        .child(
          S.documentList()
            .title('Site Chrome')
            .filter('_type == "siteChrome"')
            .defaultOrdering([{ field: 'locale', direction: 'asc' }])
        ),
      S.listItem().title('Blog Posts').schemaType('post').child(
        S.documentList().title('Blog Posts').filter('_type == "post"').defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
      ),
      S.listItem().title('Categories').schemaType('category').child(
        S.documentList().title('Categories').filter('_type == "category"')
      ),
      S.listItem()
        .title('Sector Landing Pages')
        .child(
          S.list()
            .title('Sector Landing Pages')
            .items([
              S.listItem()
                .title('Woodworking')
                .id('sector-woodworking')
                .child(
                  S.documentList()
                    .title('Woodworking')
                    .schemaType('sectorPage')
                    .filter('_type == "sectorPage" && sector == "woodworking"')
                    .defaultOrdering([{ field: 'locale', direction: 'asc' }])
                ),
              S.listItem()
                .title('Metalworking')
                .id('sector-metalworking')
                .child(
                  S.documentList()
                    .title('Metalworking')
                    .schemaType('sectorPage')
                    .filter('_type == "sectorPage" && sector == "metalworking"')
                    .defaultOrdering([{ field: 'locale', direction: 'asc' }])
                ),
              S.listItem()
                .title('Construction')
                .id('sector-construction')
                .child(
                  S.documentList()
                    .title('Construction')
                    .schemaType('sectorPage')
                    .filter('_type == "sectorPage" && sector == "construction"')
                    .defaultOrdering([{ field: 'locale', direction: 'asc' }])
                ),
              S.listItem()
                .title('Agriculture')
                .id('sector-agriculture')
                .child(
                  S.documentList()
                    .title('Agriculture')
                    .schemaType('sectorPage')
                    .filter('_type == "sectorPage" && sector == "agriculture"')
                    .defaultOrdering([{ field: 'locale', direction: 'asc' }])
                ),
              S.listItem()
                .title('Transport')
                .id('sector-transport')
                .child(
                  S.documentList()
                    .title('Transport')
                    .schemaType('sectorPage')
                    .filter('_type == "sectorPage" && sector == "transport"')
                    .defaultOrdering([{ field: 'locale', direction: 'asc' }])
                ),
            ])
        ),
      S.listItem()
        .title('Team')
        .schemaType('teamMember')
        .child(
          S.documentList()
            .title('Team')
            .filter('_type == "teamMember"')
            .defaultOrdering([{ field: 'volgorde', direction: 'asc' }])
        ),
    ])
