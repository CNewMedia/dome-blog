import 'server-only'
import { draftMode } from 'next/headers'
import { client } from '../sanity/client'
import { previewClient } from '../sanity/previewClient'

/**
 * Fetch published Sanity content via the direct API (`useCdn: false`).
 * Called on build / ISR / on-demand revalidate — not per public visitor once
 * the page is cached — so API quota stays low while avoiding CDN race after publish.
 *
 * In draft/presentation preview, uses previewClient (API + token) for drafts.
 */
export async function fetchSanity<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T> {
  const { isEnabled } = await draftMode()
  if (isEnabled && previewClient) {
    return previewClient.fetch<T>(query, params)
  }
  return client.fetch<T>(query, params)
}
