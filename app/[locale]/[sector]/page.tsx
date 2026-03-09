import { notFound } from 'next/navigation'
import { client } from '../../../sanity/client'
import {
  getSectorPage,
  getSectorPageLegacy,
  getSectorSlugs,
  getTeamMembers,
} from '../../../sanity/queries'
import SectorLandingPage, {
  type SectorPageData,
  type TeamMember,
} from '../../../components/SectorLandingPage'
import { activeLocales, isAppLocale, type AppLocale } from '../../../i18n/locales'

type Props = {
  params: Promise<{ locale: string; sector: string }>
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isSectorPageData(value: unknown): value is SectorPageData {
  if (!isRecord(value)) return false
  return typeof value._id === 'string' && typeof value.slug === 'string'
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
    'nl' in value ||
    'nl_be' in value ||
    'fr_be' in value ||
    'en' in value ||
    'de' in value ||
    'sv' in value ||
    'es' in value

  if (looksLocalized) {
    return (
      value[localeKey] ??
      value[locale] ??
      value['nl'] ??
      value['nl_be'] ??
      value['fr_be'] ??
      value['en'] ??
      ''
    )
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      normalizeLocalizedValue(nestedValue, locale),
    ])
  )
}

async function getSectorData(slug: string, locale: AppLocale): Promise<SectorPageData | null> {
  const localeAlt = locale.replace('-', '_')

  const normalizedSlug = slug.toLowerCase()

  const next = await client.fetch(getSectorPage(locale), { slug: normalizedSlug, locale, localeAlt })
  if (isSectorPageData(next)) return next

  if (next) {
    const normalizedNext = normalizeLocalizedValue(next, locale)
    if (isSectorPageData(normalizedNext)) return normalizedNext
  }

  const legacy = await client.fetch(getSectorPageLegacy(locale), { slug: normalizedSlug })
  if (!legacy) return null

  const normalizedLegacy = normalizeLocalizedValue(legacy, locale)
  if (!isSectorPageData(normalizedLegacy)) return null

  return normalizedLegacy
}

export default async function SectorPage({ params }: Props) {
  const { locale, sector } = await params

  if (!isAppLocale(locale)) notFound()

  const [data, rawTeamMembers] = await Promise.all([
    getSectorData(sector, locale),
    client.fetch(getTeamMembers),
  ])

  const normalizedTeamMembers = normalizeLocalizedValue(rawTeamMembers ?? [], locale)
  const teamMembers: TeamMember[] = Array.isArray(normalizedTeamMembers)
    ? (normalizedTeamMembers as TeamMember[])
    : []

  if (!data) notFound()

  return <SectorLandingPage data={data} teamMembers={teamMembers} />
}

export async function generateMetadata({ params }: Props) {
  const { locale, sector } = await params

  if (!isAppLocale(locale)) {
    return { title: 'Dome Auctions' }
  }

  const data = await getSectorData(sector, locale)

  if (!data) {
    return { title: 'Sector | Dome Auctions' }
  }

  return {
    title: data.seoTitle || data.heroTitle || `${sector} | Dome Auctions`,
    description: data.seoDescription ?? undefined,
  }
}

export async function generateStaticParams() {
  const pages = (await client.fetch(getSectorSlugs)) as { slug?: string; locale?: string }[]

  const validPages = pages.filter(
    (page) =>
      typeof page.slug === 'string' &&
      typeof page.locale === 'string' &&
      activeLocales.includes(page.locale as (typeof activeLocales)[number])
  )

  return validPages.map((page) => ({
    locale: page.locale as string,
    sector: page.slug as string,
  }))
}