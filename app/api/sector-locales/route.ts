import { NextRequest } from 'next/server'
import { client } from '../../../sanity/client'
import { getSectorAvailableLocales } from '../../../sanity/queries'

const SECTORS = ['woodworking', 'metalworking', 'construction', 'agriculture', 'transport']

export async function GET(request: NextRequest) {
  const sector = request.nextUrl.searchParams.get('sector')
  if (!sector || !SECTORS.includes(sector)) {
    return Response.json({ availableLocales: ['nl-be', 'fr-be', 'en', 'de'] })
  }
  const data = await client.fetch(getSectorAvailableLocales, { sector }) as { availableLocales?: string[] } | null
  const availableLocales = data?.availableLocales ?? ['nl-be']
  return Response.json({ availableLocales })
}
