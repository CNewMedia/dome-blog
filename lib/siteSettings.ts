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

export type SiteChromeMenuItem = {
  label?: string
  href?: string
  openInNewTab?: boolean
}

export type SiteChromeFooterLink = {
  label?: string
  href?: string
}

export type SiteChromeSocialLink = {
  platform?: string
  url?: string
}

export type SiteChrome = {
  _id?: string
  locale?: string
  companyName?: string
  headerLogo?: { asset?: { _ref?: string }; [key: string]: unknown }
  footerLogo?: { asset?: { _ref?: string }; [key: string]: unknown }
  logoAlt?: string
  headerMenu?: SiteChromeMenuItem[]
  newsletterTitle?: string
  footerPrimaryLinks?: SiteChromeFooterLink[]
  footerLegalLinks?: SiteChromeFooterLink[]
  socialLinks?: SiteChromeSocialLink[] // legacy / unused in new footer
  address?: string // legacy / unused in new footer
  copyrightText?: string // legacy / unused in new footer
}

export type FooterLinkSetting = {
  label?: string
  url?: string
}

export type SiteSettings = {
  _id?: string
  logo?: { asset?: { _ref?: string }; [key: string]: unknown }
  footerLogo?: { asset?: { _ref?: string }; [key: string]: unknown }
  logoAlt?: string
  bedrijfsnaam?: string
  tagline?: LocaleString // legacy / unused in new footer
  headerMenu?: HeaderMenuItem[]
  footerKolommen?: FooterKolom[]
  footerPrimaryLinks?: FooterLinkSetting[]
  footerLegalLinks?: FooterLinkSetting[]
  socialLinks?: SocialLink[] // legacy / unused in new footer
  adres?: string // legacy / unused in new footer
  copyrightTekst?: LocaleString // legacy / unused in new footer
  nieuwsbriefTitel?: LocaleString
  newsletterPlaceholder?: string
  newsletterButtonLabel?: string
}

const LOCALE_MAP: Record<string, keyof LocaleString> = {
  'nl-be': 'nl_be',
  'fr-be': 'fr_be',
  'en-be': 'en',
}

const makeLocaleString = (value: string | undefined | null, locale: string): LocaleString | undefined => {
  if (!value) return undefined
  const key = LOCALE_MAP[locale] || 'en'
  return { [key]: value.trim() } as LocaleString
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

export function buildSiteSettingsFromChrome(
  chrome: SiteChrome | null | undefined,
  locale: string
): SiteSettings | null {
  if (!chrome) return null

  const settings: SiteSettings = {}

  // Branding / logos
  if (chrome.headerLogo) {
    settings.logo = chrome.headerLogo
  }
  if (chrome.footerLogo) {
    settings.footerLogo = chrome.footerLogo
  }
  if (chrome.logoAlt) {
    settings.logoAlt = chrome.logoAlt
  }
  if (chrome.companyName) {
    settings.bedrijfsnaam = chrome.companyName
  }

  // Text content mapped into LocaleString for current locale
  // (tagline from old footerBaseline is no longer used in the new footer, but can remain available for other uses)
  // settings.tagline = makeLocaleString(chrome.footerBaseline, locale)
  settings.nieuwsbriefTitel = makeLocaleString(chrome.newsletterTitle, locale)

  // Header menu
  if (chrome.headerMenu && chrome.headerMenu.length > 0) {
    settings.headerMenu = chrome.headerMenu.map((item) => ({
      label: makeLocaleString(item.label, locale),
      url: item.href,
    }))
  }

  // Primary footer links (About us, FAQ, Contact, etc.)
  if (chrome.footerPrimaryLinks && chrome.footerPrimaryLinks.length > 0) {
    settings.footerPrimaryLinks = chrome.footerPrimaryLinks.map((link) => ({
      label: link.label ?? '',
      url: link.href ?? '',
    }))
  }

  // Legal footer links (Terms and conditions, Privacy policy, etc.)
  if (chrome.footerLegalLinks && chrome.footerLegalLinks.length > 0) {
    settings.footerLegalLinks = chrome.footerLegalLinks.map((link) => ({
      label: link.label ?? '',
      url: link.href ?? '',
    }))
  }

  // Social links
  if (chrome.socialLinks && chrome.socialLinks.length > 0) {
    settings.socialLinks = chrome.socialLinks.map((s) => ({
      platform: s.platform,
      url: s.url,
    }))
  }

  // Address
  if (chrome.address) {
    settings.adres = chrome.address
  }

  return settings
}
