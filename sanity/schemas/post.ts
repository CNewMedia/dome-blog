import { defineType, defineField } from 'sanity'
import { InsightsTranslationPanel } from '../components/InsightsTranslationPanel'

export const postSchema = defineType({
  name: 'post',
  title: 'Insight',
  type: 'document',
  fields: [
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
      name: 'translations',
      title: 'Translations',
      type: 'string',
      readOnly: true,
      components: {
        field: InsightsTranslationPanel as any,
      },
    }),
    defineField({
      name: 'translationKey',
      title: 'Translation group',
      type: 'string',
      description: 'Optional ID to link this article to its other language versions.',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Headline for this article in this language.',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short intro that appears in insights lists and previews.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      description: ((context: any) => {
        const locale = context?.document?.locale
        const slug = context?.document?.slug?.current

        if (locale && slug) {
          return `Final URL: /${locale}/articles/${slug}`
        }

        return 'Fill in locale and slug to see the final URL.'
      }) as any,
    }),
    defineField({
      name: 'body',
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
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
      description: 'Title used for search engines and browser tabs. If empty, the regular title may be used.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 3,
      description: 'Short description for search engines and link previews.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      locale: 'locale',
      slug: 'slug.current',
      media: 'mainImage',
    },
    prepare({ title, locale, slug, media }) {
      const url =
        locale && slug
          ? `Example URL: /${locale}/articles/${slug}`
          : 'Fill in locale and slug to see the final URL.'
      return {
        title: title || 'Untitled',
        subtitle: url,
        media,
      }
    },
  },
  orderings: [
    { title: 'Published (newest first)', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
})
