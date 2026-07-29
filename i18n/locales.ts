/**
 * Routable app locales (middleware, SSG, Studio options, direct URLs).
 * Keep AI-translated locales here so existing ads/links keep working.
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
 * Locales shown in the site language menu / switcher.
 * Subset of activeLocales — edit this list to show or hide languages without
 * changing routing. Pages for omitted locales stay reachable via direct URL.
 */
export const menuLocales = ['nl-be', 'fr-be', 'en-be', 'de'] as const

export const defaultLocale = 'nl-be'

export type AppLocale = (typeof activeLocales)[number]
export type MenuLocale = (typeof menuLocales)[number]

export function isAppLocale(value: string): value is AppLocale {
  return activeLocales.includes(value as AppLocale)
}

export function isMenuLocale(value: string): value is MenuLocale {
  return (menuLocales as readonly string[]).includes(value)
}

/** Intersect any locale list with the menu-visible set (order follows menuLocales). */
export function filterMenuLocales(locales: readonly string[]): string[] {
  const set = new Set(locales)
  return menuLocales.filter((locale) => set.has(locale))
}
