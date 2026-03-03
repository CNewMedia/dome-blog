import { defineType, defineField } from 'sanity'

export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'companyName',
      title: 'Bedrijfsnaam',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Korte beschrijving onder het logo in de footer.',
    }),
    defineField({
      name: 'address',
      title: 'Adres',
      type: 'text',
      rows: 3,
      description: 'Adresblok zoals in de footer getoond wordt.',
    }),
    defineField({
      name: 'footerLinks',
      title: 'Footer links',
      type: 'array',
      of: [
        defineField({
          name: 'link',
          title: 'Link',
          type: 'object',
          fields: [
            { name: 'title', title: 'Titel', type: 'string' },
            { name: 'url', title: 'URL', type: 'url' },
          ],
        }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social media links',
      type: 'array',
      of: [
        defineField({
          name: 'social',
          title: 'Social link',
          type: 'object',
          fields: [
            { name: 'platform', title: 'Platform', type: 'string', description: 'bv. LinkedIn, Facebook, Instagram' },
            { name: 'url', title: 'URL', type: 'url' },
          ],
        }),
      ],
    }),
    defineField({
      name: 'newsletterText',
      title: 'Nieuwsbrief tekst',
      type: 'text',
      rows: 3,
      description: 'Korte tekst boven of onder het nieuwsbriefveld.',
    }),
  ],
})

