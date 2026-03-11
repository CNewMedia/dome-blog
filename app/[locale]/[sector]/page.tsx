import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { client, urlFor } from '../../../sanity/client'
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

const DOMAIN = 'https://insights.dome-auctions.com'

const OG_LOCALE: Record<string, string> = {
  'nl-be': 'nl_BE',
  'fr-be': 'fr_BE',
  'en-be': 'en_GB',
}

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

  const slugStr = typeof data.slug === 'string' ? data.slug : sector
  const canonicalUrl = `${DOMAIN}/${locale}/${slugStr}`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: data.seoTitle || data.heroTitle || `${slugStr} | Dome Auctions`,
            description: data.seoDescription || undefined,
            url: canonicalUrl,
          }),
        }}
      />
      <SectorLandingPage data={data} teamMembers={teamMembers} />
    </>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, sector } = await params

  if (!isAppLocale(locale)) {
    return { title: 'Dome Auctions' }
  }

  const data = await getSectorData(sector, locale)

  if (!data) {
    return { title: 'Sector | Dome Auctions' }
  }

  const title = data.seoTitle || data.heroTitle || `${sector} | Dome Auctions`
  const description = data.seoDescription ?? undefined
  const slugStr = typeof data.slug === 'string' ? data.slug : sector
  const url = `${DOMAIN}/${locale}/${slugStr}`
  const ogImageSource = data.ogImage ?? data.heroImage
  const ogImages = ogImageSource?.asset
    ? [{ url: urlFor(ogImageSource).width(1200).height(630).url(), width: 1200, height: 630, alt: (ogImageSource as { alt?: string }).alt ?? title }]
    : undefined

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'Dome Auctions',
      locale: OG_LOCALE[locale] ?? undefined,
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
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