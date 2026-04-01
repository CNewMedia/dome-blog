export const BUYER_BASE_BY_LOCALE: Record<string, string> = {
  'nl-be': 'kopers',
  'fr-be': 'acheteurs',
  'en-be': 'buyers',
}

export function getBuyerBasePath(locale: string): string {
  return BUYER_BASE_BY_LOCALE[locale] ?? 'buyers'
}

export function isBuyerBasePath(segment: string | undefined): boolean {
  if (!segment) return false
  return Object.values(BUYER_BASE_BY_LOCALE).includes(segment)
}

