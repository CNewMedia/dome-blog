import { notFound } from 'next/navigation'
import { client } from '../../../sanity/client'
import { getSectorPage, getSectorPageLegacy, getTeamMembers } from '../../../sanity/queries'
import SectorLandingPage, { type SectorPageData } from '../../../components/SectorLandingPage'

const SECTORS = ['woodworking', 'metalworking', 'construction', 'agriculture', 'transport'] as const
const LOCALES = ['nl-be', 'fr-be'] as const

type Locale = (typeof LOCALES)[number]

type Props = {
  params: Promise<{ locale: string; sector: string }>
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isSectorPageData(value: unknown): value is SectorPageData {
  if (!isRecord(value)) return false

  return typeof value._id === 'string' && typeof value.sector === 'string'
}

function normalizeLocalizedValue(value: unknown, locale: string): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeLocalizedValue(item, locale))
  }

  if (!isRecord(value)) {
    return value
  }

  const localeKey = locale.replace('-', '_')

  const looksLocalized =
    localeKey in value ||
    'nl_be' in value ||
    'fr_be' in value ||
    'en' in value ||
    'de' in value

  if (looksLocalized) {
    return value[localeKey] ?? value['nl_be'] ?? value['fr_be'] ?? ''
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      normalizeLocalizedValue(nestedValue, locale),
    ])
  )
}

async function getSectorData(sector: string, locale: Locale): Promise<SectorPageData | null> {
  const localeAlt = locale.replace('-', '_')

  const next = await client.fetch(getSectorPage(locale), { sector, locale, localeAlt })
  if (isSectorPageData(next)) return next

  if (next) {
    const normalizedNext = normalizeLocalizedValue(next, locale)
    if (isSectorPageData(normalizedNext)) return normalizedNext
  }

  const legacy = await client.fetch(getSectorPageLegacy(locale), { sector })
  if (!legacy) return null

  const normalizedLegacy = normalizeLocalizedValue(legacy, locale)
  if (!isSectorPageData(normalizedLegacy)) return null

  return normalizedLegacy
}

export default async function SectorPage({ params }: Props) {
  const { locale, sector } = await params

  if (!LOCALES.includes(locale as Locale)) notFound()
  if (!SECTORS.includes(sector as (typeof SECTORS)[number])) notFound()

  const [data, rawTeamMembers] = await Promise.all([
    getSectorData(sector, locale as Locale),
    client.fetch(getTeamMembers),
  ])

  const teamMembers = normalizeLocalizedValue(rawTeamMembers ?? [], locale as Locale)

  if (!data) notFound()

  return <SectorLandingPage data={data} teamMembers={teamMembers ?? []} />
}

export async function generateMetadata({ params }: Props) {
  const { locale, sector } = await params

  if (!LOCALES.includes(locale as Locale)) {
    return { title: 'Dome Auctions' }
  }

  const data = await getSectorData(sector, locale as Locale)

  if (!data) {
    return { title: 'Sector | Dome Auctions' }
  }

  return {
    title: data.seoTitle || data.heroTitle || `${sector} | Dome Auctions`,
    description: data.seoDescription ?? undefined,
  }
}

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    SECTORS.map((sector) => ({ locale, sector }))
  )
}