import { NextRequest } from 'next/server'
import { client } from '../../../sanity/client'
import { getBuyerAvailableLocales } from '../../../sanity/queries'
import { activeLocales, filterMenuLocales, menuLocales } from '../../../i18n/locales'

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')?.toLowerCase()
  const locale = request.nextUrl.searchParams.get('locale')

  if (!slug || !locale) {
    return Response.json({ availableLocales: [...menuLocales] })
  }

  const data = (await client.fetch(getBuyerAvailableLocales, {
    slug,
    locale,
  })) as { availableLocales?: string[] } | null

  const raw = data?.availableLocales ?? []
  const routable = raw.filter((loc) =>
    activeLocales.includes(loc as (typeof activeLocales)[number])
  )
  const availableLocales = filterMenuLocales(routable)

  return Response.json({ availableLocales })
}
