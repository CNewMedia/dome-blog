import { defineType, defineField } from 'sanity'

const locales = ['en', 'nl-be', 'fr-be', 'de']

const localizedString = (name: string, title: string) =>
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

const localizedText = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: locales.map((locale) => ({
      name: locale.replace('-', '_'),
      title: locale.toUpperCase(),
      type: 'text',
      rows: 3,
    })),
  })

const localizedBody = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: locales.map((locale) => ({
      name: locale.replace('-', '_'),
      title: locale.toUpperCase(),
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
        },
      ],
    })),
  })

export const postSchema = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    localizedString('title', 'Title'),
    localizedText('excerpt', 'Excerpt'),
    localizedBody('body', 'Body'),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'object',
      fields: locales.map((locale) => ({
        name: locale.replace('-', '_'),
        title: locale.toUpperCase(),
        type: 'slug',
        options: { source: `title.${locale.replace('-', '_')}` },
      })),
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
    localizedString('seoTitle', 'SEO Title'),
    localizedText('seoDescription', 'SEO Description'),
  ],
  preview: {
    select: { title: 'title.en', media: 'mainImage' },
    prepare({ title, media }) {
      return { title: title || 'Untitled', media }
    },
  },
  orderings: [
    { title: 'Published (newest first)', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
})
