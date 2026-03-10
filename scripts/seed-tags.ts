import 'dotenv/config'
import { createClient } from '@sanity/client'

const PROJECT_ID = 'r1yazroc'
const DATASET = 'production'
const API_VERSION = '2024-01-01'

type Locale = 'en-be' | 'nl-be' | 'fr-be'

interface TagSeed {
  translationKey: string
  locale: Locale
  title: string
  slug: string
}

const TAGS: TagSeed[] = [
  // 1) machine-valuation
  { translationKey: 'machine-valuation', locale: 'en-be', title: 'Machine valuation', slug: 'machine-valuation' },
  { translationKey: 'machine-valuation', locale: 'nl-be', title: 'Machinewaardering', slug: 'machinewaardering' },
  { translationKey: 'machine-valuation', locale: 'fr-be', title: 'Valorisation des machines', slug: 'valorisation-des-machines' },

  // 2) machine-auction-timing
  { translationKey: 'machine-auction-timing', locale: 'en-be', title: 'Machine auction timing', slug: 'machine-auction-timing' },
  { translationKey: 'machine-auction-timing', locale: 'nl-be', title: 'Timing van machineveiling', slug: 'timing-van-machineveiling' },
  {
    translationKey: 'machine-auction-timing',
    locale: 'fr-be',
    title: 'Timing de vente aux enchères de machines',
    slug: 'timing-vente-aux-encheres-machines',
  },

  // 3) preparation
  { translationKey: 'preparation', locale: 'en-be', title: 'Preparation', slug: 'preparation' },
  { translationKey: 'preparation', locale: 'nl-be', title: 'Voorbereiding', slug: 'voorbereiding' },
  { translationKey: 'preparation', locale: 'fr-be', title: 'Préparation', slug: 'preparation' },

  // 4) value-maximization
  { translationKey: 'value-maximization', locale: 'en-be', title: 'Value maximization', slug: 'value-maximization' },
  { translationKey: 'value-maximization', locale: 'nl-be', title: 'Waardemaximalisatie', slug: 'waardemaximalisatie' },
  { translationKey: 'value-maximization', locale: 'fr-be', title: 'Maximisation de la valeur', slug: 'maximisation-de-la-valeur' },

  // 5) international-buyers
  { translationKey: 'international-buyers', locale: 'en-be', title: 'International buyers', slug: 'international-buyers' },
  { translationKey: 'international-buyers', locale: 'nl-be', title: 'Internationale kopers', slug: 'internationale-kopers' },
  { translationKey: 'international-buyers', locale: 'fr-be', title: 'Acheteurs internationaux', slug: 'acheteurs-internationaux' },

  // 6) auction-strategy
  { translationKey: 'auction-strategy', locale: 'en-be', title: 'Auction strategy', slug: 'auction-strategy' },
  { translationKey: 'auction-strategy', locale: 'nl-be', title: 'Veilingstrategie', slug: 'veilingstrategie' },
  { translationKey: 'auction-strategy', locale: 'fr-be', title: 'Stratégie d’enchères', slug: 'strategie-encheres' },

  // 7) business-exit
  { translationKey: 'business-exit', locale: 'en-be', title: 'Business exit', slug: 'business-exit' },
  { translationKey: 'business-exit', locale: 'nl-be', title: 'Bedrijfsoverdracht', slug: 'bedrijfsoverdracht' },
  { translationKey: 'business-exit', locale: 'fr-be', title: 'Sortie d’entreprise', slug: 'sortie-d-entreprise' },

  // 8) liquidation
  { translationKey: 'liquidation', locale: 'en-be', title: 'Liquidation', slug: 'liquidation' },
  { translationKey: 'liquidation', locale: 'nl-be', title: 'Liquidatie', slug: 'liquidatie' },
  { translationKey: 'liquidation', locale: 'fr-be', title: 'Liquidation', slug: 'liquidation' },

  // 9) machine-sales
  { translationKey: 'machine-sales', locale: 'en-be', title: 'Machine sales', slug: 'machine-sales' },
  { translationKey: 'machine-sales', locale: 'nl-be', title: 'Machineverkoop', slug: 'machineverkoop' },
  { translationKey: 'machine-sales', locale: 'fr-be', title: 'Vente de machines', slug: 'vente-de-machines' },

  // 10) metalworking
  { translationKey: 'metalworking', locale: 'en-be', title: 'Metalworking', slug: 'metalworking' },
  { translationKey: 'metalworking', locale: 'nl-be', title: 'Metaalbewerking', slug: 'metaalbewerking' },
  { translationKey: 'metalworking', locale: 'fr-be', title: 'Travail des métaux', slug: 'travail-des-metaux' },

  // 11) woodworking
  { translationKey: 'woodworking', locale: 'en-be', title: 'Woodworking', slug: 'woodworking' },
  { translationKey: 'woodworking', locale: 'nl-be', title: 'Houtbewerking', slug: 'houtbewerking' },
  { translationKey: 'woodworking', locale: 'fr-be', title: 'Travail du bois', slug: 'travail-du-bois' },

  // 12) construction-equipment
  { translationKey: 'construction-equipment', locale: 'en-be', title: 'Construction equipment', slug: 'construction-equipment' },
  { translationKey: 'construction-equipment', locale: 'nl-be', title: 'Bouwmachines', slug: 'bouwmachines' },
  { translationKey: 'construction-equipment', locale: 'fr-be', title: 'Équipements de construction', slug: 'equipements-de-construction' },

  // 13) agricultural-machinery
  { translationKey: 'agricultural-machinery', locale: 'en-be', title: 'Agricultural machinery', slug: 'agricultural-machinery' },
  { translationKey: 'agricultural-machinery', locale: 'nl-be', title: 'Landbouwmachines', slug: 'landbouwmachines' },
  { translationKey: 'agricultural-machinery', locale: 'fr-be', title: 'Machines agricoles', slug: 'machines-agricoles' },

  // 14) transport-equipment
  { translationKey: 'transport-equipment', locale: 'en-be', title: 'Transport equipment', slug: 'transport-equipment' },
  { translationKey: 'transport-equipment', locale: 'nl-be', title: 'Transportmaterieel', slug: 'transportmaterieel' },
  { translationKey: 'transport-equipment', locale: 'fr-be', title: 'Équipements de transport', slug: 'equipements-de-transport' },

  // 15) cnc
  { translationKey: 'cnc', locale: 'en-be', title: 'CNC', slug: 'cnc' },
  { translationKey: 'cnc', locale: 'nl-be', title: 'CNC', slug: 'cnc' },
  { translationKey: 'cnc', locale: 'fr-be', title: 'CNC', slug: 'cnc' },

  // 16) earthmoving
  { translationKey: 'earthmoving', locale: 'en-be', title: 'Earthmoving', slug: 'earthmoving' },
  { translationKey: 'earthmoving', locale: 'nl-be', title: 'Grondverzet', slug: 'grondverzet' },
  { translationKey: 'earthmoving', locale: 'fr-be', title: 'Terrassement', slug: 'terrassement' },

  // 17) printing-equipment
  { translationKey: 'printing-equipment', locale: 'en-be', title: 'Printing equipment', slug: 'printing-equipment' },
  { translationKey: 'printing-equipment', locale: 'nl-be', title: 'Printapparatuur', slug: 'printapparatuur' },
  { translationKey: 'printing-equipment', locale: 'fr-be', title: 'Équipements d’impression', slug: 'equipements-d-impression' },
]

const token = process.env.SANITY_API_WRITE_TOKEN

if (!token) {
  console.error('SANITY_API_WRITE_TOKEN is required to seed tags.')
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token,
  useCdn: false,
})

async function upsertTag(tag: TagSeed): Promise<void> {
  const { translationKey, locale, title, slug } = tag

  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == "tag" && translationKey == $translationKey && locale == $locale][0]{ _id }`,
    { translationKey, locale }
  )

  if (existing?._id) {
    console.log(`Skip (exists): ${locale} / ${translationKey} (${title})`)
    return
  }

  const doc = {
    _type: 'tag',
    translationKey,
    locale,
    title,
    slug: { _type: 'slug', current: slug },
  }

  await client.create(doc)
  console.log(`Created: ${locale} / ${translationKey} (${title})`)
}

async function main() {
  console.log('Seeding tags...')
  for (const tag of TAGS) {
    try {
      await upsertTag(tag)
    } catch (err) {
      console.error(`Error seeding ${tag.locale} / ${tag.translationKey}:`, (err as Error).message)
    }
  }
  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

