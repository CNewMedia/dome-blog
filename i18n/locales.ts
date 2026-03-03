export const activeLocales = ['nl', 'nl-be', 'fr-be', 'en'] as const
export const defaultLocale = 'en'

export type AppLocale = (typeof activeLocales)[number]

export function isAppLocale(value: string): value is AppLocale {
  return activeLocales.includes(value as AppLocale)
}