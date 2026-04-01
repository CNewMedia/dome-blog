import { DefaultDocumentNodeResolver, StructureBuilder } from 'sanity/structure'
import { ProductionUrl } from './components/ProductionUrl'

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, context) => {
  const withLinks = ['sectorPage', 'buyerPage', 'post']
  if (withLinks.includes(context.schemaType)) {
    return S.document().views([
      S.view.form().title('Content'),
      S.view.component(ProductionUrl).title('Links'),
    ])
  }
  return S.document().views([S.view.form().title('Content')])
}

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Dome Auctions Insights')
    .items([
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
                    .child((documentId) =>
                      S.document()
                        .schemaType('post')
                        .documentId(documentId)
                        .views([S.view.form().title('Content'), S.view.component(ProductionUrl).title('URL')])
                    )
                ),
              S.listItem()
                .title('FR-BE')
                .child(
                  S.documentList()
                    .title('Insights – FR-BE')
                    .schemaType('post')
                    .filter('_type == "post" && locale == "fr-be"')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                    .child((documentId) =>
                      S.document()
                        .schemaType('post')
                        .documentId(documentId)
                        .views([S.view.form().title('Content'), S.view.component(ProductionUrl).title('URL')])
                    )
                ),
              S.listItem()
                .title('EN-BE')
                .child(
                  S.documentList()
                    .title('Insights – EN-BE')
                    .schemaType('post')
                    .filter('_type == "post" && locale == "en-be"')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                    .child((documentId) =>
                      S.document()
                        .schemaType('post')
                        .documentId(documentId)
                        .views([S.view.form().title('Content'), S.view.component(ProductionUrl).title('URL')])
                    )
                ),
            ])
        ),
      S.listItem()
        .title('Landing Pages')
        .schemaType('sectorPage')
        .child(
          S.list()
            .title('Landing Pages')
            .items([
              S.listItem()
                .title('Nieuwe landing page')
                .id('lp-create-group')
                .child(
                  S.list()
                    .title('Nieuwe landing page')
                    .items([
                      S.listItem()
                        .title('Nieuwe sector page')
                        .id('lp-create-sector-template')
                        .child(
                          S.document()
                            .schemaType('sectorPage')
                            .initialValueTemplate('sector-page-klassiek')
                        ),
                      S.listItem()
                        .title('Nieuwe buyer registratiepagina')
                        .id('lp-create-buyer-reg')
                        .child(
                          S.document()
                            .schemaType('buyerPage')
                            .initialValueTemplate('buyer-page-new')
                        ),
                    ])
                ),
              S.listItem()
                .title('Buyer registratiepagina’s')
                .id('lp-buyer-reg-by-locale')
                .child(
                  S.list()
                    .title('Buyer registratiepagina’s')
                    .items([
                      S.listItem()
                        .title('NL-BE')
                        .child(
                          S.documentList()
                            .title('Buyer registratie – NL-BE')
                            .schemaType('buyerPage')
                            .filter('_type == "buyerPage" && locale == "nl-be"')
                            .initialValueTemplates([S.initialValueTemplateItem('buyer-page-new')])
                            .menuItems(
                              S.menuItemsFromInitialValueTemplateItems([
                                S.initialValueTemplateItem('buyer-page-new').serialize(),
                              ])
                            )
                            .defaultOrdering([
                              { field: 'slug.current', direction: 'asc' },
                              { field: '_updatedAt', direction: 'desc' },
                            ])
                            .child((documentId) =>
                              S.document()
                                .schemaType('buyerPage')
                                .documentId(documentId)
                                .views([S.view.form().title('Content'), S.view.component(ProductionUrl).title('URL')])
                            )
                        ),
                      S.listItem()
                        .title('FR-BE')
                        .child(
                          S.documentList()
                            .title('Buyer registratie – FR-BE')
                            .schemaType('buyerPage')
                            .filter('_type == "buyerPage" && locale == "fr-be"')
                            .initialValueTemplates([S.initialValueTemplateItem('buyer-page-new')])
                            .menuItems(
                              S.menuItemsFromInitialValueTemplateItems([
                                S.initialValueTemplateItem('buyer-page-new').serialize(),
                              ])
                            )
                            .defaultOrdering([
                              { field: 'slug.current', direction: 'asc' },
                              { field: '_updatedAt', direction: 'desc' },
                            ])
                            .child((documentId) =>
                              S.document()
                                .schemaType('buyerPage')
                                .documentId(documentId)
                                .views([S.view.form().title('Content'), S.view.component(ProductionUrl).title('URL')])
                            )
                        ),
                      S.listItem()
                        .title('EN-BE')
                        .child(
                          S.documentList()
                            .title('Buyer registratie – EN-BE')
                            .schemaType('buyerPage')
                            .filter('_type == "buyerPage" && locale == "en-be"')
                            .initialValueTemplates([S.initialValueTemplateItem('buyer-page-new')])
                            .menuItems(
                              S.menuItemsFromInitialValueTemplateItems([
                                S.initialValueTemplateItem('buyer-page-new').serialize(),
                              ])
                            )
                            .defaultOrdering([
                              { field: 'slug.current', direction: 'asc' },
                              { field: '_updatedAt', direction: 'desc' },
                            ])
                            .child((documentId) =>
                              S.document()
                                .schemaType('buyerPage')
                                .documentId(documentId)
                                .views([S.view.form().title('Content'), S.view.component(ProductionUrl).title('URL')])
                            )
                        ),
                    ])
                ),
              S.listItem()
                .title('Sectorpagina’s')
                .id('lp-sector-by-locale')
                .child(
                  S.list()
                    .title('Sectorpagina’s')
                    .items([
                      S.listItem()
                        .title('NL-BE')
                        .child(
                          S.documentList()
                            .title('Sectorpagina’s – NL-BE')
                            .schemaType('sectorPage')
                            .filter(
                              '_type == "sectorPage" && (pageCategory == "sector" || !defined(pageCategory)) && locale == "nl-be"'
                            )
                            .initialValueTemplates([S.initialValueTemplateItem('sector-page-klassiek')])
                            .menuItems(
                              S.menuItemsFromInitialValueTemplateItems([
                                S.initialValueTemplateItem('sector-page-klassiek').serialize(),
                              ])
                            )
                            .defaultOrdering([
                              { field: 'slug.current', direction: 'asc' },
                              { field: '_updatedAt', direction: 'desc' },
                            ])
                            .child((documentId) =>
                              S.document()
                                .schemaType('sectorPage')
                                .documentId(documentId)
                                .views([S.view.form().title('Content'), S.view.component(ProductionUrl).title('URL')])
                            )
                        ),
                      S.listItem()
                        .title('FR-BE')
                        .child(
                          S.documentList()
                            .title('Sectorpagina’s – FR-BE')
                            .schemaType('sectorPage')
                            .filter(
                              '_type == "sectorPage" && (pageCategory == "sector" || !defined(pageCategory)) && locale == "fr-be"'
                            )
                            .initialValueTemplates([S.initialValueTemplateItem('sector-page-klassiek')])
                            .menuItems(
                              S.menuItemsFromInitialValueTemplateItems([
                                S.initialValueTemplateItem('sector-page-klassiek').serialize(),
                              ])
                            )
                            .defaultOrdering([
                              { field: 'slug.current', direction: 'asc' },
                              { field: '_updatedAt', direction: 'desc' },
                            ])
                            .child((documentId) =>
                              S.document()
                                .schemaType('sectorPage')
                                .documentId(documentId)
                                .views([S.view.form().title('Content'), S.view.component(ProductionUrl).title('URL')])
                            )
                        ),
                      S.listItem()
                        .title('EN-BE')
                        .child(
                          S.documentList()
                            .title('Sectorpagina’s – EN-BE')
                            .schemaType('sectorPage')
                            .filter(
                              '_type == "sectorPage" && (pageCategory == "sector" || !defined(pageCategory)) && locale == "en-be"'
                            )
                            .initialValueTemplates([S.initialValueTemplateItem('sector-page-klassiek')])
                            .menuItems(
                              S.menuItemsFromInitialValueTemplateItems([
                                S.initialValueTemplateItem('sector-page-klassiek').serialize(),
                              ])
                            )
                            .defaultOrdering([
                              { field: 'slug.current', direction: 'asc' },
                              { field: '_updatedAt', direction: 'desc' },
                            ])
                            .child((documentId) =>
                              S.document()
                                .schemaType('sectorPage')
                                .documentId(documentId)
                                .views([S.view.form().title('Content'), S.view.component(ProductionUrl).title('URL')])
                            )
                        ),
                    ])
                ),
              S.listItem()
                .title('Beheer')
                .id('lp-management-group')
                .child(
                  S.list()
                    .title('Landing Pages beheer')
                    .items([
                      S.listItem()
                        .title('Alle landing pages')
                        .schemaType('sectorPage')
                        .child(
                          S.documentTypeList('sectorPage')
                            .title('Alle landing pages')
                            .defaultOrdering([
                              { field: 'locale', direction: 'asc' },
                              { field: 'slug.current', direction: 'asc' },
                              { field: '_updatedAt', direction: 'desc' },
                            ])
                            .child((documentId) =>
                              S.document()
                                .schemaType('sectorPage')
                                .documentId(documentId)
                                .views([S.view.form().title('Content'), S.view.component(ProductionUrl).title('URL')])
                            )
                        ),
                      S.listItem()
                        .title('Recent gewijzigd')
                        .child(
                          S.documentList()
                            .title('Landing pages – Recent gewijzigd')
                            .schemaType('sectorPage')
                            .filter('_type == "sectorPage"')
                            .defaultOrdering([{ field: '_updatedAt', direction: 'desc' }])
                        ),
                      S.listItem()
                        .title('Status')
                        .child(
                          S.list()
                            .title('Landing Pages status')
                            .items([
                              S.listItem()
                                .title('Drafts')
                                .child(
                                  S.documentList()
                                    .title('Landing pages – Drafts')
                                    .schemaType('sectorPage')
                                    .filter('_type == "sectorPage" && _id in path("drafts.**")')
                                    .defaultOrdering([{ field: '_updatedAt', direction: 'desc' }])
                                ),
                              S.listItem()
                                .title('Published')
                                .child(
                                  S.documentList()
                                    .title('Landing pages – Published')
                                    .schemaType('sectorPage')
                                    .filter('_type == "sectorPage" && !(_id in path("drafts.**"))')
                                    .defaultOrdering([
                                      { field: 'locale', direction: 'asc' },
                                      { field: 'slug.current', direction: 'asc' },
                                      { field: '_updatedAt', direction: 'desc' },
                                    ])
                                ),
                            ])
                        ),
                    ])
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
      S.listItem()
        .title('Tags')
        .schemaType('tag')
        .child(
          S.documentList()
            .title('Tags')
            .schemaType('tag')
            .filter('_type == "tag"')
            .defaultOrdering([{ field: 'title', direction: 'asc' }])
        ),
    ])
