/**
 * Seed / patch siteChrome documents from scripts/data/sitechrome-copy.json.
 *
 * Dry run:  npx tsx scripts/seed-sitechrome.ts
 * Apply:     DOTENV_CONFIG_PATH=.env.local npx tsx scripts/seed-sitechrome.ts --write
 *
 * Writes ONLY the siteChrome block per locale:
 *   companyName, logoAlt, newsletterTitle,
 *   footerPrimaryLinks[].{label,href}, footerLegalLinks[].{label,href}
 *
 * Rules:
 * - nl-be: skip content overwrite (existing footer links protected)
 * - en-be / fr-be: always patch published doc + remove stale draft copies
 * - de, pl, ro, hu, bg, sk, sl: upsert with deterministic _id siteChrome.{locale}
 * - Removes legacy unknown fields (googleTagManagerId, newsletterButtonLabel, etc.)
 */

import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { createClient } from '@sanity/client'
import { activeLocales } from '../i18n/locales'

const projectId = 'r1yazroc'
const dataset = 'production'
const apiVersion = '2024-01-01'

const SKIP_CONTENT_LOCALES = ['nl-be'] as const
const LEGACY_FIELDS_TO_UNSET = [
  'googleTagManagerId',
  'newsletterButtonLabel',
  'newsletterPlaceholder',
  'socialLinks',
  'address',
  'copyrightText',
  'messages',
] as const

type FooterLink = { label: string; href: string }

type SiteChromeCopy = {
  companyName: string
  logoAlt: string
  newsletterTitle: string
  footerPrimaryLinks: FooterLink[]
  footerLegalLinks: FooterLink[]
}

type CopyFile = {
  locales: Record<string, { siteChrome: SiteChromeCopy; messages?: Record<string, string> }>
}

type ExistingDoc = {
  _id: string
  locale: string
  footerPrimaryLinks?: FooterLink[] | null
  footerLegalLinks?: FooterLink[] | null
}

type SeedAction = 'create' | 'patch' | 'skip' | 'cleanup'

type SeedReportRow = {
  locale: string
  action: SeedAction
  reason: string
  documentId: string
  footerPrimary: number
  footerLegal: number
  legacyRemoved: boolean
}

function loadCopyFile(): CopyFile {
  const filePath = path.join(__dirname, 'data', 'sitechrome-copy.json')
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing copy file: ${filePath}`)
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as CopyFile
}

function deterministicId(locale: string): string {
  return `siteChrome.${locale}`
}

function mapFooterLinks(links: FooterLink[]) {
  return links.map((link, index) => ({
    _key: `link-${index}`,
    _type: 'footerBottomLink' as const,
    label: link.label,
    href: link.href,
  }))
}

function buildSiteChromeFields(chrome: SiteChromeCopy) {
  return {
    companyName: chrome.companyName,
    logoAlt: chrome.logoAlt,
    newsletterTitle: chrome.newsletterTitle,
    footerPrimaryLinks: mapFooterLinks(chrome.footerPrimaryLinks),
    footerLegalLinks: mapFooterLinks(chrome.footerLegalLinks),
  }
}

async function removeLegacyFields(client: ReturnType<typeof createClient>, docId: string) {
  await client.patch(docId).unset([...LEGACY_FIELDS_TO_UNSET]).commit()
}

async function applyPatch(
  client: ReturnType<typeof createClient>,
  docId: string,
  fields: ReturnType<typeof buildSiteChromeFields>
) {
  await client.patch(docId).set(fields).commit()
  await removeLegacyFields(client, docId)
}

async function main() {
  const write = process.argv.includes('--write')
  const token = process.env.SANITY_API_WRITE_TOKEN

  if (write && !token) {
    console.error('Missing SANITY_API_WRITE_TOKEN for --write')
    process.exit(1)
  }

  const copy = loadCopyFile()
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: token || undefined,
  })

  const report: SeedReportRow[] = []

  for (const locale of activeLocales) {
    const chromeCopy = copy.locales[locale]?.siteChrome
    if (!chromeCopy) {
      report.push({
        locale,
        action: 'skip',
        reason: 'missing siteChrome block in JSON',
        documentId: '-',
        footerPrimary: 0,
        footerLegal: 0,
        legacyRemoved: false,
      })
      continue
    }

    const published = await client.fetch<ExistingDoc | null>(
      `*[_type == "siteChrome" && locale == $locale && !(_id in path("drafts.**"))][0]{
        _id, locale, footerPrimaryLinks[]{ label, href }, footerLegalLinks[]{ label, href }
      }`,
      { locale }
    )

    const staleDrafts = await client.fetch<{ _id: string }[]>(
      `*[_type == "siteChrome" && locale == $locale && _id in path("drafts.**")]{ _id }`,
      { locale }
    )

    const fields = buildSiteChromeFields(chromeCopy)
    const skipContent = SKIP_CONTENT_LOCALES.includes(locale as (typeof SKIP_CONTENT_LOCALES)[number])

    if (skipContent) {
      const docId = published?._id
      report.push({
        locale,
        action: 'cleanup',
        reason: 'nl-be protected — only legacy field cleanup',
        documentId: docId ?? '(none)',
        footerPrimary: published?.footerPrimaryLinks?.length ?? 0,
        footerLegal: published?.footerLegalLinks?.length ?? 0,
        legacyRemoved: true,
      })

      if (write) {
        for (const draft of staleDrafts) {
          await client.delete(draft._id)
        }
        if (docId) {
          await removeLegacyFields(client, docId)
        }
      }
      continue
    }

    const docId = published?._id ?? deterministicId(locale)
    const action: SeedAction = published ? 'patch' : 'create'

    report.push({
      locale,
      action,
      reason: published ? 'patch published doc' : 'create new doc',
      documentId: docId,
      footerPrimary: fields.footerPrimaryLinks.length,
      footerLegal: fields.footerLegalLinks.length,
      legacyRemoved: true,
    })

    if (!write) continue

    if (published) {
      await applyPatch(client, docId, fields)
    } else {
      await client.createOrReplace({
        _id: docId,
        _type: 'siteChrome',
        locale,
        ...fields,
      })
    }

    for (const draft of staleDrafts) {
      await client.delete(draft._id)
    }

    if (published && published._id !== deterministicId(locale)) {
      const duplicate = await client.fetch<{ _id: string } | null>(
        `*[_id == $id][0]{ _id }`,
        { id: deterministicId(locale) }
      )
      if (duplicate?._id && duplicate._id !== published._id) {
        await client.delete(duplicate._id)
      }
    }
  }

  console.log('\n=== Site Chrome seed report ===')
  console.log('locale | action | documentId | footerPrimary | footerLegal | legacyRemoved | reason')
  for (const row of report) {
    console.log(
      `${row.locale} | ${row.action} | ${row.documentId} | ${row.footerPrimary} | ${row.footerLegal} | ${row.legacyRemoved ? 'yes' : 'no'} | ${row.reason}`
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
