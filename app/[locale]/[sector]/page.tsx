import { notFound } from 'next/navigation'
import { client } from '../../../sanity/client'
import { getSectorPage, getSectorPageLegacy, getTeamMembers } from '../../../sanity/queries'
import SectorLandingPage from '../../../components/SectorLandingPage'

const SECTORS = ['woodworking', 'metalworking', 'construction', 'agriculture', 'transport'] as const
const LOCALES = ['nl-be', 'fr-be', 'en', 'de']

type Props = {
  params: Promise<{ locale: string; sector: string }>
}

async function getSectorData(sector: string, locale: string) {
  const localeAlt = locale.replace('-', '_')
  const next = await client.fetch(getSectorPage(locale), { sector, locale, localeAlt })
  if (next) return next
  return client.fetch(getSectorPageLegacy(locale), { sector })
}

export default async function SectorPage({ params }: Props) {
  const { locale, sector } = await params
  if (!SECTORS.includes(sector as (typeof SECTORS)[number])) notFound()

  const [data, teamMembers] = await Promise.all([
    getSectorData(sector, locale),
    client.fetch(getTeamMembers),
  ])
  if (!data) notFound()

  return <SectorLandingPage data={data} teamMembers={teamMembers ?? []} />
}

export async function generateMetadata({ params }: Props) {
  const { locale, sector } = await params
  const data = await getSectorData(sector, locale)
  if (!data) return { title: 'Sector | Dome Auctions' }
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
