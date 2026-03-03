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

const localeText = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: locales.map((locale) => ({
      name: locale.replace('-', '_'),
      title: locale.toUpperCase(),
      type: 'text',
      rows: 4,
    })),
  })

export const teamMemberSchema = defineType({
  name: 'teamMember',
  title: 'Teamlid',
  type: 'document',
  fields: [
    defineField({
      name: 'naam',
      title: 'Naam',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    localeString('functie', 'Functie'),
    localeText('beschrijving', 'Beschrijving'),
    defineField({
      name: 'foto',
      title: 'Foto',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt tekst' }],
    }),
    defineField({ name: 'email', title: 'E-mail', type: 'string' }),
    defineField({ name: 'telefoon', title: 'Telefoon', type: 'string' }),
    defineField({ name: 'linkedinUrl', title: 'LinkedIn URL', type: 'url' }),
    defineField({
      name: 'meetingCalendarUrl',
      title: 'Meeting / agenda link (Calendly, HubSpot)',
      type: 'url',
    }),
    localeString('ctaLabel', 'CTA label (bv. Plan een gesprek)'),
    defineField({
      name: 'volgorde',
      title: 'Volgorde',
      type: 'number',
      description: 'Lager = eerder in de lijst.',
      initialValue: 0,
    }),
    defineField({
      name: 'actief',
      title: 'Actief',
      type: 'boolean',
      initialValue: true,
      description: 'Alleen actieve leden worden getoond op de site.',
    }),
  ],
  orderings: [
    { title: 'Volgorde (oplopend)', name: 'volgordeAsc', by: [{ field: 'volgorde', direction: 'asc' }] },
  ],
  preview: {
    select: { naam: 'naam', functie: 'functie.nl_be', media: 'foto' },
    prepare({ naam, functie, media }) {
      return { title: naam || 'Teamlid', subtitle: functie, media }
    },
  },
})
