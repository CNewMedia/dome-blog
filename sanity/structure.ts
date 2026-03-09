import { StructureBuilder } from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Dome Auctions Insights')
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
      S.listItem()
        .title('Insights')
        .child(
          S.list()
            .title('Insights')
            .items([
              S.listItem()
                .title('NL-BE')
                .child(
                  S.documentList()
                    .title('Insights – NL-BE')
                    .schemaType('post')
                    .filter('_type == "post" && locale == "nl-be"')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('FR-BE')
                .child(
                  S.documentList()
                    .title('Insights – FR-BE')
                    .schemaType('post')
                    .filter('_type == "post" && locale == "fr-be"')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                ),
              S.listItem()
                .title('EN-BE')
                .child(
                  S.documentList()
                    .title('Insights – EN-BE')
                    .schemaType('post')
                    .filter('_type == "post" && locale == "en-be"')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                ),
            ])
        ),
      S.listItem()
        .title('Landing Pages')
        .child(
          S.list()
            .title('Landing Pages')
            .items([
              S.listItem()
                .title('All landing pages')
                .child(
                  S.documentList()
                    .title('All landing pages')
                    .schemaType('sectorPage')
                    .filter('_type == "sectorPage"')
                    .defaultOrdering([{ field: 'locale', direction: 'asc' }])
                ),
              S.listItem()
                .title('Landing pages – NL-BE')
                .child(
                  S.documentList()
                    .title('Landing pages – NL-BE')
                    .schemaType('sectorPage')
                    .filter('_type == "sectorPage" && locale == \"nl-be\"')
                    .defaultOrdering([{ field: 'sector', direction: 'asc' }])
                ),
              S.listItem()
                .title('Landing pages – FR-BE')
                .child(
                  S.documentList()
                    .title('Landing pages – FR-BE')
                    .schemaType('sectorPage')
                    .filter('_type == \"sectorPage\" && locale == \"fr-be\"')
                    .defaultOrdering([{ field: 'sector', direction: 'asc' }])
                ),
              S.listItem()
                .title('Landing pages – EN-BE')
                .child(
                  S.documentList()
                    .title('Landing pages – EN-BE')
                    .schemaType('sectorPage')
                    .filter('_type == \"sectorPage\" && locale == \"en-be\"')
                    .defaultOrdering([{ field: 'sector', direction: 'asc' }])
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
