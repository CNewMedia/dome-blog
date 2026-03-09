import { defineType, defineField } from 'sanity'

export const postSchema = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    // Per-locale model: one document per locale
    defineField({
      name: 'locale',
      title: 'Locale',
      type: 'string',
      options: {
        list: [
          { title: 'Nederlands (België)', value: 'nl-be' },
          { title: 'Français (Belgique)', value: 'fr-be' },
          { title: 'English (Belgium)', value: 'en-be' },
        ],
        layout: 'dropdown',
      },
      description: 'Target locale for this blog post (new per-locale model).',
    }),
    defineField({
      name: 'translationKey',
      title: 'Translation group',
      type: 'string',
      description: 'Same value for all language versions of this article.',
    }),
    defineField({
      name: 'titlePlain',
      title: 'Title (per-locale)',
      type: 'string',
      description: 'New per-locale title. Legacy localized title fields remain available below.',
    }),
    defineField({
      name: 'excerptPlain',
      title: 'Excerpt (per-locale)',
      type: 'text',
      rows: 3,
      description: 'New per-locale excerpt. Legacy localized excerpt fields remain available below.',
    }),
    defineField({
      name: 'slugPlain',
      title: 'Slug (per-locale)',
      type: 'slug',
      options: {
        source: 'titlePlain',
      },
      description: 'New per-locale slug. Legacy localized slugs remain available below.',
    }),
    defineField({
      name: 'bodyPlain',
      title: 'Body (per-locale)',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
        },
      ],
      description: 'New per-locale body. Legacy localized body fields remain available below.',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'seoTitlePlain',
      title: 'SEO Title (per-locale)',
      type: 'string',
      description: 'New per-locale SEO title. Legacy localized SEO fields remain available below.',
    }),
    defineField({
      name: 'seoDescriptionPlain',
      title: 'SEO Description (per-locale)',
      type: 'text',
      rows: 3,
      description: 'New per-locale SEO description. Legacy localized SEO fields remain available below.',
    }),
  ],
  preview: {
    select: { titlePlain: 'titlePlain', media: 'mainImage' },
    prepare({ titlePlain, media }) {
      return { title: titlePlain || 'Untitled', media }
    },
  },
  orderings: [
    { title: 'Published (newest first)', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
})
