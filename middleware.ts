import createMiddleware from 'next-intl/middleware'
import {activeLocales, defaultLocale} from './i18n/locales'

export default createMiddleware({
  locales: [...activeLocales],
  defaultLocale,
  localePrefix: 'always',
})

export const config = {
  matcher: ['/((?!api|_next|studio|.*\\..*).*)'],
}