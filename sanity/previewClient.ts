import 'server-only'
import { createClient } from '@sanity/client'

const projectId = 'r1yazroc'
const dataset = 'production'
const apiVersion = '2024-01-01'

export const previewClient = process.env.SANITY_API_READ_TOKEN
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: process.env.SANITY_API_READ_TOKEN,
      perspective: 'previewDrafts',
    })
  : null
