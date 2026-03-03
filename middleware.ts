import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { client } from './sanity/client'
import { getSectorAvailableLocales } from './sanity/queries'

const SECTORS = ['woodworking', 'metalworking', 'construction', 'agriculture', 'transport']
const SECTOR_DEFAULT_LOCALE = 'nl-be'

const intlMiddleware = createMiddleware({
  locales: ['nl-be', 'fr-be', 'en', 'de'],
  defaultLocale: 'en',
  localePrefix: 'always',
})

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length >= 2) {
    const locale = segments[0]
    const sector = segments[1]
    if (SECTORS.includes(sector)) {
      try {
        const data = await client.fetch(getSectorAvailableLocales, { sector }) as { availableLocales?: string[] } | null
        const availableLocales = data?.availableLocales ?? [SECTOR_DEFAULT_LOCALE]
        if (!availableLocales.includes(locale)) {
          const url = request.nextUrl.clone()
          url.pathname = `/${SECTOR_DEFAULT_LOCALE}/${sector}`
          return NextResponse.redirect(url)
        }
      } catch {
        return intlMiddleware(request)
      }
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|studio|.*\\..*).*)'],
}
