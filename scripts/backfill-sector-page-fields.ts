/**
 * Backfill new sectorPage fields with current default/hardcoded content.
 * Only sets values when the field is missing; never overwrites existing content.
 *
 * Run: npx tsx scripts/backfill-sector-page-fields.ts [--write]
 * Without --write: dry run only (reports what would be set).
 * Requires: SANITY_API_WRITE_TOKEN in env for --write.
 */
import 'dotenv/config'
import { createClient } from '@sanity/client'
import { groq } from 'next-sanity'

const DEFAULT_HERO_EYEBROW = 'Sector'
const DEFAULT_HERO_CTA_LABEL = 'Vraag een gesprek aan'
const DEFAULT_HERO_CTA_HREF = '#cta-form'

const DEFAULT_STATS_ITEMS = [
  { value: '2400+', label: 'Veilingen per jaar' },
  { value: '18', label: 'Landen' },
  { value: '20+', label: 'Jaar ervaring' },
  { value: '1000+', label: 'Verkopers begeleid' },
]

const DEFAULT_PROCESS_EYEBROW = 'Het proces'
const DEFAULT_PROCESS_TITLE = 'Van intake tot verkoop in 6 weken'
const DEFAULT_PROCESS_STEPS = [
  { title: 'Intake', description: 'Eerste gesprek en beoordeling van uw machines.' },
  { title: 'Beoordeling', description: 'Waardebepaling en voorstel op maat.' },
  { title: 'Veiling', description: 'Online veiling in ons Europese netwerk.' },
  { title: 'Afhandeling', description: 'Oplevering en betaling. Gemiddeld 6 weken totaal.' },
]

const DEFAULT_USP_EYEBROW = 'Waarom Dome Auctions'
const DEFAULT_USP_TITLE = 'Bewezen aanpak. Geen verrassingen.'
const DEFAULT_TEAM_EYEBROW = 'Team België'
const DEFAULT_TEAM_TITLE = 'Uw team'
const DEFAULT_CONTACT_EYEBROW = 'Contact'
const DEFAULT_CONTACT_SUBTITLE =
  'Laat uw gegevens achter en we nemen binnen één werkdag contact op. Geen verplichtingen.'

const GROQ = groq`*[_type == "sectorPage"] {
  _id,
  heroEyebrow,
  heroCtaLabel,
  heroCtaHref,
  heroSectionVisible,
  statsSection,
  processSection,
  contentSectionVisible,
  uspSectionEyebrow,
  uspSectionTitle,
  uspSectionVisible,
  machinesSectionVisible,
  testimonialSectionVisible,
  teamSectionEyebrow,
  teamSectionTitle,
  teamSectionVisible,
  contactSectionEyebrow,
  contactSectionSubtitle,
  contactSectionVisible,
  ogImage,
  heroImage,
  "slug": coalesce(slug.current, lower(sector)),
  locale
}`

type SectorDoc = {
  _id: string
  slug?: string
  locale?: string
  heroEyebrow?: string | null
  heroCtaLabel?: string | null
  heroCtaHref?: string | null
  heroSectionVisible?: boolean | null
  statsSection?: { isVisible?: boolean; items?: { value?: string; label?: string }[] } | null
  processSection?: { isVisible?: boolean; eyebrow?: string; title?: string; steps?: { title?: string; description?: string }[] } | null
  uspSectionEyebrow?: string | null
  uspSectionTitle?: string | null
  teamSectionEyebrow?: string | null
  teamSectionTitle?: string | null
  contactSectionEyebrow?: string | null
  contactSectionSubtitle?: string | null
  ogImage?: { asset?: { _ref?: string } } | null
  heroImage?: { asset?: { _ref?: string } } | null
  [k: string]: unknown
}

