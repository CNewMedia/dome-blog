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
export const defaultLocale = 'nl-be'

export type AppLocale = (typeof activeLocales)[number]

export function isAppLocale(value: string): value is AppLocale {
  return activeLocales.includes(value as AppLocale)
}