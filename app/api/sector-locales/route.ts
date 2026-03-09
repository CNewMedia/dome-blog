import { NextRequest } from 'next/server'
import { client } from '../../../sanity/client'
import { getSectorAvailableLocales } from '../../../sanity/queries'
import { activeLocales } from '../../../i18n/locales'

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('sector')?.toLowerCase()
  if (!slug) {
    return Response.json({ availableLocales: [...activeLocales] })
  }
  const data = await client.fetch(getSectorAvailableLocales, { slug }) as { availableLocales?: string[] } | null
  const raw = data?.availableLocales ?? []
  const filtered = raw.filter((loc) => activeLocales.includes(loc as (typeof activeLocales)[number]))
  const availableLocales = filtered.length ? filtered : [...activeLocales]
  return Response.json({ availableLocales })
}
