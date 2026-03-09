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
      description: 'Language and region for this article (for example nl-be, fr-be or en-be).',
    }),
    defineField({
      name: 'translationKey',
      title: 'Translation group',
      type: 'string',
      description: 'Optional ID to link this article to its other language versions.',
    }),
    defineField({
      name: 'titlePlain',
      title: 'Title',
      type: 'string',
      description: 'Headline for this article in this language.',
    }),
    defineField({
      name: 'excerptPlain',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short intro that appears in blog lists and previews.',
    }),
    defineField({
      name: 'slugPlain',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'titlePlain',
      },
      description: ((context: any) => {
        const locale = context?.document?.locale
        const slug = context?.document?.slugPlain?.current

        if (locale && slug) {
          return `Final URL: /${locale}/blog/${slug}`
        }

        return 'Fill in locale and slug to see the final URL.'
      }) as any,
    }),
    defineField({
      name: 'bodyPlain',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
        },
      ],
      description: 'Main content of the article in this language.',
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
      title: 'SEO title',
      type: 'string',
      description: 'Title used for search engines and browser tabs. If empty, the regular title may be used.',
    }),
    defineField({
      name: 'seoDescriptionPlain',
      title: 'SEO description',
      type: 'text',
      rows: 3,
      description: 'Short description for search engines and link previews.',
    }),
  ],
  preview: {
    select: {
      titlePlain: 'titlePlain',
      locale: 'locale',
      slug: 'slugPlain.current',
      media: 'mainImage',
    },
    prepare({ titlePlain, locale, slug, media }) {
      const url =
        locale && slug
          ? `Example URL: /${locale}/blog/${slug}`
          : 'Fill in locale and slug to see the final URL.'
      return {
        title: titlePlain || 'Untitled',
        subtitle: url,
        media,
      }
    },
  },
  orderings: [
    { title: 'Published (newest first)', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
})
