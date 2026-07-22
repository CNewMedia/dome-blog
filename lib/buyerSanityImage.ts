import { urlFor } from '../sanity/client'

export type SanityImageLike =
  | { asset?: { _ref?: string; _id?: string; url?: string } | null; alt?: string }
  | null
  | undefined

export function hasSanityImage(image: SanityImageLike): boolean {
  const asset = image?.asset
  if (!asset || typeof asset !== 'object') return false
  if (typeof asset.url === 'string' && asset.url.trim()) return true
  if (typeof asset._ref === 'string' && asset._ref.trim()) return true
  if (typeof asset._id === 'string' && asset._id.trim()) return true
  return false
}

export function sanityImageUrl(image: SanityImageLike, width: number): string | null {
  if (!hasSanityImage(image)) return null

  const directUrl = typeof image?.asset?.url === 'string' ? image.asset.url.trim() : ''
  if (directUrl) {
    if (/\.svg($|[?#])/i.test(directUrl)) return directUrl
    const separator = directUrl.includes('?') ? '&' : '?'
    return `${directUrl}${separator}w=${width}`
  }

  try {
    return urlFor(image).width(width).url()
  } catch {
    return null
  }
}
