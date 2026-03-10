import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'tableBlock',
  title: 'Table',
  type: 'object',
  fields: [
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [{ type: 'tableRow' }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { rows: 'rows' },
    prepare({ rows }: { rows?: { cells?: string[] }[] }) {
      const count = Array.isArray(rows) ? rows.length : 0
      const firstCell = count && rows?.[0]?.cells?.[0] ? rows[0].cells[0].slice(0, 30) : ''
      return { title: `Table: ${firstCell}${firstCell.length >= 30 ? '…' : ''}`, subtitle: `${count} row(s)` }
    },
  },
})
