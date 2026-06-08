/**
 * Human-readable locale labels for UI (language + country).
 * Internal locale codes (routes, APIs) stay unchanged; only display text is defined here.
 * Add new entries when adding locales to keep labels in one place.
 */
const localeDisplayLabels: Record<string, string> = {
  'nl-be': 'Nederlands',
  'nl-nl': 'Nederlands',
  'fr-be': 'Français',
  'fr-fr': 'Français',
  'en-be': 'English',
  de: 'Deutsch',
  pl: 'Polski',
  ro: 'Română',
  hu: 'Magyar',
  bg: 'Български',
  sk: 'Slovenčina',
  sl: 'Slovenščina',
}

/** Short labels for compact UI (e.g. header language button). */
const localeShortLabels: Record<string, string> = {
  'nl-be': 'NL',
  'nl-nl': 'NL',
  'fr-be': 'FR',
  'fr-fr': 'FR',
  'en-be': 'EN',
  de: 'DE',
  pl: 'PL',
  ro: 'RO',
  hu: 'HU',
  bg: 'BG',
  sk: 'SK',
  sl: 'SL',
}

export function getLocaleDisplayLabel(localeCode: string): string {
  return localeDisplayLabels[localeCode] ?? localeCode
}

export function getLocaleShortLabel(localeCode: string): string {
  return localeShortLabels[localeCode] ?? localeCode.split('-')[0]?.toUpperCase() ?? localeCode
}
