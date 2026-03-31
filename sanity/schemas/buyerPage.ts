import { defineField, defineType } from 'sanity'

export const buyerPageSchema = defineType({
  name: 'buyerPage',
  title: 'Buyer registratiepagina',
  type: 'document',
  groups: [
    { name: 'basis', title: 'Basis', default: true },
    { name: 'hero', title: 'Hero' },
    { name: 'form', title: 'Formulier (HubSpot)' },
    { name: 'steps', title: 'Hoe het werkt' },
    { name: 'sectors', title: 'Sectoren' },
    { name: 'finalCta', title: 'Slot-CTA' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'locale',
      title: 'Taal / markt',
      type: 'string',
      group: 'basis',
      options: {
        list: [
          { title: 'Nederlands (België)', value: 'nl-be' },
          { title: 'Français (Belgique)', value: 'fr-be' },
          { title: 'English (Belgium)', value: 'en-be' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basis',
      description: 'URL: /{locale}/buyers/{slug}. Alleen kleine letters en koppeltekens.',
      options: {
        source: 'heroTitle',
        slugify: (input: string) =>
          input
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, ''),
      },
      validation: (Rule) =>
        Rule.required().custom((value) => {
          const v = value?.current
          if (!v) return 'Slug is verplicht.'
          if (v !== v.toLowerCase()) return 'Slug moet lowercase zijn.'
          return true
        }),
    }),
    defineField({
      name: 'translationKey',
      title: 'Translation group',
      type: 'string',
      group: 'basis',
      description: 'Zelfde ID op vertaalde versies voor taalwisselaar in de navigatie.',
    }),
    defineField({
      name: 'heroEyebrow',
      title: 'Hero eyebrow',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero titel',
      type: 'string',
      group: 'hero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero ondertitel',
      type: 'text',
      rows: 3,
      group: 'hero',
    }),
    defineField({
      name: 'heroBody',
      title: 'Hero extra tekst',
      type: 'text',
      rows: 4,
      group: 'hero',
      description: 'Optioneel; korte intro onder de ondertitel.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero afbeelding',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt-tekst' }],
    }),
    defineField({
      name: 'heroCtaLabel',
      title: 'Hero knoplabel',
      type: 'string',
      group: 'hero',
      description: 'Leeg = geen knop. Linkt naar het formulier op deze pagina.',
    }),
    defineField({
      name: 'heroCtaHref',
      title: 'Hero knop-URL (override)',
      type: 'string',
      group: 'hero',
      description: 'Leeg = anker #buyer-form op deze pagina.',
    }),
    defineField({
      name: 'stats',
      title: 'Statistieken (balk)',
      type: 'array',
      group: 'hero',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Waarde', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'label', title: 'Label', type: 'string', validation: (Rule) => Rule.required() },
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        },
      ],
    }),
    defineField({
      name: 'formEyebrow',
      title: 'Formulier eyebrow',
      type: 'string',
      group: 'form',
    }),
    defineField({
      name: 'formTitle',
      title: 'Formulier titel',
      type: 'string',
      group: 'form',
    }),
    defineField({
      name: 'formSubtitle',
      title: 'Formulier ondertitel',
      type: 'text',
      rows: 2,
      group: 'form',
    }),
    defineField({
      name: 'hubspotFormId',
      title: 'HubSpot form ID',
      type: 'string',
      group: 'form',
      description: 'Embedded formulier-ID (zelfde aanpak als sectorlandings). Velden worden in HubSpot beheerd.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stepsSectionEyebrow',
      title: 'Sectie eyebrow (hoe het werkt)',
      type: 'string',
      group: 'steps',
    }),
    defineField({
      name: 'stepsSectionTitle',
      title: 'Sectietitel (hoe het werkt)',
      type: 'string',
      group: 'steps',
    }),
    defineField({
      name: 'steps',
      title: 'Stappen',
      type: 'array',
      group: 'steps',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon (optioneel)',
              type: 'string',
              description: 'bv. bell, mail, chart — voor eenvoudige pictogrammen in de UI.',
            },
            { name: 'title', title: 'Titel', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'description', title: 'Beschrijving', type: 'text', rows: 3 },
          ],
          preview: { select: { title: 'title' } },
        },
      ],
    }),
    defineField({
      name: 'sectorCardsSectionEyebrow',
      title: 'Sectie eyebrow (sectoren)',
      type: 'string',
      group: 'sectors',
    }),
    defineField({
      name: 'sectorCardsSectionTitle',
      title: 'Sectietitel (sectoren)',
      type: 'string',
      group: 'sectors',
    }),
    defineField({
      name: 'sectorCards',
      title: 'Sector-tegels',
      type: 'array',
      group: 'sectors',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon (optioneel)',
              type: 'string',
            },
            { name: 'title', title: 'Titel', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'description', title: 'Beschrijving', type: 'text', rows: 3 },
            {
              name: 'image',
              title: 'Afbeelding',
              type: 'image',
              options: { hotspot: true },
              fields: [{ name: 'alt', type: 'string', title: 'Alt-tekst' }],
            },
            { name: 'href', title: 'Link URL', type: 'string', description: 'Optioneel' },
            { name: 'buttonLabel', title: 'Knoplabel', type: 'string' },
            { name: 'openInNewTab', title: 'Link in nieuw tabblad', type: 'boolean', initialValue: false },
          ],
          preview: { select: { title: 'title' } },
        },
      ],
    }),
    defineField({
      name: 'finalCtaTitle',
      title: 'Slot-CTA titel',
      type: 'string',
      group: 'finalCta',
    }),
    defineField({
      name: 'finalCtaBody',
      title: 'Slot-CTA tekst',
      type: 'text',
      rows: 3,
      group: 'finalCta',
    }),
    defineField({
      name: 'finalCtaButtonLabel',
      title: 'Slot-CTA knoplabel',
      type: 'string',
      group: 'finalCta',
    }),
    defineField({
      name: 'finalCtaButtonHref',
      title: 'Slot-CTA knop-URL',
      type: 'string',
      group: 'finalCta',
      description: 'Leeg = scroll naar formulier (#buyer-form).',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 3,
      group: 'seo',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph image',
      type: 'image',
      group: 'seo',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt-tekst' }],
    }),
  ],
  preview: {
    select: {
      slug: 'slug.current',
      locale: 'locale',
      heroTitle: 'heroTitle',
    },
    prepare({ slug, locale, heroTitle }) {
      return {
        title: heroTitle || slug || 'Buyer page',
        subtitle: `${locale ?? '?'} · /${locale}/buyers/${slug}`,
      }
    },
  },
})