function isEmpty(v: unknown): boolean {
  if (v == null) return true
  if (typeof v === 'string') return v.trim() === ''
  if (Array.isArray(v)) return v.length === 0
  if (typeof v === 'object' && v !== null && 'items' in v) return !(v as { items?: unknown[] }).items?.length
  if (typeof v === 'object' && v !== null && 'steps' in v) return !(v as { steps?: unknown[] }).steps?.length
  return false
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

  console.log('Fetching sectorPage documents...')
  const docs = await client.fetch<SectorDoc[]>(GROQ)
  console.log(`Found ${docs.length} document(s).\n`)

  if (docs.length === 0) {
    console.log('Nothing to backfill.')
    return
  }

  let patches = 0
  for (const doc of docs) {
    const id = doc._id
    const label = `${doc.locale ?? 'no-locale'}/${doc.slug ?? id}`

    const setIfMissing: Record<string, unknown> = {}
    if (isEmpty(doc.heroEyebrow)) setIfMissing.heroEyebrow = DEFAULT_HERO_EYEBROW
    if (isEmpty(doc.heroCtaLabel)) setIfMissing.heroCtaLabel = DEFAULT_HERO_CTA_LABEL
    if (isEmpty(doc.heroCtaHref)) setIfMissing.heroCtaHref = DEFAULT_HERO_CTA_HREF
    if (doc.heroSectionVisible == null) setIfMissing.heroSectionVisible = true
    if (doc.statsSection == null) {
      setIfMissing.statsSection = { isVisible: true, items: DEFAULT_STATS_ITEMS }
    }
    if (doc.processSection == null) {
      setIfMissing.processSection = {
        isVisible: true,
        eyebrow: DEFAULT_PROCESS_EYEBROW,
        title: DEFAULT_PROCESS_TITLE,
        steps: DEFAULT_PROCESS_STEPS,
      }
    }
    if (doc.contentSectionVisible == null) setIfMissing.contentSectionVisible = true
    if (isEmpty(doc.uspSectionEyebrow)) setIfMissing.uspSectionEyebrow = DEFAULT_USP_EYEBROW
    if (isEmpty(doc.uspSectionTitle)) setIfMissing.uspSectionTitle = DEFAULT_USP_TITLE
    if (doc.uspSectionVisible == null) setIfMissing.uspSectionVisible = true
    if (doc.machinesSectionVisible == null) setIfMissing.machinesSectionVisible = true
    if (doc.testimonialSectionVisible == null) setIfMissing.testimonialSectionVisible = true
    if (isEmpty(doc.teamSectionEyebrow)) setIfMissing.teamSectionEyebrow = DEFAULT_TEAM_EYEBROW
    if (isEmpty(doc.teamSectionTitle)) setIfMissing.teamSectionTitle = DEFAULT_TEAM_TITLE
    if (doc.teamSectionVisible == null) setIfMissing.teamSectionVisible = true
    if (isEmpty(doc.contactSectionEyebrow)) setIfMissing.contactSectionEyebrow = DEFAULT_CONTACT_EYEBROW
    if (isEmpty(doc.contactSectionSubtitle)) setIfMissing.contactSectionSubtitle = DEFAULT_CONTACT_SUBTITLE
    if (doc.contactSectionVisible == null) setIfMissing.contactSectionVisible = true

    const hasSetIfMissing = Object.keys(setIfMissing).length > 0
    const needsOgImage = !doc.ogImage?.asset && doc.heroImage?.asset

    if (!hasSetIfMissing && !needsOgImage) {
      console.log(`  Skip ${label} (no missing fields)`)
      continue
    }

    let patch = client.patch(id)
    if (hasSetIfMissing) patch = patch.setIfMissing(setIfMissing)
    if (needsOgImage) patch = patch.set({ ogImage: doc.heroImage })

    if (doWrite) {
      try {
        await patch.commit()
        patches++
        console.log(`  Patched ${label}`)
      } catch (e) {
        console.error(`  Failed ${label}:`, e)
      }
    } else {
      patches++
      console.log(`  Would patch ${label}`)
    }
  }

  console.log('')
  if (doWrite) {
    console.log(`Done. Patched ${patches} document(s).`)
  } else {
    console.log(`Dry run: would patch ${patches} document(s). Run with --write to apply.`)
    console.log('Requires SANITY_API_WRITE_TOKEN in the environment.')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
