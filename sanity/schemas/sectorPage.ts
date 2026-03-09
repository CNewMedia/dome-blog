import { defineType, defineField } from 'sanity'

export const sectorPageSchema = defineType({
  name: 'sectorPage',
  title: 'Sector Landing Page',
  type: 'document',
  fields: [
    defineField({
      name: 'sector',
      title: 'Page slug',
      type: 'string',
      description: 'URL segment for this landing page, for example woodworking or metalworking.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'locale',
      title: 'Taal',
      type: 'string',
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
      name: 'heroTitle',
      title: 'Hero title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero subtitle',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
    defineField({
      name: 'content',
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
      title: 'Content afbeelding',
      type: 'image',
      options: { hotspot: true },
      description:
        'Afbeelding naast de contenttekst (desktop). Optioneel; anders wordt de hero-afbeelding gebruikt.',
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
    defineField({
      name: 'uspBlocks',
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
      name: 'machines',
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
      fields: [
        { name: 'quote', title: 'Quote', type: 'text', rows: 4 },
        { name: 'company', title: 'Company', type: 'string' },
        { name: 'result', title: 'Result', type: 'string', description: 'Short result or outcome' },
      ],
    }),
    defineField({
      name: 'ctaFormTitle',
      title: 'CTA form title',
      type: 'string',
    }),
    defineField({
      name: 'hubspotFormId',
      title: 'HubSpot form ID',
      type: 'string',
      description: 'Sector-specific HubSpot form ID for lead capture',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      sector: 'sector',
      locale: 'locale',
      heroTitle: 'heroTitle',
    },
    prepare({ sector, locale, heroTitle }) {
      const labels: Record<string, string> = {
        woodworking: 'Woodworking',
        metalworking: 'Metalworking',
        construction: 'Construction',
        agriculture: 'Agriculture',
        transport: 'Transport',
      }
      const sectorLabel = labels[sector] || sector || 'Sector page'
      const localeLabel = locale ? String(locale).toUpperCase() : ''
      return {
        title: `${sectorLabel}${localeLabel ? ` — ${localeLabel}` : ''}`,
        subtitle: heroTitle || undefined,
      }
    },
  },
})
