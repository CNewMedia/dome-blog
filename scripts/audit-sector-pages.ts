/**
 * Audit: list all sectorPage documents in the dataset (new schema vs legacy).
 * Read-only; no writes.
 *
 * Run: npx tsx scripts/audit-sector-pages.ts
 */
import 'dotenv/config'
import { createClient } from '@sanity/client'
import { groq } from 'next-sanity'

const GROQ_ALL = groq`*[_type == "sectorPage"] {
  _id,
  "slugResolved": coalesce(slug.current, lower(sector)),
  sector,
  locale,
  heroTitle
}`

async function main() {
  const client = createClient({
    projectId: 'r1yazroc',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: true,
  })

  console.log('Fetching all sectorPage documents...\n')
  const docs = await client.fetch<Array<{
    _id: string
    slugResolved?: string
    sector?: string
    locale?: string | null
    heroTitle?: string
  }>>(GROQ_ALL)

  const withLocale = docs.filter((d) => d.locale != null && d.locale !== '')
  const legacy = docs.filter((d) => d.locale == null || d.locale === '')

  const slugFromDoc = (d: (typeof docs)[0]) => d.slugResolved ?? d.sector ?? '(no slug)'

  console.log('=== EXISTING sectorPage DOCUMENTS (new schema: have locale) ===')
  console.log('These are used by generateStaticParams and the sitemap.\n')
  if (withLocale.length === 0) {
    console.log('  (none)\n')
  } else {
    withLocale.forEach((d) => {
      const slug = slugFromDoc(d)
      const title = (d.heroTitle ?? '').slice(0, 50)
      console.log(`  ${d.locale}/${slug}  _id: ${d._id}  ${title ? `"${title}…"` : ''}`)
    })
    console.log('')
  }

  console.log('=== LEGACY sectorPage DOCUMENTS (no locale) ===')
  console.log('These can still serve requests via getSectorPageLegacy but are NOT in static params or sitemap.\n')
  if (legacy.length === 0) {
    console.log('  (none)\n')
  } else {
    legacy.forEach((d) => {
      const slug = slugFromDoc(d)
      const title = (d.heroTitle ?? '').slice(0, 50)
      console.log(`  sector=${slug}  _id: ${d._id}  ${title ? `"${title}…"` : ''}`)
    })
    console.log('')
  }

  console.log('=== SUMMARY ===')
  console.log(`  Total sectorPage documents: ${docs.length}`)
  console.log(`  New schema (with locale):  ${withLocale.length}`)
  console.log(`  Legacy (no locale):       ${legacy.length}`)
  console.log('')
  console.log('Routes that get static params / sitemap: only new-schema docs above.')
  console.log('A request like /nl-be/woodworking is served by:')
  console.log('  1. getSectorPage (slug + locale) if a matching new-schema doc exists')
  console.log('  2. else getSectorPageLegacy (sector slug, localized fields) if a legacy doc exists')
  console.log('  3. else 404.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
