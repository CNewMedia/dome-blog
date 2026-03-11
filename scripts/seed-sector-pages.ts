/**
 * Seed new sectorPage documents (minimal required + defaults).
 * Does not overwrite existing documents (skips when locale + slug already exists).
 * After running, optionally: npm run backfill:sector:write
 *
 * Run: npx tsx scripts/seed-sector-pages.ts [--write]
 * Requires: SANITY_API_WRITE_TOKEN in env for --write.
 */
import 'dotenv/config'
import { createClient } from '@sanity/client'
import { groq } from 'next-sanity'

const activeLocales = ['nl-be', 'fr-be', 'en-be'] as const

/** Next 2–3 sector pages: woodworking (fr-be, en-be) + metalworking (nl-be) */
const SEED_ENTRIES: Array<{
  locale: (typeof activeLocales)[number]
  slug: string
  heroTitle: string
  translationKey: string
}> = [
  { locale: 'en-be', slug: 'woodworking', heroTitle: 'Woodworking', translationKey: 'woodworking' },
  { locale: 'fr-be', slug: 'travail-du-bois', heroTitle: 'Travail du bois', translationKey: 'woodworking' },
  { locale: 'nl-be', slug: 'metaalbewerking', heroTitle: 'Metaalbewerking', translationKey: 'metalworking' },
]

const GROQ_EXISTING = groq`*[_type == "sectorPage" && defined(locale)] {
  "key": locale + "/" + coalesce(slug.current, "")
}`

async function main() {
  const doWrite = process.argv.includes('--write')
  const client = createClient({
    projectId: 'r1yazroc',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: !doWrite,
    token: doWrite ? process.env.SANITY_API_WRITE_TOKEN : undefined,
  })

  const existing = await client.fetch<{ key: string }[]>(GROQ_EXISTING)
  const existingSet = new Set(existing.map((r) => r.key))

  console.log('Planned sectorPage documents (from SEED_ENTRIES):')
  const toCreate: typeof SEED_ENTRIES = []
  for (const entry of SEED_ENTRIES) {
    const key = `${entry.locale}/${entry.slug}`
    if (existingSet.has(key)) {
      console.log(`  Skip ${key} (already exists)`)
    } else {
      console.log(`  Create ${key}  "${entry.heroTitle}"`)
      toCreate.push(entry)
    }
  }
  console.log('')

  if (toCreate.length === 0) {
    console.log('Nothing to create.')
    return
  }

  if (!doWrite) {
    console.log('Dry run. Run with --write to create documents.')
    console.log('Requires SANITY_API_WRITE_TOKEN in the environment.')
    return
  }

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error('SANITY_API_WRITE_TOKEN is required for --write.')
    process.exit(1)
  }

  for (const entry of toCreate) {
    const doc = {
      _type: 'sectorPage' as const,
      slug: { _type: 'slug' as const, current: entry.slug },
      locale: entry.locale,
      heroTitle: entry.heroTitle,
      translationKey: entry.translationKey,
    }
    try {
      await client.create(doc)
      console.log(`  Created: ${entry.locale}/${entry.slug}`)
    } catch (e) {
      console.error(`  Failed ${entry.locale}/${entry.slug}:`, e)
    }
  }

  console.log('')
  console.log('Done. Run "npm run backfill:sector:write" to fill section defaults on new docs.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
