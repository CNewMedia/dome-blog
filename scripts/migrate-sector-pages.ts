/**
 * One-off migration: convert legacy localized sectorPage documents
 * (one doc per sector with localeString fields) into separate translated
 * documents (one doc per sector + locale). Does not overwrite legacy docs.
 *
 * Run: npx tsx scripts/migrate-sector-pages.ts [--write]
 * Without --write: dry run only (summary printed, no writes).
 * Requires: SANITY_API_WRITE_TOKEN in env for --write.
 */
import 'dotenv/config'
import { createClient } from '@sanity/client'
import { groq } from 'next-sanity'

const TARGET_LOCALES = ['nl', 'nl-be', 'fr-be', 'en'] as const
type TargetLocale = (typeof TARGET_LOCALES)[number]

const LOCALE_TO_LEGACY_KEY: Record<TargetLocale, string> = {
  nl: 'nl',
  'nl-be': 'nl_be',
  'fr-be': 'fr_be',
  en: 'en',
}

interface LocaleObject {
  nl_be?: string | null
  fr_be?: string | null
  en?: string | null
  de?: string | null
  nl?: string | null
  [k: string]: unknown
}

interface LegacySectorPage {
  _id: string
  _type: string
  sector: string
  locale?: string | null
  heroTitle?: LocaleObject | string | null
  heroSubtitle?: LocaleObject | string | null
  content?: Record<string, unknown[] | undefined> | null
  heroImage?: { _type: string; asset?: { _ref: string }; [k: string]: unknown } | null
  contentImage?: { _type: string; asset?: { _ref: string }; [k: string]: unknown } | null
  uspBlocks?: Array<{
    icon?: string
    title?: LocaleObject | string
    description?: LocaleObject | string
    [k: string]: unknown
  }> | null
  machines?: Array<{
    name?: LocaleObject | string
    description?: LocaleObject | string
    image?: { _type: string; asset?: { _ref: string }; [k: string]: unknown }
    [k: string]: unknown
  }> | null
  successStory?: {
    quote?: LocaleObject | string
    company?: LocaleObject | string
    result?: LocaleObject | string
    [k: string]: unknown
  } | null
  ctaFormTitle?: LocaleObject | string | null
  hubspotFormId?: string | null
  seo?: {
    title?: LocaleObject
    description?: LocaleObject
    [k: string]: unknown
  } | null
  [k: string]: unknown
}

function pickLocaleString(
  value: LocaleObject | string | null | undefined,
  legacyKey: string
): string | undefined {
  if (value == null) return undefined
  if (typeof value === 'string') return value
  const v = value[legacyKey]
  return typeof v === 'string' ? v : undefined
}

function pickLocaleContent(
  contentByLocale: Record<string, unknown[] | undefined> | null | undefined,
  legacyKey: string
): unknown[] | undefined {
  if (!contentByLocale || typeof contentByLocale !== 'object') return undefined
  const arr = contentByLocale[legacyKey]
  return Array.isArray(arr) ? arr : undefined
}

const LEGACY_GROQ = groq`*[_type == "sectorPage" && (locale == null || !defined(locale))] {
  _id,
  _type,
  sector,
  locale,
  heroTitle,
  heroSubtitle,
  content,
  heroImage,
  contentImage,
  uspBlocks,
  machines,
  successStory,
  ctaFormTitle,
  hubspotFormId,
  seo
}`

function hasAnyContentForLocale(doc: LegacySectorPage, legacyKey: string): boolean {
  const s = (v: string | undefined) => v != null && String(v).trim() !== ''

  const heroTitle = pickLocaleString(doc.heroTitle, legacyKey)
  const heroSubtitle = pickLocaleString(doc.heroSubtitle, legacyKey)
  const ctaFormTitle = pickLocaleString(doc.ctaFormTitle, legacyKey)
  const seoTitle = doc.seo ? pickLocaleString(doc.seo.title, legacyKey) : undefined
  const seoDescription = doc.seo ? pickLocaleString(doc.seo.description, legacyKey) : undefined
  const content = pickLocaleContent(doc.content, legacyKey)

  return (
    s(heroTitle) ||
    s(heroSubtitle) ||
    s(ctaFormTitle) ||
    s(seoTitle) ||
    s(seoDescription) ||
    (Array.isArray(content) && content.length > 0)
  )
}

