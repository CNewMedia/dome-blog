import { defineType, defineField } from 'sanity'

export const sectorPageSchema = defineType({
  name: 'sectorPage',
  title: 'Landing page',
  type: 'document',
  groups: [
    { name: 'basis', title: 'Basis', default: true },
    { name: 'typeAudience', title: 'Type & doelgroep' },
    { name: 'hero', title: 'Hero' },
    { name: 'inhoud', title: 'Inhoud & secties' },
    { name: 'seo', title: 'SEO' },
  ],
  fieldsets: [
    { name: 'stats', title: 'Stats', options: { collapsible: true, collapsed: true } },
    { name: 'process', title: 'Process', options: { collapsible: true, collapsed: true } },
    { name: 'content', title: 'Content', options: { collapsible: true, collapsed: true } },
    { name: 'usp', title: 'USP', options: { collapsible: true, collapsed: true } },
    { name: 'machines', title: 'Machines', options: { collapsible: true, collapsed: true } },
    { name: 'testimonial', title: 'Testimonial', options: { collapsible: true, collapsed: true } },
    { name: 'team', title: 'Team', options: { collapsible: true, collapsed: true } },
    { name: 'contact', title: 'Contact', options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    defineField({
      name: 'locale',
      title: 'Taal / markt',
      type: 'string',
      group: 'basis',
      description: 'Taal en regio voor deze pagina (URL begint met deze waarde).',
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
      description:
        'URL-segment voor deze pagina in deze taal (bv. woodworking of metaalbewerking). Alleen kleine letters en koppeltekens.',
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
          if (!v) return 'Slug is required.'
          if (v !== v.toLowerCase()) return 'Slug must be lowercase.'
          if (v === 'articles') return '"articles" is reserved for insight detail URLs. Please choose a different slug.'
          return true
        }),
    }),
    defineField({
      name: 'translationKey',
      title: 'Translation group',
      type: 'string',
      group: 'basis',
      description: 'Optioneel: zelfde ID op vertaalde versies van deze pagina om ze aan elkaar te koppelen.',
    }),
    defineField({
      name: 'pageCategory',
      title: 'Paginatype',
      type: 'string',
      group: 'typeAudience',
      description:
        'Sector = klassieke sectorlanding. Doelgroep = pagina gericht op kopers/verkopers (bijv. op de hoogte blijven). Oude documenten zonder waarde gelden als sector.',
      options: {
        list: [
          { title: 'Sector (klassieke landing)', value: 'sector' },
          { title: 'Doelgroep (audience)', value: 'audience' },
        ],
        layout: 'radio',
      },
      initialValue: 'sector',
    }),
    defineField({
      name: 'audienceType',
      title: 'Doelgroep',
      type: 'string',
      group: 'typeAudience',
      description: 'Alleen voor doelgroeppagina’s: kopers of verkopers.',
      options: {
        list: [
          { title: 'Kopers', value: 'buyer' },
          { title: 'Verkopers', value: 'seller' },
        ],
        layout: 'radio',
      },
      hidden: ({ parent }) => parent?.pageCategory !== 'audience',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { pageCategory?: string }
          if (parent?.pageCategory !== 'audience') return true
          if (!value) return 'Kies een doelgroep (kopers of verkopers).'
          return true
        }),
    }),
    defineField({
      name: 'sectorKey',
      title: 'Sector (logische koppeling)',
      type: 'string',
      group: 'typeAudience',
      description:
        'Welk Dome-segment (bv. houtbewerking) hoort bij deze pagina, los van de URL-slug. Verplicht voor doelgroeppagina’s.',
      options: {
        list: [
          { title: 'Houtbewerking', value: 'woodworking' },
          { title: 'Metaalbewerking', value: 'metalworking' },
          { title: 'Landbouw', value: 'agriculture' },
          { title: 'Bouw', value: 'construction' },
          { title: 'Transport', value: 'transport' },
          { title: 'Drukwerk', value: 'printing' },
          { title: 'Grondverzet', value: 'earthmoving' },
          { title: 'CNC', value: 'cnc' },
          { title: 'Overig / algemeen', value: 'other' },
        ],
        layout: 'dropdown',
      },
      hidden: ({ parent }) => parent?.pageCategory !== 'audience',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { pageCategory?: string }
          if (parent?.pageCategory !== 'audience') return true
          if (!value) return 'Kies een sector (logische koppeling) voor deze doelgroeppagina.'
          return true
        }),
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero title',
      type: 'string',
      group: 'hero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero subtitle',
      type: 'text',
      group: 'hero',
      rows: 3,
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
    defineField({
      name: 'heroEyebrow',
      title: 'Hero eyebrow',
      type: 'string',
      group: 'hero',
      description: 'Korte regel boven de titel (bijv. sectornaam).',
    }),
    defineField({
      name: 'heroCtaLabel',
      title: 'Hero CTA label',
      type: 'string',
      group: 'hero',
      description: 'Tekst op de primaire knop (bijv. Vraag een gesprek aan).',
    }),
    defineField({
      name: 'heroCtaHref',
      title: 'Hero CTA URL',
      type: 'string',
      group: 'hero',
      description: 'Link voor de hero-knop (bijv. #cta-form of volledige URL).',
    }),
    defineField({
      name: 'heroSectionVisible',
      title: 'Show hero section',
      type: 'boolean',
      group: 'hero',
      initialValue: true,
    }),
    defineField({
      name: 'statsSection',
      fieldset: 'stats',
      group: 'inhoud',
      title: 'Statistics section',
      type: 'object',
      fields: [
        { name: 'isVisible', title: 'Show section', type: 'boolean', initialValue: true },
        {
          name: 'items',
          title: 'Statistics',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'value', title: 'Value', type: 'string', validation: (Rule: any) => Rule.required() },
                { name: 'label', title: 'Label', type: 'string', validation: (Rule: any) => Rule.required() },
              ],
              preview: { select: { title: 'value', subtitle: 'label' } },
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'processSection',
      fieldset: 'process',
      group: 'inhoud',
      title: 'Process steps section',
      type: 'object',
      fields: [
        { name: 'isVisible', title: 'Show section', type: 'boolean', initialValue: true },
        { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
        { name: 'title', title: 'Section title', type: 'string' },
        {
          name: 'steps',
          title: 'Steps',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: 'Title', type: 'string', validation: (Rule: any) => Rule.required() },
                { name: 'description', title: 'Description', type: 'text', rows: 2 },
              ],
              preview: { select: { title: 'title' } },
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'contentSectionVisible',
      fieldset: 'content',
      group: 'inhoud',
      title: 'Show content section',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'content',
      fieldset: 'content',
      group: 'inhoud',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          options: {
            styles: [
              { title: 'Normal', value: 'normal' },
              { title: 'H2', value: 'h2' },
              { title: 'H3', value: 'h3' },
            ],
          },
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{ name: 'href', type: 'url', title: 'URL' }],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
        },
      ],
    }),
    defineField({
      name: 'contentImage',
      fieldset: 'content',
      group: 'inhoud',
      title: 'Content afbeelding',
      type: 'image',
      options: { hotspot: true },
      description:
        'Afbeelding naast de contenttekst (desktop). Optioneel; anders wordt de hero-afbeelding gebruikt.',
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
    defineField({
      name: 'uspBlocks',
      fieldset: 'usp',
      group: 'inhoud',
      title: 'USP blocks',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Icon name or identifier (e.g. speed, personal)',
            },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 3 },
          ],
          preview: {
            select: { title: 'title' },
            prepare({ title }) {
              return { title: title || 'USP block' }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'uspSectionEyebrow',
      fieldset: 'usp',
      group: 'inhoud',
      title: 'USP section eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'uspSectionTitle',
      fieldset: 'usp',
      group: 'inhoud',
      title: 'USP section title',
      type: 'string',
    }),
    defineField({
      name: 'uspSectionVisible',
      fieldset: 'usp',
      group: 'inhoud',
      title: 'Show USP section',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'machines',
      fieldset: 'machines',
      group: 'inhoud',
      title: 'Machine categories',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 2 },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
            },
            { name: 'buttonLabel', title: 'Button label', type: 'string', description: 'Optional CTA text (e.g. Bekijk machines).' },
            { name: 'buttonHref', title: 'Button URL', type: 'string', description: 'Link for the button. Leave empty to hide the button.' },
            { name: 'openInNewTab', title: 'Open in new tab', type: 'boolean', initialValue: false, description: 'Open link in a new tab.' },
          ],
          preview: {
            select: { title: 'name' },
            prepare({ title }) {
              return { title: title || 'Machine' }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'machinesSectionVisible',
      fieldset: 'machines',
      group: 'inhoud',
      title: 'Show machines section',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'successStory',
      fieldset: 'testimonial',
      group: 'inhoud',
      title: 'Success story / case reference',
      type: 'object',
      fields: [
        { name: 'quote', title: 'Quote', type: 'text', rows: 4 },
        { name: 'company', title: 'Company', type: 'string' },
        { name: 'result', title: 'Result', type: 'string', description: 'Short result or outcome' },
      ],
    }),
    defineField({
      name: 'testimonialSectionVisible',
      fieldset: 'testimonial',
      group: 'inhoud',
      title: 'Show testimonial section',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'teamSectionEyebrow',
      fieldset: 'team',
      group: 'inhoud',
      title: 'Team section eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'teamSectionTitle',
      fieldset: 'team',
      group: 'inhoud',
      title: 'Team section title',
      type: 'string',
    }),
    defineField({
      name: 'teamSectionVisible',
      fieldset: 'team',
      group: 'inhoud',
      title: 'Show team section',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'contactSectionEyebrow',
      fieldset: 'contact',
      group: 'inhoud',
      title: 'Contact section eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'contactSectionSubtitle',
      fieldset: 'contact',
      group: 'inhoud',
      title: 'Contact section subtitle',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'contactSectionVisible',
      fieldset: 'contact',
      group: 'inhoud',
      title: 'Show contact section',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'ctaFormTitle',
      fieldset: 'contact',
      group: 'inhoud',
      title: 'CTA form title',
      type: 'string',
    }),
    defineField({
      name: 'hubspotFormId',
      fieldset: 'contact',
      group: 'inhoud',
      title: 'HubSpot form ID',
      type: 'string',
      description: 'Sector-specific HubSpot form ID for lead capture',
    }),
    defineField({
      name: 'seoTitle',
      group: 'seo',
      title: 'SEO title',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      group: 'seo',
      title: 'SEO description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'ogImage',
      group: 'seo',
      title: 'Open Graph image',
      type: 'image',
      options: { hotspot: true },
      description: 'Social sharing image. Falls back to hero image if empty.',
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
  ],
  preview: {
    select: {
      slug: 'slug.current',
      locale: 'locale',
      heroTitle: 'heroTitle',
      pageCategory: 'pageCategory',
      audienceType: 'audienceType',
      sectorKey: 'sectorKey',
    },
    prepare({ slug, locale, heroTitle, pageCategory, audienceType, sectorKey }) {
      const title = heroTitle || slug || 'Untitled landing page'
      const loc = locale || 'no-locale'
      const cat =
        pageCategory === 'audience'
          ? `audience${audienceType ? ` · ${audienceType}` : ''}${sectorKey ? ` · ${sectorKey}` : ''}`
          : pageCategory === 'sector' || !pageCategory
            ? 'sector'
            : pageCategory
      return {
        title,
        subtitle: `${loc} · ${cat} · /${loc}/${slug}`,
      }
    },
  },
})
