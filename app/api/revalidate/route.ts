import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'
import { getBuyerBasePath } from '../../../lib/buyerPaths'
import { activeLocales } from '../../../i18n/locales'
import { client } from '../../../sanity/client'
import { getSectorSlugs } from '../../../sanity/queries'

export const dynamic = 'force-dynamic'

type RevalidatePayload = {
  _type?: string
  _id?: string
  locale?: string
  slug?: string
  /** Explicit path(s) from webhook projection or manual trigger */
  path?: string
  paths?: string[]
}

type SectorSlugRow = { slug?: string; locale?: string }

/**
 * Resolve paths to revalidate for a webhook payload.
 *
 * post: article + insights overview + locale home.
 * teamMember: all sector pages.
 * siteChrome: locale layout tree (navbar/footer).
 * siteSettings: all locale layout trees (global chrome/tracking).
 * tag: all insights overviews (filter tabs / related).
 */
async function resolvePaths(body: RevalidatePayload): Promise<string[]> {
  const paths = new Set<string>()

  if (typeof body.path === 'string' && body.path.startsWith('/')) {
    paths.add(body.path)
  }
  if (Array.isArray(body.paths)) {
    for (const p of body.paths) {
      if (typeof p === 'string' && p.startsWith('/')) paths.add(p)
    }
  }

  const locale = typeof body.locale === 'string' ? body.locale : null
  const slug = typeof body.slug === 'string' ? body.slug.toLowerCase() : null

  if (locale && slug) {
    if (body._type === 'sectorPage') {
      paths.add(`/${locale}/${slug}`)
    }
    if (body._type === 'buyerPage') {
      paths.add(`/${locale}/${getBuyerBasePath(locale)}/${slug}`)
    }
    if (body._type === 'post') {
      // Canonical article URL is /articles/{slug}; /insights/{slug} is an alias route.
      paths.add(`/${locale}/articles/${slug}`)
      paths.add(`/${locale}/insights/${slug}`)
      paths.add(`/${locale}/insights`)
      paths.add(`/${locale}`)
    }
  }

  if (body._type === 'teamMember') {
    const pages = (await client.fetch(getSectorSlugs)) as SectorSlugRow[]
    for (const page of pages) {
      if (typeof page.locale === 'string' && typeof page.slug === 'string') {
        paths.add(`/${page.locale}/${page.slug.toLowerCase()}`)
      }
    }
  }

  if (body._type === 'siteChrome') {
    const chromeLocale = locale || (typeof body._id === 'string' ? body._id.replace(/^.*siteChrome[-.]/, '') : null)
    if (chromeLocale && activeLocales.includes(chromeLocale as (typeof activeLocales)[number])) {
      paths.add(`/${chromeLocale}`)
    } else {
      for (const loc of activeLocales) paths.add(`/${loc}`)
    }
  }

  if (body._type === 'siteSettings') {
    for (const loc of activeLocales) paths.add(`/${loc}`)
  }

  if (body._type === 'tag') {
    if (locale) {
      paths.add(`/${locale}/insights`)
      paths.add(`/${locale}`)
    } else {
      for (const loc of activeLocales) {
        paths.add(`/${loc}/insights`)
        paths.add(`/${loc}`)
      }
    }
  }

  return Array.from(paths)
}

function isAuthorizedSecret(secret: string | null): boolean {
  const expected = process.env.SANITY_REVALIDATE_SECRET
  return Boolean(expected && secret && secret === expected)
}

/**
 * Manual revalidation: GET /api/revalidate?secret=…&path=/nl-be/…
 * Optional: &path=/a&path=/b (repeated) or comma-separated paths.
 */
export async function GET(request: NextRequest) {
  if (!process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json(
      { message: 'Missing SANITY_REVALIDATE_SECRET' },
      { status: 500 }
    )
  }

  const secret = request.nextUrl.searchParams.get('secret')
  if (!isAuthorizedSecret(secret)) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  const rawPaths = request.nextUrl.searchParams.getAll('path')
  const paths = rawPaths
    .flatMap((p) => p.split(','))
    .map((p) => p.trim())
    .filter((p) => p.startsWith('/'))

  if (paths.length === 0) {
    return NextResponse.json(
      { message: 'Provide at least one path query param, e.g. ?path=/nl-be/slug' },
      { status: 400 }
    )
  }

  for (const path of paths) {
    // 'layout' so locale-root revalidations (siteChrome/siteSettings) refresh nested pages.
    revalidatePath(path, path.split('/').filter(Boolean).length === 1 ? 'layout' : 'page')
  }

  return NextResponse.json({ revalidated: true, paths })
}

/**
 * Sanity webhook: POST /api/revalidate
 * Validate signature with SANITY_REVALIDATE_SECRET (same value as webhook secret).
 */
export async function POST(request: NextRequest) {
  try {
    if (!process.env.SANITY_REVALIDATE_SECRET) {
      return new Response('Missing environment variable SANITY_REVALIDATE_SECRET', {
        status: 500,
      })
    }

    const { isValidSignature, body } = await parseBody<RevalidatePayload>(
      request,
      process.env.SANITY_REVALIDATE_SECRET,
      true
    )

    if (!isValidSignature) {
      return new Response(
        JSON.stringify({ message: 'Invalid signature', isValidSignature, body }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!body) {
      return new Response(JSON.stringify({ message: 'Bad Request: empty body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const paths = await resolvePaths(body)
    if (paths.length === 0) {
      return new Response(
        JSON.stringify({
          message:
            'Bad Request: could not resolve paths (need path/paths, _type+locale+slug, teamMember, siteChrome, siteSettings, tag, or post)',
          body,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    for (const path of paths) {
      revalidatePath(path, path.split('/').filter(Boolean).length === 1 ? 'layout' : 'page')
    }

    return NextResponse.json({
      revalidated: true,
      paths,
      type: body._type ?? null,
      id: body._id ?? null,
    })
  } catch (err) {
    console.error('[revalidate]', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(message, { status: 500 })
  }
}
