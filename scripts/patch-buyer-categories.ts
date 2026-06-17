/**
 * Normalize buyerPage.categories[] to objects { _key, label, href?, icon? }.
 * Converts legacy plain-string items; preserves all labels and existing href/icon data.
 * Touches ONLY the categories field.
 *
 * Dry run:  DOTENV_CONFIG_PATH=.env.local npx tsx scripts/patch-buyer-categories.ts
 * Apply:    DOTENV_CONFIG_PATH=.env.local npx tsx scripts/patch-buyer-categories.ts --write
 */

import 'dotenv/config'
import { createClient } from '@sanity/client'

const projectId = 'r1yazroc'
const dataset = 'production'
const apiVersion = '2024-01-01'

const SLUG = 'heavy-equipment'
const EXPECTED_LOCALES = ['nl-be', 'fr-be', 'en-be', 'de', 'pl', 'ro', 'hu', 'bg', 'sk', 'sl'] as const

type CategoryObject = {
  _key?: string
  label?: string
  href?: string
  icon?: unknown
}

type CategoryInput = string | CategoryObject

type BuyerDoc = {
  _id: string
  locale?: string
  'slug'?: string
  categories?: CategoryInput[] | null
}

function stableKey(prefix: string, index: number, label: string): string {
  const slug = label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
  return `${prefix}-${index}-${slug || 'item'}`
}

function labelFromItem(item: CategoryInput): string | null {
  if (typeof item === 'string') return item.trim() || null
  if (item && typeof item === 'object' && typeof item.label === 'string') {
    const label = item.label.trim()
    return label || null
  }
  return null
}

function describeBefore(item: CategoryInput): string {
  if (typeof item === 'string') return `string:"${item.trim()}"`
  if (item && typeof item === 'object') {
    const label = labelFromItem(item)
    const parts = [`object:"${label ?? '?'}"`]
    if (item._key) parts.push(`_key=${item._key}`)
    if (item.href) parts.push('href=yes')
    if (item.icon) parts.push('icon=yes')
    return parts.join(' ')
  }
  return String(item)
}

function normalizeCategories(
  categories: CategoryInput[] | null | undefined,
  docId: string
): { changed: boolean; next: CategoryObject[] } {
  if (!Array.isArray(categories) || categories.length === 0) {
    return { changed: false, next: [] }
  }

  const prefix = docId.replace(/^drafts\./, '').replace(/[^a-zA-Z0-9]+/g, '-')
  const next: CategoryObject[] = []
  let changed = false

  categories.forEach((item, index) => {
    if (typeof item === 'string') {
      const label = item.trim()
      if (!label) return
      next.push({ _key: stableKey(prefix, index, label), label })
      changed = true
      return
    }

    if (!item || typeof item !== 'object') return

    const label = typeof item.label === 'string' ? item.label.trim() : ''
    if (!label) return

    const normalized: CategoryObject = {
      _key: item._key || stableKey(prefix, index, label),
      label,
    }
    if (item.href) normalized.href = item.href
    if (item.icon) normalized.icon = item.icon

    if (!item._key) changed = true
    next.push(normalized)
  })

  if (!changed && next.length !== categories.length) changed = true

  return { changed, next }
}

async function main() {
  const write = process.argv.includes('--write')
  const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN

  if (!token) {
    console.error('Missing SANITY_API_READ_TOKEN or SANITY_API_WRITE_TOKEN')
    process.exit(1)
  }

  if (write && !process.env.SANITY_API_WRITE_TOKEN) {
    console.error('Missing SANITY_API_WRITE_TOKEN for --write')
    process.exit(1)
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  })

  const docs = await client.fetch<BuyerDoc[]>(
    `*[_type == "buyerPage" && slug.current == $slug]{
      _id,
      locale,
      "slug": slug.current,
      categories
    }`,
    { slug: SLUG }
  )

  const byLocale = new Map<string, BuyerDoc>()
  for (const doc of docs) {
    if (doc.locale) byLocale.set(doc.locale, doc)
  }

  console.log(`Scope: buyerPage slug="${SLUG}" only (_type == "buyerPage")\n`)
  console.log(`Found ${docs.length} document(s) in Sanity for slug "${SLUG}".\n`)

  let patchCount = 0
  let stringItemCount = 0

  for (const locale of EXPECTED_LOCALES) {
    const doc = byLocale.get(locale)
    console.log(`--- ${locale} ---`)

    if (!doc) {
      console.log('  status: no document found')
      console.log('')
      continue
    }

    const raw = doc.categories ?? []
    const beforeLabels = raw.map((item) => labelFromItem(item)).filter(Boolean) as string[]
    const stringsInDoc = raw.filter((item) => typeof item === 'string')
    stringItemCount += stringsInDoc.length

    if (raw.length === 0) {
      console.log(`  doc: ${doc._id}`)
      console.log('  status: no categories (skip)')
      console.log('')
      continue
    }

    const { changed, next } = normalizeCategories(raw, doc._id)
    const afterLabels = next.map((item) => item.label).filter(Boolean) as string[]

    console.log(`  doc: ${doc._id}`)
    console.log(`  before (${raw.length}): ${beforeLabels.join(' | ') || '(none)'}`)
    console.log(`  after  (${next.length}): ${afterLabels.join(' | ') || '(none)'}`)

    if (stringsInDoc.length > 0) {
      console.log(`  string → object (${stringsInDoc.length}):`)
      stringsInDoc.forEach((item, i) => {
        const label = typeof item === 'string' ? item.trim() : ''
        const matched = next.find((n) => n.label === label)
        console.log(`    [${i}] "${label}" → { _key: "${matched?._key ?? '?'}", label: "${label}" }`)
      })
    } else {
      console.log('  string → object: none')
    }

    if (!changed) {
      console.log('  patch: skip (already normalized objects)')
      console.log('')
      continue
    }

    patchCount++
    console.log('  patch: would update categories field')
    console.log('  detail:')
    raw.forEach((item, i) => {
      const nextItem = next[i]
      console.log(`    ${describeBefore(item)}`)
      console.log(
        `      → object:"${nextItem?.label ?? '?'}" _key=${nextItem?._key ?? '?'}${nextItem?.href ? ' href=yes' : ''}`
      )
    })
    console.log('')

    if (write) {
      await client.patch(doc._id).set({ categories: next }).commit()
    }
  }

  console.log('=== Summary ===')
  console.log(`Scope: buyerPage / ${SLUG} only`)
  console.log(`Locales checked: ${EXPECTED_LOCALES.length}`)
  console.log(`Documents in Sanity: ${docs.length}`)
  console.log(`Legacy string items: ${stringItemCount}`)
  console.log(`Documents to patch: ${patchCount}`)
  console.log(write ? 'Write complete.' : 'Dry run only — re-run with --write to apply.')
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
