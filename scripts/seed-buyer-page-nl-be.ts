/**
 * Seed / update the NL-BE buyerPage with the agreed final copy.
 *
 * Does NOT overwrite `slug` (or any field not listed in nlBeBuyerPagePatch). The slug is only used
 * to FIND the existing document; content fields are patched onto that document.
 *
 * Target document: buyerPage where locale == "nl-be" AND slug.current == <slug>
 * Default slug: env BUYER_PAGE_SLUG or CLI arg: npx tsx scripts/seed-buyer-page-nl-be.ts --write mijn-slug
 *
 * Dry run (no writes): npx tsx scripts/seed-buyer-page-nl-be.ts
 * Apply:              npx tsx scripts/seed-buyer-page-nl-be.ts --write [slug]
 *
 * Requires: SANITY_API_WRITE_TOKEN (with write access to the dataset)
 *
 * hubspotFormId is NOT invented: set HUBSPOT_FORM_ID in env or edit the document in Studio after run.
 */

import 'dotenv/config'
import { createClient } from '@sanity/client'

const projectId = 'r1yazroc'
const dataset = 'production'
const apiVersion = '2024-01-01'

const args = process.argv.slice(2)
const write = args.includes('--write')
const slugArg = args.filter((a) => a !== '--write')[0]

const BUYER_SLUG = slugArg || process.env.BUYER_PAGE_SLUG || 'test'

/** Set in .env.local or shell when running --write, or patch manually in Studio */
const HUBSPOT_FORM_ID = process.env.HUBSPOT_FORM_ID?.trim() || ''

export const nlBeBuyerPagePatch = {
  heroEyebrow: 'Kopersplatform',
  heroTitle: 'Wees als eerste op de hoogte van de beste opportuniteiten.',
  heroSubtitle: 'Ontvang alleen meldingen die relevant zijn voor uw sectoren en voorkeuren.',
  heroBody:
    'Schrijf u in per sector en ontvang een melding zodra interessante machines of installaties beschikbaar komen voor veiling.',
  heroCtaLabel: 'Blijf op de hoogte',
  stats: [
    { value: '6', label: 'Sectoren' },
    { value: 'BE + EU', label: 'Bereik' },
    { value: 'Op maat', label: 'Voor uw sectoren' },
  ],
  formEyebrow: 'Inschrijving',
  formTitle: 'Kies uw sectoren. Wij doen de rest.',
  formSubtitle: 'U ontvangt alleen meldingen voor de sectoren die u selecteert.',
  hubspotFormId: HUBSPOT_FORM_ID || '__TODO_HUBSPOT_FORM_ID__',
  stepsSectionEyebrow: 'Hoe het werkt',
  stepsSectionTitle: 'Van inschrijving tot bod.',
  steps: [
    {
      title: 'Kies uw sectoren',
      description:
        'Selecteer de sectoren waarvoor u interesse heeft: hout, transport, metaal, landbouw, grondverzet of bouw.',
    },
    {
      title: 'Ontvang meldingen',
      description:
        'Zodra er nieuwe machines beschikbaar komen in uw sectoren, sturen wij u een melding per e-mail.',
    },
    {
      title: 'Bekijk de kavels',
      description:
        'Bekijk beschikbare machines, foto’s, technische details en minimumbod op de veilingpagina.',
    },
    {
      title: 'Doe uw bod',
      description:
        'Bied online of neem contact op met ons team. Wij begeleiden u van begin tot einde.',
    },
  ],
  sectorCardsSectionEyebrow: 'Sectoroverzicht',
  sectorCardsSectionTitle: 'Industriële machines in elke sector.',
  sectorCards: [
    {
      title: 'Houtbewerking',
      description:
        'Cirkelzagen, bandzagen, freesmachines, drogers, pallettiseerlijnen en complete productielijnen.',
    },
    {
      title: 'Transport',
      description:
        'Trekkers, opleggers, koelauto’s, tankwagens, bestelwagens en transportuitrusting.',
    },
    {
      title: 'Metaalbewerking',
      description:
        'CNC-draaibanken, freesmachines, lasersnijders, persen, buigmachines en lasinstallaties.',
    },
    {
      title: 'Landbouw',
      description:
        'Tractoren, combine-harvesters, sproeimachines, aanhangwagens en complete landbouwuitrusting.',
    },
    {
      title: 'Grondverzet',
      description:
        'Graafmachines, bulldozers, wielladers, kranen, compactoren en grondverzetwerktuigen.',
    },
    {
      title: 'Bouw',
      description:
        'Steigers, bekisting, hefplatforms, betonmixers, bouwliften en complete bouwplaatsuitrusting.',
    },
  ],
  finalCtaTitle: 'De machines zijn er. Bent u er klaar voor?',
  finalCtaBody:
    'Blijf op de hoogte van de beste kansen in uw sectoren, afgestemd op uw voorkeuren.',
  finalCtaButtonLabel: 'Schrijf u in',
  seoTitle: 'Kopersplatform voor industriële veilingen | Dome Auctions',
  seoDescription:
    'Ontvang als eerste relevante veilingkansen in uw sectoren, afgestemd op uw voorkeuren.',
}

async function main() {
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (write && !token) {
    console.error('Missing SANITY_API_WRITE_TOKEN for --write')
    process.exit(1)
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: token || undefined,
  })

  const doc = await client.fetch<{ _id: string; 'slug': string } | null>(
    `*[_type == "buyerPage" && locale == "nl-be" && slug.current == $slug][0]{ _id, "slug": slug.current }`,
    { slug: BUYER_SLUG }
  )

  if (!doc) {
    console.error(
      `No buyerPage found for nl-be + slug "${BUYER_SLUG}". Create the document in Studio first or pass the correct slug.`
    )
    process.exit(1)
  }

  if (!write) {
    console.log('[dry run] Would patch document:', doc._id)
    console.log(JSON.stringify(nlBeBuyerPagePatch, null, 2))
    console.log('\nRun with --write to apply. Set HUBSPOT_FORM_ID or replace __TODO_HUBSPOT_FORM_ID__ in Studio.')
    return
  }

  await client.patch(doc._id).set(nlBeBuyerPagePatch).commit()

  console.log('Patched buyerPage', doc._id, `nl-be / ${BUYER_SLUG}`)
  if (!HUBSPOT_FORM_ID) {
    console.warn(
      'hubspotFormId left as __TODO_HUBSPOT_FORM_ID__ — set HUBSPOT_FORM_ID and re-run, or fix in Studio.'
    )
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
