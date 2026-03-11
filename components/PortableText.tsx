import { PortableText as PT } from '@portabletext/react'
import { urlFor } from '../sanity/client'

const components = {
  types: {
    image: ({ value }: any) => (
      <img
        src={urlFor(value).width(800).url()}
        alt={value.alt || ''}
        loading="lazy"
        style={{ maxWidth: '100%', height: 'auto', margin: '2rem 0', display: 'block' }}
      />
    ),
    tableBlock: ({ value }: any) => {
      const rows = value?.rows ?? []
      if (rows.length === 0) return null
      const [headRow, ...bodyRows] = rows
      const cellStyle = {
        padding: '0.6rem 0.75rem',
        verticalAlign: 'top' as const,
        borderBottom: '1px solid #e0e0e0',
      }
      return (
        <div style={{ margin: '2rem 0', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table
            style={{
              width: '100%',
              minWidth: 'min(100%, 400px)',
              borderCollapse: 'collapse',
              fontSize: '0.95rem',
              lineHeight: 1.5,
            }}
          >
            {headRow?.cells?.length ? (
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  {headRow.cells.map((cell: string, ci: number) => (
                    <th key={ci} style={{ ...cellStyle, fontWeight: 600, textAlign: 'left' }}>
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
            ) : null}
            <tbody>
              {bodyRows.map((row: { cells?: string[] }, ri: number) => (
                <tr key={ri}>
                  {(row.cells ?? []).map((cell: string, ci: number) => (
                    <td key={ci} style={cellStyle}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    },
  },
  marks: {
    strong: ({ children }: any) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
    em: ({ children }: any) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
    link: ({ value, children }: any) => (
      <a href={value.href} target="_blank" rel="noopener noreferrer"
        style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>
        {children}
      </a>
    ),
  },
  block: {
    h2: ({ children }: any) => <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1rem', paddingBottom: '0.6rem', borderBottom: '1px solid #e0e0e0', letterSpacing: '-0.02em' }}>{children}</h2>,
    h3: ({ children }: any) => <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.75rem' }}>{children}</h3>,
    normal: ({ children }: any) => <p style={{ marginBottom: '1.25rem', lineHeight: 1.85 }}>{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote style={{ borderLeft: '4px solid #000', padding: '1rem 1.5rem', background: '#f9f9f9', fontStyle: 'italic', margin: '2rem 0' }}>
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem' }}>{children}</ul>,
    number: ({ children }: any) => <ol style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem' }}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li style={{ marginBottom: '0.4rem', lineHeight: 1.7 }}>{children}</li>,
    number: ({ children }: any) => <li style={{ marginBottom: '0.4rem', lineHeight: 1.7 }}>{children}</li>,
  },
}

export default function PortableText({ value }: { value: any }) {
  if (!value) return null
  return <PT value={value} components={components} />
}
