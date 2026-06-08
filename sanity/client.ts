import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = 'r1yazroc'
const dataset = 'production'
const apiVersion = '2024-01-01'

export const client = createClient({
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
