import { notFound } from 'next/navigation'
import { client } from '../../../sanity/client'
import { getSectorPage, getSectorPageLegacy, getTeamMembers } from '../../../sanity/queries'
import SectorLandingPage from '../../../components/SectorLandingPage'

const SECTORS = ['woodworking', 'metalworking', 'construction', 'agriculture', 'transport'] as const
const LOCALES = ['nl-be', 'fr-be'] as const

type Locale = (typeof LOCALES)[number]

type Props = {
  params: Promise<{ locale: string; sector: string }>
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function normalizeLocalizedValue(value: unknown, locale: string): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeLocalizedValue(item, locale))
  }

  if (!isRecord(value)) {
    return value
  }

  const localeKey = locale.replace('-', '_')

  // If this object looks like a localized value object, pick the current locale
  const looksLocalized =
    localeKey in value ||
    'nl_be' in value ||
    'fr_be' in value ||
    'en' in value ||
    'de' in value

  if (looksLocalized) {
    return value[localeKey] ?? value['nl_be'] ?? value['fr_be'] ?? ''
  }

  // Otherwise recurse through nested objects
  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      normalizeLocalizedValue(nestedValue, locale),
    ])
  )
}

async function getSectorData(sector: string, locale: Locale) {
  const localeAlt = locale.replace('-', '_')
  const next = await client.fetch(getSectorPage(locale), { sector, locale, localeAlt })
  if (next) return normalizeLocalizedValue(next, locale)

  const legacy = await client.fetch(getSectorPageLegacy(locale), { sector })
  if (!legacy) return null

  return normalizeLocalizedValue(legacy, locale)
}

export default async function SectorPage({ params }: Props) {
  const { locale, sector } = await params

  if (!LOCALES.includes(locale as Locale)) notFound()
  if (!SECTORS.includes(sector as (typeof SECTORS)[number])) notFound()

  const [data, teamMembers] = await Promise.all([
    getSectorData(sector, locale as Locale),
    client.fetch(getTeamMembers),
  ])

  if (!data) notFound()

  return <SectorLandingPage data={data} teamMembers={teamMembers ?? []} />
}

export async function generateMetadata({ params }: Props) {
  const { locale, sector } = await params

  if (!LOCALES.includes(locale as Locale)) {
    return { title: 'Dome Auctions' }
  }

  const data = await getSectorData(sector, locale as Locale)

  if (!data || typeof data !== 'object' || data === null) {
    return { title: 'Sector | Dome Auctions' }
  }

  const typed = data as Record<string, unknown>

  const title =
    typeof typed.seoTitle === 'string'
      ? typed.seoTitle
      : typeof typed.heroTitle === 'string'
        ? typed.heroTitle
        : `${sector} | Dome Auctions`

  const description =
    typeof typed.seoDescription === 'string' ? typed.seoDescription : undefined

  return {
    title,
    description,
  }
}

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    SECTORS.map((sector) => ({ locale, sector }))
  )
}