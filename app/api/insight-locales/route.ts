import { NextRequest } from 'next/server'
import { client } from '../../../sanity/client'
import { getInsightAvailableLocales } from '../../../sanity/queries'
import { activeLocales } from '../../../i18n/locales'

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')
  const locale = request.nextUrl.searchParams.get('locale')

  // If not enough context, fall back to all active locales (overview pages, etc.)
  if (!slug || !locale) {
    return Response.json({ availableLocales: [...activeLocales] })
  }

  const normalizedSlug = slug.toLowerCase()
  const data = await client.fetch(getInsightAvailableLocales, {
    slug: normalizedSlug,
    locale,
  }) as { availableLocales?: string[] } | null

  const raw = data?.availableLocales ?? []
  const filtered = raw.filter((loc) => activeLocales.includes(loc as (typeof activeLocales)[number]))
  const availableLocales = filtered.length ? filtered : []

  return Response.json({ availableLocales })
}

