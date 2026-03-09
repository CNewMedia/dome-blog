import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'footerColumn',
  title: 'Footer kolom',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Kolomtitel',
      type: 'string',
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [{type: 'menuItem'}],
    }),
  ],
})