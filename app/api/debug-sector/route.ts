import { NextRequest } from 'next/server'
import { groq } from 'next-sanity'
import { client } from '../../../sanity/client'
import { getSectorPage, getSectorPageLegacy } from '../../../sanity/queries'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const sector = request.nextUrl.searchParams.get('sector') ?? 'woodworking'
  const locale = request.nextUrl.searchParams.get('locale') ?? 'nl-be'

  const count = await client.fetch(
    groq`count(*[_type == "sectorPage" && sector == $sector])`,
    { sector }
  )
  const rawDoc = await client.fetch(
    groq`*[_type == "sectorPage" && sector == $sector][0] {
      _id,
      sector,
      locale,
      "hasLocaleField": defined(locale),
      "heroTitleType": type(heroTitle),
      "heroTitleSample": type(heroTitle) == "object" ? { "keys": keys(heroTitle) } : heroTitle,
      "seoKeys": defined(seo) ? keys(seo) : null
    }`,
    { sector }
  )
  const localeAlt = locale.replace('-', '_')
  const newSchema = await client.fetch(getSectorPage(locale), { sector, locale, localeAlt })
  const legacySchema = await client.fetch(getSectorPageLegacy(locale), { sector })

  return Response.json({
    params: { sector, locale },
    count,
    rawDoc: rawDoc ?? null,
    newSchemaResult: newSchema ? { _id: (newSchema as { _id?: string })._id, hasData: true } : null,
    legacySchemaResult: legacySchema ? { _id: (legacySchema as { _id?: string })._id, hasData: true } : null,
    conclusion: !newSchema && !legacySchema ? 'Both queries null → 404' : 'Data found',
  })
}
