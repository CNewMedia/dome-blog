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

export const previewClient =
  process.env.SANITY_API_READ_TOKEN
    ? createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn: false,
        token: process.env.SANITY_API_READ_TOKEN,
        perspective: 'previewDrafts',
      })
    : client

export function getClient(options?: { preview?: boolean }) {
  if (options?.preview) return previewClient
  return client
}

const builder = imageUrlBuilder(client)
export const urlFor = (source: any) => builder.image(source)