function buildNewDocument(
  legacy: LegacySectorPage,
  targetLocale: TargetLocale
): Record<string, unknown> {
  const key = LOCALE_TO_LEGACY_KEY[targetLocale]

  const heroTitle = pickLocaleString(legacy.heroTitle, key)
  const heroSubtitle = pickLocaleString(legacy.heroSubtitle, key)
  const content = pickLocaleContent(legacy.content, key)
  const ctaFormTitle = pickLocaleString(legacy.ctaFormTitle, key)
  const seoTitle = legacy.seo ? pickLocaleString(legacy.seo.title, key) : undefined
  const seoDescription = legacy.seo ? pickLocaleString(legacy.seo.description, key) : undefined

  const uspBlocks = legacy.uspBlocks?.map((block) => ({
    _type: 'object' as const,
    _key: (block as { _key?: string })._key ?? `usp-${Math.random().toString(36).slice(2, 9)}`,
    icon: block.icon,
    title: pickLocaleString(block.title, key) ?? pickLocaleString(block.title, 'nl_be'),
    description:
      pickLocaleString(block.description, key) ?? pickLocaleString(block.description, 'nl_be'),
  }))

  const machines = legacy.machines?.map((m, i) => ({
    _type: 'object' as const,
    _key:
      (m as { _key?: string })._key ?? `machine-${i}-${Math.random().toString(36).slice(2, 9)}`,
    name: pickLocaleString(m.name, key) ?? pickLocaleString(m.name, 'nl_be'),
    description:
      pickLocaleString(m.description, key) ?? pickLocaleString(m.description, 'nl_be'),
    image: m.image ?? undefined,
  }))

  const successStory = legacy.successStory
    ? {
        _type: 'object' as const,
        quote:
          pickLocaleString(legacy.successStory.quote, key) ??
          pickLocaleString(legacy.successStory.quote, 'nl_be'),
        company:
          pickLocaleString(legacy.successStory.company, key) ??
          pickLocaleString(legacy.successStory.company, 'nl_be'),
        result:
          pickLocaleString(legacy.successStory.result, key) ??
          pickLocaleString(legacy.successStory.result, 'nl_be'),
      }
    : undefined

  const doc: Record<string, unknown> = {
    _type: 'sectorPage',
    sector: legacy.sector,
    locale: targetLocale,
    migratedFromLegacy: true,
  }

  if (heroTitle != null && heroTitle !== '') doc.heroTitle = heroTitle
  if (heroSubtitle != null && heroSubtitle !== '') doc.heroSubtitle = heroSubtitle
  if (content != null && content.length > 0) doc.content = content
  if (legacy.heroImage) doc.heroImage = legacy.heroImage
  if (legacy.contentImage) doc.contentImage = legacy.contentImage
  if (uspBlocks && uspBlocks.length > 0) doc.uspBlocks = uspBlocks
  if (machines && machines.length > 0) doc.machines = machines
  if (successStory) doc.successStory = successStory
  if (ctaFormTitle != null && ctaFormTitle !== '') doc.ctaFormTitle = ctaFormTitle
  if (legacy.hubspotFormId) doc.hubspotFormId = legacy.hubspotFormId
  if (seoTitle != null && seoTitle !== '') doc.seoTitle = seoTitle
  if (seoDescription != null && seoDescription !== '') doc.seoDescription = seoDescription

  return doc
}

async function main() {
  const doWrite = process.argv.includes('--write')

  const client = createClient({
    projectId: 'r1yazroc',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: !doWrite,
    token: doWrite ? process.env.SANITY_API_WRITE_TOKEN : undefined,
  })

  console.log('Fetching legacy sectorPage documents (locale == null || !defined(locale))...')
  const legacyDocs = await client.fetch<LegacySectorPage[]>(LEGACY_GROQ)
  console.log(`Found ${legacyDocs.length} legacy document(s).\n`)

  const toCreate: {
    legacyId: string
    sector: string
    locale: TargetLocale
    doc: Record<string, unknown>
  }[] = []

  for (const doc of legacyDocs) {
    for (const targetLocale of TARGET_LOCALES) {
      const legacyKey = LOCALE_TO_LEGACY_KEY[targetLocale]
      if (!hasAnyContentForLocale(doc, legacyKey)) continue
      toCreate.push({
        legacyId: doc._id,
        sector: doc.sector,
        locale: targetLocale,
        doc: buildNewDocument(doc, targetLocale),
      })
    }
  }

  console.log('--- DRY RUN SUMMARY ---')
  console.log(`Planned new documents: ${toCreate.length}`)
  if (toCreate.length > 0) {
    console.log('')
    for (const { legacyId, sector, locale, doc } of toCreate) {
      const title = (doc.heroTitle as string) || '(no hero title)'
      console.log(`  • sector="${sector}" locale="${locale}"  (from legacy ${legacyId})`)
      console.log(`    heroTitle: ${String(title).slice(0, 60)}${String(title).length > 60 ? '…' : ''}`)
    }
  }
  console.log('')

  if (!doWrite) {
    console.log('No writes performed. Run with --write to create documents.')
    console.log('Requires SANITY_API_WRITE_TOKEN in the environment.')
    return
  }

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error('SANITY_API_WRITE_TOKEN is required for --write.')
    process.exit(1)
  }

  console.log('Creating new documents...')
  let created = 0
  for (const { doc } of toCreate) {
    try {
      await client.create({ ...doc, _type: 'sectorPage' } as Parameters<typeof client.create>[0])
      created++
      console.log(`  Created: sector=${doc.sector} locale=${doc.locale}`)
    } catch (e) {
      console.error(`  Failed to create sector=${doc.sector} locale=${doc.locale}:`, e)
    }
  }

  console.log(`\nDone. Created ${created} document(s). Legacy documents were not modified.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})