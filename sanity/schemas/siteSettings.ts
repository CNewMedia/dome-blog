import { defineType, defineField } from 'sanity'

const locales = ['en', 'nl-be', 'fr-be', 'de']

const localeString = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: locales.map((locale) => ({
      name: locale.replace('-', '_'),
      title: locale.toUpperCase(),
      type: 'string',
    })),
  })

export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Site Instellingen',
  type: 'document',
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'logoAlt',
      title: 'Logo alt-tekst',
      type: 'string',
      description: 'Toegankelijkheidstekst voor het logo.',
    }),
    defineField({
      name: 'bedrijfsnaam',
      title: 'Bedrijfsnaam',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    localeString('tagline', 'Tagline'),
    defineField({
      name: 'headerMenu',
      title: 'Header menu',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            localeString('label', 'Label'),
            defineField({ name: 'url', title: 'URL', type: 'string' }),
            defineField({
              name: 'submenu',
              title: 'Submenu',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    localeString('label', 'Label'),
                    defineField({ name: 'url', title: 'URL', type: 'string' }),
                  ],
                  preview: {
                    select: { label: 'label.nl_be' },
                    prepare({ label }: { label?: string }) {
                      return { title: label || 'Submenu-item' }
                    },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { label: 'label.nl_be' },
            prepare({ label }: { label?: string }) {
              return { title: label || 'Menu-item' }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'footerKolommen',
      title: 'Footer kolommen',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            localeString('titel', 'Titel kolom'),
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    localeString('label', 'Label'),
                    defineField({ name: 'url', title: 'URL', type: 'string' }),
                  ],
                  preview: {
                    select: { label: 'label.nl_be' },
                    prepare({ label }: { label?: string }) {
                      return { title: label || 'Link' }
                    },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { titel: 'titel.nl_be' },
            prepare({ titel }: { titel?: string }) {
              return { title: titel || 'Kolom' }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social media links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'platform', title: 'Platform', type: 'string' }),
            defineField({ name: 'url', title: 'URL', type: 'url' }),
          ],
          preview: {
            select: { platform: 'platform' },
            prepare({ platform }: { platform?: string }) {
              return { title: platform || 'Social' }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'adres',
      title: 'Adres',
      type: 'text',
      rows: 3,
    }),
    localeString('copyrightTekst', 'Copyrighttekst'),
    localeString('nieuwsbriefTitel', 'Nieuwsbrief titel'),
  ],
})
