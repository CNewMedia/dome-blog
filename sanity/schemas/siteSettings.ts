import { defineType, defineField } from 'sanity'

export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Site Instellingen',
  type: 'document',
  fields: [
    defineField({
      name: 'googleTagManagerId',
      title: 'Google tracking ID',
      type: 'string',
      description: 'Globale tracking ID voor de volledige site (GTM-XXXXXXX of G-XXXXXXXXXX).',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true
          const normalized = String(value).trim().toUpperCase()
          return /^(GTM-[A-Z0-9]+|G-[A-Z0-9]+)$/.test(normalized)
            ? true
            : 'Gebruik GTM-XXXXXXX of G-XXXXXXXXXX.'
        }),
    }),
  ],
})
