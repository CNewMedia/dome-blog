import { defineType, defineField } from 'sanity'

const locales = ['en', 'nl-be', 'fr-be', 'de']

const localizedString = (name: string, title: string, group?: string) =>
  defineField({
    name,
    title,
    type: 'object',
    group,
    fields: locales.map((locale) => ({
      name: locale.replace('-', '_'),
      title: locale.toUpperCase(),
      type: 'string',
    })),
  })

const localizedText = (name: string, title: string, group?: string) =>
  defineField({
    name,
    title,
    type: 'object',
    group,
    fields: locales.map((locale) => ({
      name: locale.replace('-', '_'),
      title: locale.toUpperCase(),
      type: 'text',
      rows: 3,
    })),
  })

const localizedBody = (name: string, title: string, group?: string) =>
  defineField({
    name,
    title,
    type: 'object',
    group,
    fields: locales.map((locale) => ({
      name: locale.replace('-', '_'),
      title: locale.toUpperCase(),
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
    })),
  })

export const sectorPageSchema = defineType({
  name: 'sectorPage',
  title: 'Sector Landing Page',
  type: 'document',
  groups: [
    { name: 'instellingen', title: 'Instellingen & taal', default: true },
    { name: 'hero', title: 'Hero' },
    { name: 'content', title: 'Content' },
    { name: 'usps', title: 'USP\'s' },
    { name: 'machines', title: 'Machines' },
    { name: 'success', title: 'Success story' },
    { name: 'cta', title: 'Contactformulier' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'sector',
      title: 'Sector',
      type: 'string',
      group: 'instellingen',
      options: {
        list: [
          { title: 'Woodworking (Houtbewerking)', value: 'woodworking' },
          { title: 'Metalworking (Metaalbewerking)', value: 'metalworking' },
          { title: 'Construction (Bouw & Grondverzet)', value: 'construction' },
          { title: 'Agriculture (Landbouw)', value: 'agriculture' },
          { title: 'Transport (Transport & Handling)', value: 'transport' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'availableLocales',
      title: 'Beschikbare talen',
      type: 'array',
      group: 'instellingen',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Nederlands (België)', value: 'nl-be' },
          { title: 'Français (Belgique)', value: 'fr-be' },
          { title: 'English', value: 'en' },
          { title: 'Deutsch', value: 'de' },
        ],
        layout: 'checkbox',
      },
      initialValue: ['nl-be'],
      description: 'Alleen deze talen zijn beschikbaar voor deze sectorpagina. Gebruiker wordt doorgestuurd naar nl-be als de gekozen taal niet beschikbaar is. De teamleden van de team-sectie beheer je onder "Team" in het zijmenu.',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero title',
      type: 'object',
      group: 'hero',
      fields: locales.map((locale) => ({
        name: locale.replace('-', '_'),
        title: locale.toUpperCase(),
        type: 'string',
      })),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero subtitle',
      type: 'object',
      group: 'hero',
      fields: locales.map((locale) => ({
        name: locale.replace('-', '_'),
        title: locale.toUpperCase(),
        type: 'text',
        rows: 3,
      })),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
    localizedBody('content', 'Content', 'content'),
    defineField({
      name: 'contentImage',
      title: 'Content afbeelding',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      description: 'Afbeelding naast de contenttekst (desktop). Optioneel; anders wordt de hero-afbeelding gebruikt.',
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
    defineField({
      name: 'uspBlocks',
      title: 'USP blocks',
      type: 'array',
      group: 'usps',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'icon', title: 'Icon', type: 'string', description: 'Icon name or identifier (e.g. speed, personal)' },
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
      name: 'machines',
      title: 'Machine categories',
      type: 'array',
      group: 'machines',
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
      name: 'successStory',
      title: 'Success story / case reference',
      type: 'object',
      group: 'success',
      fields: [
        { name: 'quote', title: 'Quote', type: 'text', rows: 4 },
        { name: 'company', title: 'Company', type: 'string' },
        { name: 'result', title: 'Result', type: 'string', description: 'Short result or outcome' },
      ],
    }),
    localizedString('ctaFormTitle', 'CTA form title', 'cta'),
    defineField({
      name: 'hubspotFormId',
      title: 'HubSpot form ID',
      type: 'string',
      group: 'cta',
      description: 'Sector-specific HubSpot form ID for lead capture',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      fields: [
        localizedString('title', 'SEO title'),
        localizedText('description', 'SEO description'),
      ],
    }),
  ],
  preview: {
    select: { sector: 'sector', heroTitle: 'heroTitle.en' },
    prepare({ sector, heroTitle }) {
      const labels: Record<string, string> = {
        woodworking: 'Woodworking',
        metalworking: 'Metalworking',
        construction: 'Construction',
        agriculture: 'Agriculture',
        transport: 'Transport',
      }
      return {
        title: heroTitle || labels[sector] || sector || 'Sector page',
        subtitle: sector ? labels[sector] : undefined,
      }
    },
  },
})
