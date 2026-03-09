import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'footerBottomLink',
  title: 'Footer bottom link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
    }),
    defineField({
      name: 'href',
      title: 'Link / URL',
      type: 'string',
    }),
  ],
})