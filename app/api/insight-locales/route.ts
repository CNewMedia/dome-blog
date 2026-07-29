import { NextRequest } from 'next/server'
import { client } from '../../../sanity/client'
import { getInsightAvailableLocales } from '../../../sanity/queries'
import { activeLocales, filterMenuLocales, menuLocales } from '../../../i18n/locales'

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')
  const locale = request.nextUrl.searchParams.get('locale')

  // Menu-facing fallback: only languages shown in the language switcher.
  if (!slug || !locale) {
    return Response.json({ availableLocales: [...menuLocales] })
  }

  const normalizedSlug = slug.toLowerCase()
  const data = (await client.fetch(getInsightAvailableLocales, {
    slug: normalizedSlug,
    locale,
  })) as { availableLocales?: string[] } | null

  const raw = data?.availableLocales ?? []
  const routable = raw.filter((loc) =>
    activeLocales.includes(loc as (typeof activeLocales)[number])
  )
  const availableLocales = filterMenuLocales(routable)

  return Response.json({ availableLocales })
}
