import { getBuyerBasePath } from '../lib/buyerPaths'

const DOMAIN = 'https://insights.dome-auctions.com'

type Doc = {
  _type?: string
  locale?: string
  slug?: { current?: string }
  sector?: string
}

export function resolveProductionUrl(doc: Doc | null | undefined): string | null {
  if (!doc) return null
  const { _type, locale, slug } = doc
  const loc = locale || (doc as any).language || ''
  const slugStr = slug?.current

  if (!loc || !slugStr) {
    // Special case: legacy sectorPage without slug but with sector field
    if (_type === 'sectorPage' && (doc as any).sector && loc) {
      const sector = String((doc as any).sector).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
      return `${DOMAIN}/${loc}/${sector}`
    }
    return null
  }

  if (_type === 'sectorPage') {
    return `${DOMAIN}/${loc}/${slugStr}`
  }

  if (_type === 'buyerPage') {
    return `${DOMAIN}/${loc}/${getBuyerBasePath(loc)}/${slugStr}`
  }

  if (_type === 'post') {
    return `${DOMAIN}/${loc}/insights/${slugStr}`
  }

  return null
}

export function resolvePreviewUrl(doc: Doc | null | undefined): string | null {
  const liveUrl = resolveProductionUrl(doc)
  if (!liveUrl) return null

  const base = process.env.NEXT_PUBLIC_SITE_URL || DOMAIN
  const secret = process.env.SANITY_STUDIO_PREVIEW_SECRET
  const path = liveUrl.replace(DOMAIN, '') || '/'

  if (!secret) return null

  const preview = new URL('/api/preview', base)
  preview.searchParams.set('secret', secret)
  preview.searchParams.set('redirect', path)
  return preview.toString()
}

