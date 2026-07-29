import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = 'r1yazroc'
const dataset = 'production'
const apiVersion = '2024-01-01'

/**
 * Published content client — direct API (no CDN).
 * Used for SSG/ISR/revalidatePath rebuilds so publishes are not raced by
 * Sanity CDN staleness (up to ~60s). Safe for quota: not called per visitor
 * once pages are statically regenerated.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})

/**
 * Optional CDN client for non-critical reads (e.g. language-menu APIs)
 * where eventual consistency is acceptable.
 */
export const cdnClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

export function getClient(options?: { preview?: boolean }) {
  if (options?.preview) {
    throw new Error('Use sanity/previewClient on the server for preview queries.')
  }
  return client
}

const builder = imageUrlBuilder(client)
export const urlFor = (source: any) => builder.image(source)
