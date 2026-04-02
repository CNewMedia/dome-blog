import { draftMode } from 'next/headers'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const dm = await draftMode()
  dm.disable()
  const redirect = request.nextUrl.searchParams.get('redirect') || '/'
  const url = new URL(redirect, request.nextUrl.origin)
  return NextResponse.redirect(url)
}

