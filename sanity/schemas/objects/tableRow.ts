import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'tableRow',
  title: 'Table row',
  type: 'object',
  fields: [
    defineField({
      name: 'cells',
      title: 'Cells',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { cells: 'cells' },
    prepare({ cells }: { cells?: string[] }) {
      const text = Array.isArray(cells) ? cells.join(' | ') : ''
      return { title: text.slice(0, 60) + (text.length > 60 ? '…' : '') }
    },
  },
})
