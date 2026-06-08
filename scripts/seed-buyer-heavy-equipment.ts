/**
 * Seed buyerPage documents for the heavy-equipment auction landing (10 locales).
 *
 * Dry run:  npx tsx scripts/seed-buyer-heavy-equipment.ts
 * Apply:     DOTENV_CONFIG_PATH=.env.local npx tsx scripts/seed-buyer-heavy-equipment.ts --write
 *
 * Reads: scripts/data/buyer-heavy-equipment-copy.json
 * Requires SANITY_API_WRITE_TOKEN for --write.
 */

import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { createClient } from '@sanity/client'

const projectId = 'r1yazroc'
const dataset = 'production'
const apiVersion = '2024-01-01'

const EXPECTED_LOCALES = ['nl-be', 'fr-be', 'en-be', 'de', 'pl', 'ro', 'hu', 'bg', 'sk', 'sl'] as const
type BuyerLocale = (typeof EXPECTED_LOCALES)[number]

const TODO_HUBSPOT = '__TODO_HUBSPOT_FORM_ID__'

const SCALAR_COPY_MAP: Record<string, string> = {
  'hero.eyebrow': 'heroEyebrow',
  'hero.title': 'heroTitle',
  'hero.subtitle': 'heroSubtitle',
  'hero.body': 'heroBody',
  'hero.cta': 'heroCtaLabel',
  'hero.ctaSecondary': 'heroCtaSecondary',
  allAuctionsUrl: 'allAuctionsUrl',
  'nav.registerCta': 'navRegisterCta',
  'urgency.line': 'urgencyLine',
  'categories.heading': 'categoriesHeading',
  'brands.heading': 'brandsHeading',
  'form.eyebrow': 'formEyebrow',
  'form.title': 'formTitle',
  'form.subtitle': 'formSubtitle',
  'seo.title': 'seoTitle',
  'seo.description': 'seoDescription',
}

type LocaleEntry = {
  publishReady?: boolean
  hubspotFormId?: string
  copy: Record<string, unknown>
}

type CopyFile = {
  translationKey: string
  slug: string
  brandNames: string[]
  locales: Record<string, LocaleEntry>
}

type SeedReportRow = {
  locale: BuyerLocale
  status: 'published' | 'draft'
  hubspotFilled: boolean
  action: 'create' | 'update' | 'skip'
  documentId: string
}

