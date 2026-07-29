/**
 * Routable app locales (middleware matcher, Studio options, Sanity content).
 * Offline locales stay listed so Studio/content remains intact; middleware
 * 301-redirects them to the English (en-be) equivalent.
 */
export const activeLocales = [
  'nl-be',
  'fr-be',
  'en-be',
  'de',
  'pl',
  'ro',
  'hu',
  'bg',
  'sk',
  'sl',
] as const

/**
 * Locales shown in the site language menu / switcher and in public SEO
 * (sitemap + hreflang). Edit this list to re-enable a language after validation.
 */
export const menuLocales = ['nl-be', 'fr-be', 'en-be', 'de'] as const

export const defaultLocale = 'nl-be'

/** Public fallback locale for offline redirects. */
export const offlineRedirectLocale = 'en-be' as const

export type AppLocale = (typeof activeLocales)[number]
export type MenuLocale = (typeof menuLocales)[number]

/**
 * Locales that are fully offline for public traffic: 301 → en-be equivalent.
 * Derived from activeLocales − menuLocales.
 */
export const offlineLocales = activeLocales.filter(
  (locale): locale is Exclude<AppLocale, MenuLocale> =>
    !(menuLocales as readonly string[]).includes(locale)
)

export function isAppLocale(value: string): value is AppLocale {
  return activeLocales.includes(value as AppLocale)
}

export function isMenuLocale(value: string): value is MenuLocale {
  return (menuLocales as readonly string[]).includes(value)
}

export function isOfflineLocale(value: string): boolean {
  return offlineLocales.includes(value as Exclude<AppLocale, MenuLocale>)
}

/** Intersect any locale list with the menu-visible set (order follows menuLocales). */
export function filterMenuLocales(locales: readonly string[]): string[] {
  const set = new Set(locales)
  return menuLocales.filter((locale) => set.has(locale))
}
