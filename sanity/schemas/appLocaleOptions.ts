import { activeLocales } from '../../i18n/locales'

const localeLabels: Record<(typeof activeLocales)[number], string> = {
  'nl-be': 'Nederlands (België)',
  'fr-be': 'Français (Belgique)',
  'en-be': 'English (Belgium)',
  de: 'Deutsch',
  pl: 'Polski',
  ro: 'Română',
  hu: 'Magyar',
  bg: 'Български',
  sk: 'Slovenčina',
  sl: 'Slovenščina',
}

export const appLocaleFieldOptions = {
  list: activeLocales.map((locale) => ({
    title: localeLabels[locale],
    value: locale,
  })),
  layout: 'dropdown' as const,
}
