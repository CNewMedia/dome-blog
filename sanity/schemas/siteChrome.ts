import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteChrome',
  title: 'Site Chrome',
  type: 'document',
  fields: [
    defineField({
      name: 'locale',
      title: 'Taal',
      type: 'string',
      options: {
        list: [
          {title: 'Nederlands (België)', value: 'nl-be'},
          {title: 'Français (Belgique)', value: 'fr-be'},
          {title: 'English (Belgium)', value: 'en-be'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'companyName',
      title: 'Bedrijfsnaam',
      type: 'string',
      initialValue: 'Dome Auctions',
    }),

    defineField({
      name: 'headerLogo',
      title: 'Header logo',
      type: 'image',
      options: {hotspot: true},
    }),

    defineField({
      name: 'footerLogo',
      title: 'Footer logo',
      type: 'image',
      options: {hotspot: true},
    }),

    defineField({
      name: 'logoAlt',
      title: 'Logo alt-tekst',
      type: 'string',
      description: 'Toegankelijkheidstekst voor het logo in deze taal.',
    }),

    defineField({
      name: 'headerMenu',
      title: 'Header menu',
      type: 'array',
      of: [{type: 'menuItem'}],
    }),

    defineField({
      name: 'newsletterTitle',
      title: 'Nieuwsbrief titel',
      type: 'string',
    }),

    defineField({
      name: 'footerPrimaryLinks',
      title: 'Primary footer links',
      type: 'array',
      of: [{type: 'footerBottomLink'}],
      description: 'Main footer navigation links (About us, FAQ, Contact, etc.). Label and URL per link in this locale.',
    }),

    defineField({
      name: 'footerLegalLinks',
      title: 'Legal footer links',
      type: 'array',
      of: [{type: 'footerBottomLink'}],
      description: 'Legal pages (Terms and conditions, Privacy policy, etc.). Label and URL per link in this locale.',
    }),

  ],

  preview: {
    select: {
      title: 'companyName',
      subtitle: 'locale',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Site Chrome',
        subtitle: subtitle || 'Geen taal',
      }
    },
  },
})