function loadCopyFile(): CopyFile {
  const filePath = path.join(__dirname, 'data', 'buyer-heavy-equipment-copy.json')
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing copy file: ${filePath}`)
  }
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8')) as CopyFile
  if (!raw.translationKey || !raw.slug || !Array.isArray(raw.brandNames) || !raw.locales) {
    throw new Error('Invalid JSON structure: require translationKey, slug, brandNames[], locales{}')
  }
  return raw
}

function validateCopyFile(data: CopyFile) {
  for (const locale of EXPECTED_LOCALES) {
    const entry = data.locales[locale]
    if (!entry?.copy || typeof entry.copy !== 'object') {
      throw new Error(`Missing locales.${locale}.copy in JSON`)
    }
    const heroTitle = entry.copy['hero.title']
    if (typeof heroTitle !== 'string' || !heroTitle.trim()) {
      throw new Error(`Locale ${locale} is missing copy["hero.title"]`)
    }
  }
}

function resolveHubspotId(locale: BuyerLocale, entry: LocaleEntry): string {
  const fromJson = entry.hubspotFormId?.trim()
  if (fromJson && !fromJson.includes('__TODO')) return fromJson
  if (locale === 'nl-be') {
    const envId = process.env.HUBSPOT_FORM_ID?.trim()
    if (envId) return envId
  }
  return fromJson || TODO_HUBSPOT
}

function isHubspotFilled(id: string): boolean {
  return Boolean(id.trim()) && !id.includes('__TODO')
}

function mapCopyToDocument(entry: LocaleEntry, brandNames: string[]) {
  const { copy } = entry
  const doc: Record<string, unknown> = { brandNames: [...brandNames] }

  for (const [copyKey, field] of Object.entries(SCALAR_COPY_MAP)) {
    const value = copy[copyKey]
    if (typeof value === 'string' && value.trim()) {
      doc[field] = value.trim()
    }
  }

  if (Array.isArray(copy['auctionCards'])) {
    doc.auctionCards = copy['auctionCards']
  }
  if (Array.isArray(copy['categories'])) {
    doc.categories = copy['categories']
  }
  if (Array.isArray(copy['brands'])) {
    doc.brands = copy['brands']
  }

  const newsletter = {
    heading: typeof copy['newsletter.heading'] === 'string' ? copy['newsletter.heading'] : undefined,
    placeholder: typeof copy['newsletter.placeholder'] === 'string' ? copy['newsletter.placeholder'] : undefined,
    button: typeof copy['newsletter.button'] === 'string' ? copy['newsletter.button'] : undefined,
  }
  if (newsletter.heading || newsletter.placeholder || newsletter.button) {
    doc.newsletter = newsletter
  }

  const pageFooter = {
    about: typeof copy['footer.about'] === 'string' ? copy['footer.about'] : undefined,
    faq: typeof copy['footer.faq'] === 'string' ? copy['footer.faq'] : undefined,
    contact: typeof copy['footer.contact'] === 'string' ? copy['footer.contact'] : undefined,
  }
  if (pageFooter.about || pageFooter.faq || pageFooter.contact) {
    doc.pageFooter = pageFooter
  }

  return doc
}

function documentIdFor(locale: BuyerLocale, published: boolean): string {
  const base = `buyerPage.heavy-equipment.${locale}`
  return published ? base : `drafts.${base}`
}

function oppositeDocumentId(locale: BuyerLocale, published: boolean): string {
  return published ? `drafts.buyerPage.heavy-equipment.${locale}` : `buyerPage.heavy-equipment.${locale}`
}

async function main() {
  const write = process.argv.includes('--write')
  const token = process.env.SANITY_API_WRITE_TOKEN

  if (write && !token) {
    console.error('Missing SANITY_API_WRITE_TOKEN for --write')
    process.exit(1)
  }

  const data = loadCopyFile()
  validateCopyFile(data)

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: token || undefined,
  })

  const report: SeedReportRow[] = []

  for (const locale of EXPECTED_LOCALES) {
    const entry = data.locales[locale]
    const hubspotFormId = resolveHubspotId(locale, entry)
    const hubspotFilled = isHubspotFilled(hubspotFormId)
    const published = Boolean(entry.publishReady) && hubspotFilled
    const docId = documentIdFor(locale, published)
    const oppositeId = oppositeDocumentId(locale, published)

    const existing = write
      ? await client.fetch<{ _id: string } | null>(
          `*[_id in [$id, $oppositeId]][0]{ _id }`,
          { id: docId, oppositeId }
        )
      : null

    const action: SeedReportRow['action'] = existing ? 'update' : 'create'

    const document = {
      _id: docId,
      _type: 'buyerPage',
      locale,
      translationKey: data.translationKey,
      slug: { _type: 'slug', current: data.slug },
      hubspotFormId,
      ...mapCopyToDocument(entry, data.brandNames),
    }

    report.push({
      locale,
      status: published ? 'published' : 'draft',
      hubspotFilled,
      action,
      documentId: docId,
    })

    if (!write) {
      console.log(`[dry-run] ${locale} → ${published ? 'PUBLISHED' : 'DRAFT'} (${docId})`)
      continue
    }

    await client.createOrReplace(document)
    const stale = await client.fetch<{ _id: string } | null>(`*[_id == $id][0]{ _id }`, { id: oppositeId })
    if (stale?._id) {
      await client.delete(stale._id)
    }
  }

  console.log('\n=== Seed report ===')
  console.log('locale | status | hubspot | action | documentId')
  for (const row of report) {
    console.log(
      `${row.locale} | ${row.status} | ${row.hubspotFilled ? 'yes' : 'no'} | ${row.action} | ${row.documentId}`
    )
  }

  if (!write) {
    console.log('\nDry run only — no writes performed. Re-run with --write to apply.')
  } else {
    console.log('\nWrite complete.')
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
