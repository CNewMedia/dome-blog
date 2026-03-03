/**
 * Types for Sanity siteSettings document (header/footer).
 * Locale keys in API: nl_be, fr_be, en, de (underscore).
 */
export type LocaleString = {
  nl_be?: string
  fr_be?: string
  en?: string
  de?: string
}

export type HeaderMenuItem = {
  label?: LocaleString
  url?: string
  submenu?: { label?: LocaleString; url?: string }[]
}

export type FooterLink = {
  label?: LocaleString
  url?: string
}

export type FooterKolom = {
  titel?: LocaleString
  links?: FooterLink[]
}

export type SocialLink = {
  platform?: string
  url?: string
}

export type SiteSettings = {
  _id?: string
  logo?: { asset?: { _ref?: string }; [key: string]: unknown }
  logoAlt?: string
  bedrijfsnaam?: string
  tagline?: LocaleString
  headerMenu?: HeaderMenuItem[]
  footerKolommen?: FooterKolom[]
  socialLinks?: SocialLink[]
  adres?: string
  copyrightTekst?: LocaleString
  nieuwsbriefTitel?: LocaleString
}

const LOCALE_MAP: Record<string, keyof LocaleString> = {
  'nl-be': 'nl_be',
  'fr-be': 'fr_be',
  en: 'en',
  de: 'de',
}

/** Pick localized string for current locale; fallback to en then first value. */
export function getLocaleString(
  obj: LocaleString | undefined | null,
  locale: string
): string {
  if (!obj) return ''
  const key = LOCALE_MAP[locale] || 'en'
  const value = obj[key] || obj.en
  if (typeof value === 'string') return value
  const first = Object.values(obj).find((v) => typeof v === 'string')
  return typeof first === 'string' ? first : ''
}
