/**
 * One-off migration: convert legacy multi-locale blog posts
 * (one document with EN / NL-BE / FR-BE / DE fields) into
 * separate per-locale documents (one document per locale).
 *
 * IMPORTANT:
 * - This script ONLY CREATES new documents, it does NOT delete or update legacy ones.
 * - Run on a backup / staging environment first.
 * - After running and verifying, you can switch queries to rely purely on locale-based docs.
 *
 * Run (dry run):
 *   npx tsx scripts/migrate-blog-posts.ts
 *
 * Run (write):
 *   npx tsx scripts/migrate-blog-posts.ts --write
 *   Requires: SANITY_API_WRITE_TOKEN in env for writes.
 */

import 'dotenv/config'
import { createClient } from '@sanity/client'
import { groq } from 'next-sanity'

const TARGET_LOCALES = ['nl-be', 'fr-be', 'en-be'] as const
type TargetLocale = (typeof TARGET_LOCALES)[number]

// Map app locales to legacy field keys on the post document
const LOCALE_TO_LEGACY_KEY: Record<TargetLocale, string> = {
  'nl-be': 'nl_be',
  'fr-be': 'fr_be',
  'en-be': 'en',
}

type LocaleStringMap = {
  nl_be?: string | null
  fr_be?: string | null
  en?: string | null
  de?: string | null
  [k: string]: unknown
}

type LocaleBodyMap = {
  nl_be?: unknown[] | null
  fr_be?: unknown[] | null
  en?: unknown[] | null
  de?: unknown[] | null
  [k: string]: unknown
}

type LocaleSlugMap = {
  nl_be?: { current?: string | null } | null
  fr_be?: { current?: string | null } | null
  en?: { current?: string | null } | null
  de?: { current?: string | null } | null
  [k: string]: unknown
}

interface LegacyPost {
  _id: string
  _type: 'post'
  locale?: string | null
  title?: LocaleStringMap | null
  excerpt?: LocaleStringMap | null
  body?: LocaleBodyMap | null
  slug?: LocaleSlugMap | null
  mainImage?: { _type: string; asset?: { _ref: string }; [k: string]: unknown } | null
  categories?: { _type: 'reference'; _ref: string }[] | null
  publishedAt?: string | null
  author?: string | null
  seoTitle?: LocaleStringMap | null
  seoDescription?: LocaleStringMap | null
  [k: string]: unknown
}

function pickLocaleString(
  value: LocaleStringMap | string | null | undefined,
  legacyKey: string
): string | undefined {
  if (value == null) return undefined
  if (typeof value === 'string') return value
  const v = value[legacyKey]
  return typeof v === 'string' ? v : undefined
}

function pickLocaleBody(
  value: LocaleBodyMap | null | undefined,
  legacyKey: string
): unknown[] | undefined {
  if (!value || typeof value !== 'object') return undefined
  const arr = value[legacyKey]
  return Array.isArray(arr) ? arr : undefined
}

function pickLocaleSlug(
  value: LocaleSlugMap | null | undefined,
  legacyKey: string
): string | undefined {
  if (!value || typeof value !== 'object') return undefined
  const entry = value[legacyKey] as { current?: string | null } | null | undefined
  const slug = entry?.current
  return slug && String(slug).trim() !== '' ? String(slug) : undefined
}

const LEGACY_POSTS_GROQ = groq`*[_type == "post" && !defined(locale)]{
  _id,
  _type,
  locale,
  title,
  excerpt,
  body,
  slug,
  mainImage,
  categories,
  publishedAt,
  author,
  seoTitle,
  seoDescription
}`

function buildNewPostFromLegacy(
  doc: LegacyPost,
  targetLocale: TargetLocale
): Record<string, unknown> | null {
  const legacyKey = LOCALE_TO_LEGACY_KEY[targetLocale]

  const title = pickLocaleString(doc.title ?? null, legacyKey)
  const slug = pickLocaleSlug(doc.slug ?? null, legacyKey)

  // Require at least title and slug for a new localized doc
  if (!title || !slug) return null

  const excerpt = pickLocaleString(doc.excerpt ?? null, legacyKey)
  const body = pickLocaleBody(doc.body ?? null, legacyKey)
  const seoTitle = pickLocaleString(doc.seoTitle ?? null, legacyKey)
  const seoDescription = pickLocaleString(doc.seoDescription ?? null, legacyKey)

  const newDoc: Record<string, unknown> = {
    _type: 'post',
    locale: targetLocale,
    translationKey: doc._id,
    titlePlain: title,
    slugPlain: { _type: 'slug', current: slug },
    migratedFromLegacy: true,
  }

  if (excerpt && excerpt.trim() !== '') newDoc.excerptPlain = excerpt
  if (body && body.length > 0) newDoc.bodyPlain = body
  if (seoTitle && seoTitle.trim() !== '') newDoc.seoTitlePlain = seoTitle
  if (seoDescription && seoDescription.trim() !== '') newDoc.seoDescriptionPlain = seoDescription

  if (doc.mainImage) newDoc.mainImage = doc.mainImage
  if (doc.categories && doc.categories.length > 0) newDoc.categories = doc.categories
  if (doc.publishedAt) newDoc.publishedAt = doc.publishedAt
  if (doc.author) newDoc.author = doc.author

  return newDoc
}

async function main() {
  const doWrite = process.argv.includes('--write')

  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'r1yazroc',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
    useCdn: false,
    token: doWrite ? process.env.SANITY_API_WRITE_TOKEN : undefined,
  })

  console.log('Fetching legacy multi-locale blog posts (post documents without locale)...')
  const legacyPosts = await client.fetch<LegacyPost[]>(LEGACY_POSTS_GROQ)
  console.log(`Found ${legacyPosts.length} legacy post(s).\n`)

  const toCreate: { legacyId: string; locale: TargetLocale; doc: Record<string, unknown> }[] = []

  for (const post of legacyPosts) {
    for (const targetLocale of TARGET_LOCALES) {
      const newDoc = buildNewPostFromLegacy(post, targetLocale)
      if (!newDoc) continue
      toCreate.push({ legacyId: post._id, locale: targetLocale, doc: newDoc })
    }
  }

  console.log('--- DRY RUN SUMMARY ---')
  console.log(`Planned new localized post documents: ${toCreate.length}\n`)
  for (const { legacyId, locale, doc } of toCreate) {
    const title = String(doc.titlePlain ?? '').slice(0, 60)
    const slug = (doc.slugPlain as { current?: string })?.current ?? ''
    console.log(`  • ${legacyId} → locale="${locale}", slug="${slug}"`)
    console.log(`    title: ${title}${(doc.titlePlain as string)?.length > 60 ? '…' : ''}`)
  }
  console.log('')

  if (!doWrite) {
    console.log('No writes performed. Run with --write to create new documents.')
    return
  }

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error('SANITY_API_WRITE_TOKEN is required for --write.')
    process.exit(1)
  }

  console.log('Creating new localized post documents...')
  let created = 0
  for (const { legacyId, locale, doc } of toCreate) {
    try {
      await client.create(doc)
      created++
      console.log(`  Created post for locale="${locale}" from legacy "${legacyId}".`)
    } catch (e) {
      console.error(`  Failed to create post for locale="${locale}" from legacy "${legacyId}":`, e)
    }
  }
  console.log(`\nDone. Created ${created} new post document(s). Legacy documents were not modified or deleted.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

