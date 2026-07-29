import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import {
  activeLocales,
  defaultLocale,
  isOfflineLocale,
  offlineRedirectLocale,
} from './i18n/locales'
import { getBuyerBasePath, isBuyerBasePath } from './lib/buyerPaths'

const intlMiddleware = createMiddleware({
  locales: [...activeLocales],
  defaultLocale,
  localePrefix: 'always',
})

/**
 * Map an offline-locale path to the en-be equivalent.
 * Buyer base segments (kupujacy, …) are remapped to `buyers`.
 * Fallback: /en-be
 */
function offlineRedirectPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return `/${offlineRedirectLocale}`

  const rest = segments.slice(1)
  if (rest.length === 0) return `/${offlineRedirectLocale}`

  if (isBuyerBasePath(rest[0])) {
    rest[0] = getBuyerBasePath(offlineRedirectLocale)
  }

  return `/${offlineRedirectLocale}/${rest.join('/')}`
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const first = pathname.split('/').filter(Boolean)[0]

  if (first && isOfflineLocale(first)) {
    const url = request.nextUrl.clone()
    url.pathname = offlineRedirectPath(pathname)
    return NextResponse.redirect(url, 301)
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|studio|.*\\..*).*)'],
}
