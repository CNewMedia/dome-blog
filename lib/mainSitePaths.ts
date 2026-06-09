/**
 * dome-auctions.com locale segment for insights app locales.
 * pl/ro/hu/bg/sk/sl have no dedicated main-site locale → English fallback.
 */
export function getMainSiteLocaleSegment(locale: string): string {
  const map: Record<string, string> = {
    'nl-be': 'nl',
    'fr-be': 'fr',
    'en-be': 'en',
    de: 'de',
  }
  return map[locale] ?? 'en'
}

export function getMainSiteHomeUrl(locale: string): string {
  return `https://dome-auctions.com/${getMainSiteLocaleSegment(locale)}/`
}
