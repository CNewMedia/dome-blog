import { validatePreviewUrl } from '@sanity/preview-url-secret'
import { createClient } from '@sanity/client'
import { draftMode } from 'next/headers'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const projectId = 'r1yazroc'
const dataset = 'production'
const apiVersion = '2024-01-01'

function previewTokenClient() {
  const token = process.env.SANITY_API_READ_TOKEN
  if (!token) return null
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  })
}

export async function GET(request: NextRequest) {
  const redirectParam = request.nextUrl.searchParams.get('redirect') || '/'
  const tokenClient = previewTokenClient()

  // Presentation tool: time-limited secret validated via SANITY_API_READ_TOKEN
  if (tokenClient && request.nextUrl.searchParams.has('sanity-preview-secret')) {
    const { isValid, redirectTo } = await validatePreviewUrl(tokenClient, request.url)
    if (!isValid) {
      return new NextResponse('Invalid preview secret', { status: 401 })
    }
    const dm = await draftMode()
    dm.enable()
    const url = new URL(redirectTo || redirectParam, request.nextUrl.origin)
    return NextResponse.redirect(url)
  }

  // Manual / Studio Links view: shared SANITY_PREVIEW_SECRET
  const secret = request.nextUrl.searchParams.get('secret') || ''
  if (!process.env.SANITY_PREVIEW_SECRET || secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new NextResponse('Invalid preview secret', { status: 401 })
  }

  const dm = await draftMode()
  dm.enable()
  const url = new URL(redirectParam, request.nextUrl.origin)
  return NextResponse.redirect(url)
}
