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
      name: 'footerBaseline',
      title: 'Footer baseline',
      type: 'text',
      rows: 3,
      description: 'Korte tekst naast of onder het footerlogo.',
    }),

    defineField({
      name: 'newsletterTitle',
      title: 'Nieuwsbrief titel',
      type: 'string',
    }),

    defineField({
      name: 'newsletterPlaceholder',
      title: 'Nieuwsbrief placeholder',
      type: 'string',
      initialValue: 'Email',
    }),

    defineField({
      name: 'newsletterButtonLabel',
      title: 'Nieuwsbrief knoplabel',
      type: 'string',
      initialValue: 'Subscribe',
    }),

    defineField({
      name: 'footerColumns',
      title: 'Footer kolommen',
      type: 'array',
      of: [{type: 'footerColumn'}],
    }),

    defineField({
      name: 'footerBottomLinks',
      title: 'Footer bottom links',
      type: 'array',
      of: [{type: 'footerBottomLink'}],
    }),

    defineField({
      name: 'socialLinks',
      title: 'Social media links',
      type: 'array',
      of: [{type: 'socialLink'}],
    }),

    defineField({
      name: 'address',
      title: 'Adres',
      type: 'text',
      rows: 3,
    }),

    defineField({
      name: 'copyrightText',
      title: 'Copyrighttekst',
      type: 'string',
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