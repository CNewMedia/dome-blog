import { defineType, defineField } from 'sanity'

export const sectorPageSchema = defineType({
  name: 'sectorPage',
  title: 'Sector Landing Page',
  type: 'document',
  fieldsets: [
    { name: 'basic', title: 'Basic', options: { collapsible: false } },
    { name: 'hero', title: 'Hero', options: { collapsible: false } },
    { name: 'stats', title: 'Stats', options: { collapsible: true, collapsed: true } },
    { name: 'process', title: 'Process', options: { collapsible: true, collapsed: true } },
    { name: 'content', title: 'Content', options: { collapsible: true, collapsed: true } },
    { name: 'usp', title: 'USP', options: { collapsible: true, collapsed: true } },
    { name: 'machines', title: 'Machines', options: { collapsible: true, collapsed: true } },
    { name: 'testimonial', title: 'Testimonial', options: { collapsible: true, collapsed: true } },
    { name: 'team', title: 'Team', options: { collapsible: true, collapsed: true } },
    { name: 'contact', title: 'Contact', options: { collapsible: true, collapsed: true } },
    { name: 'seo', title: 'SEO', options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    defineField({
      name: 'slug',
      fieldset: 'basic',
      title: 'Slug',
      type: 'slug',
      description: 'URL segment for this landing page in this language, for example woodworking or metalworking. Lowercase and hyphen-separated.',
      options: {
        source: 'heroTitle',
        slugify: (input: string) =>
          input
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, ''),
      },
      validation: (Rule) =>
        Rule.required().custom((value) => {
          const v = value?.current
          if (!v) return 'Slug is required.'
          if (v !== v.toLowerCase()) return 'Slug must be lowercase.'
          if (v === 'articles') return '"articles" is reserved for insight detail URLs. Please choose a different slug.'
          return true
        }),
    }),
    defineField({
      name: 'translationKey',
      title: 'Translation group',
      type: 'string',
      description: 'Optional ID to link this landing page to its other language versions.',
      fieldset: 'basic',
    }),
    defineField({
      name: 'locale',
      fieldset: 'basic',
      title: 'Taal',
      type: 'string',
      options: {
        list: [
          { title: 'Nederlands (België)', value: 'nl-be' },
          { title: 'Français (Belgique)', value: 'fr-be' },
          { title: 'English (Belgium)', value: 'en-be' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroTitle',
      fieldset: 'hero',
      title: 'Hero title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      fieldset: 'hero',
      title: 'Hero subtitle',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'heroImage',
      fieldset: 'hero',
      title: 'Hero image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
    defineField({
      name: 'heroEyebrow',
      fieldset: 'hero',
      title: 'Hero eyebrow',
      type: 'string',
      description: 'Small label above the hero title (e.g. Sector).',
    }),
    defineField({
      name: 'heroCtaLabel',
      fieldset: 'hero',
      title: 'Hero CTA label',
      type: 'string',
      description: 'Primary button text (e.g. Vraag een gesprek aan).',
    }),
    defineField({
      name: 'heroCtaHref',
      fieldset: 'hero',
      title: 'Hero CTA URL',
      type: 'string',
      description: 'Link for the hero button (e.g. #cta-form or full URL).',
    }),
    defineField({
      name: 'heroSectionVisible',
      fieldset: 'hero',
      title: 'Show hero section',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'statsSection',
      fieldset: 'stats',
      title: 'Statistics section',
      type: 'object',
      fields: [
        { name: 'isVisible', title: 'Show section', type: 'boolean', initialValue: true },
        {
          name: 'items',
          title: 'Statistics',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'value', title: 'Value', type: 'string', validation: (Rule: any) => Rule.required() },
                { name: 'label', title: 'Label', type: 'string', validation: (Rule: any) => Rule.required() },
              ],
              preview: { select: { title: 'value', subtitle: 'label' } },
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'processSection',
      fieldset: 'process',
      title: 'Process steps section',
      type: 'object',
      fields: [
        { name: 'isVisible', title: 'Show section', type: 'boolean', initialValue: true },
        { name: 'eyebrow', title: 'Eyebrow', type: 'string' },
        { name: 'title', title: 'Section title', type: 'string' },
        {
          name: 'steps',
          title: 'Steps',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: 'Title', type: 'string', validation: (Rule: any) => Rule.required() },
                { name: 'description', title: 'Description', type: 'text', rows: 2 },
              ],
              preview: { select: { title: 'title' } },
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'contentSectionVisible',
      fieldset: 'content',
      title: 'Show content section',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'content',
      fieldset: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          options: {
            styles: [
              { title: 'Normal', value: 'normal' },
              { title: 'H2', value: 'h2' },
              { title: 'H3', value: 'h3' },
            ],
          },
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{ name: 'href', type: 'url', title: 'URL' }],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
        },
      ],
    }),
    defineField({
      name: 'contentImage',
      fieldset: 'content',
      title: 'Content afbeelding',
      type: 'image',
      options: { hotspot: true },
      description:
        'Afbeelding naast de contenttekst (desktop). Optioneel; anders wordt de hero-afbeelding gebruikt.',
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
    defineField({
      name: 'uspBlocks',
      fieldset: 'usp',
      title: 'USP blocks',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Icon name or identifier (e.g. speed, personal)',
            },
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 3 },
          ],
          preview: {
            select: { title: 'title' },
            prepare({ title }) {
              return { title: title || 'USP block' }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'uspSectionEyebrow',
      fieldset: 'usp',
      title: 'USP section eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'uspSectionTitle',
      fieldset: 'usp',
      title: 'USP section title',
      type: 'string',
    }),
    defineField({
      name: 'uspSectionVisible',
      fieldset: 'usp',
      title: 'Show USP section',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'machines',
      fieldset: 'machines',
      title: 'Machine categories',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Name', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 2 },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
            },
            { name: 'buttonLabel', title: 'Button label', type: 'string', description: 'Optional CTA text (e.g. Bekijk machines).' },
            { name: 'buttonHref', title: 'Button URL', type: 'string', description: 'Link for the button. Leave empty to hide the button.' },
            { name: 'openInNewTab', title: 'Open in new tab', type: 'boolean', initialValue: false, description: 'Open link in a new tab.' },
          ],
          preview: {
            select: { title: 'name' },
            prepare({ title }) {
              return { title: title || 'Machine' }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'machinesSectionVisible',
      fieldset: 'machines',
      title: 'Show machines section',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'successStory',
      fieldset: 'testimonial',
      title: 'Success story / case reference',
      type: 'object',
      fields: [
        { name: 'quote', title: 'Quote', type: 'text', rows: 4 },
        { name: 'company', title: 'Company', type: 'string' },
        { name: 'result', title: 'Result', type: 'string', description: 'Short result or outcome' },
      ],
    }),
    defineField({
      name: 'testimonialSectionVisible',
      fieldset: 'testimonial',
      title: 'Show testimonial section',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'teamSectionEyebrow',
      fieldset: 'team',
      title: 'Team section eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'teamSectionTitle',
      fieldset: 'team',
      title: 'Team section title',
      type: 'string',
    }),
    defineField({
      name: 'teamSectionVisible',
      fieldset: 'team',
      title: 'Show team section',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'contactSectionEyebrow',
      fieldset: 'contact',
      title: 'Contact section eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'contactSectionSubtitle',
      fieldset: 'contact',
      title: 'Contact section subtitle',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'contactSectionVisible',
      fieldset: 'contact',
      title: 'Show contact section',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'ctaFormTitle',
      fieldset: 'contact',
      title: 'CTA form title',
      type: 'string',
    }),
    defineField({
      name: 'hubspotFormId',
      fieldset: 'contact',
      title: 'HubSpot form ID',
      type: 'string',
      description: 'Sector-specific HubSpot form ID for lead capture',
    }),
    defineField({
      name: 'seoTitle',
      fieldset: 'seo',
      title: 'SEO title',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      fieldset: 'seo',
      title: 'SEO description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'ogImage',
      fieldset: 'seo',
      title: 'Open Graph image',
      type: 'image',
      options: { hotspot: true },
      description: 'Social sharing image. Falls back to hero image if empty.',
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
  ],
  preview: {
    select: {
      slug: 'slug.current',
      locale: 'locale',
      heroTitle: 'heroTitle',
    },
    prepare({ slug, locale, heroTitle }) {
      const title = heroTitle || slug || 'Untitled landing page'
      const loc = locale || 'no-locale'
      return {
        title,
        subtitle: `${loc} · /${loc}/${slug}`,
      }
    },
  },
})
