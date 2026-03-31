import { draftMode } from 'next/headers'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret') || ''
  const redirect = request.nextUrl.searchParams.get('redirect') || '/'

  if (!process.env.SANITY_PREVIEW_SECRET || secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new NextResponse('Invalid preview secret', { status: 401 })
  }

  const dm = await draftMode()
  dm.enable()

  const url = new URL(redirect, request.nextUrl.origin)
  return NextResponse.redirect(url)
}

