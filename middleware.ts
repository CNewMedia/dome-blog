import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['nl-be', 'fr-be', 'en', 'de'],
  defaultLocale: 'en',
  localePrefix: 'always',
})

export const config = {
  matcher: ['/((?!api|_next|studio|.*\\..*).*)'],
}
