/**
 * Migrate heavy-equipment buyerPage docs from dotted IDs (auth-only ACL path)
 * to hyphenated IDs (public ACL path("*")) so CDN fetches work without a token.
 *
 * Dry run:  DOTENV_CONFIG_PATH=.env.local npx tsx scripts/migrate-buyer-heavy-equipment-public-ids.ts
 * Apply:    DOTENV_CONFIG_PATH=.env.local npx tsx scripts/migrate-buyer-heavy-equipment-public-ids.ts --write
 */
import 'dotenv/config'
import { createClient } from '@sanity/client'

const LOCALES = ['nl-be', 'fr-be', 'en-be', 'de', 'pl', 'ro', 'hu', 'bg', 'sk', 'sl'] as const

function publicId(locale: string) {
  return `buyerPage-heavy-equipment-${locale}`
}

function legacyIds(locale: string) {
  const base = `buyerPage.heavy-equipment.${locale}`
  return [base, `drafts.${base}`]
}

async function main() {
  const write = process.argv.includes('--write')
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (write && !token) {
    console.error('Missing SANITY_API_WRITE_TOKEN')
    process.exit(1)
  }

  const client = createClient({
    projectId: 'r1yazroc',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token,
  })

  for (const locale of LOCALES) {
    const sources = legacyIds(locale)
    const existing = await client.fetch<Record<string, unknown> | null>(
      `*[_id in $ids] | order(_id)[0]`,
      { ids: sources }
    )
    const targetId = publicId(locale)

    if (!existing) {
      console.log(`${locale}: no legacy doc — skip`)
      continue
    }

    const { _id, _rev, _updatedAt, _createdAt, _system, ...rest } = existing as Record<
      string,
      unknown
    > & { _id: string }

    console.log(
      `${locale}: ${write ? 'MIGRATE' : 'dry-run'} ${_id} → ${targetId} (hubspot=${String(rest.hubspotFormId || '').slice(0, 8)}…)`
    )

    if (!write) continue

    await client.createOrReplace({
      ...rest,
      _id: targetId,
      _type: 'buyerPage',
      locale,
      slug: rest.slug ?? { _type: 'slug', current: 'heavy-equipment' },
    })

    for (const id of sources) {
      const found = await client.fetch<{ _id: string } | null>(`*[_id == $id][0]{_id}`, { id })
      if (found?._id) {
        await client.delete(found._id)
        console.log(`  deleted ${_id === id ? id : id}`)
      }
    }
  }

  if (!write) {
    console.log('\nDry run only. Re-run with --write to apply.')
  } else {
    const anon = await fetch(
      'https://r1yazroc.api.sanity.io/v2024-01-01/data/query/production?query=' +
        encodeURIComponent(
          `*[_type=="buyerPage" && slug.current=="heavy-equipment"]{_id,locale}|order(locale)`
        )
    ).then((r) => r.json())
    console.log('\nAnonymous API visibility after migrate:')
    console.log(JSON.stringify(anon.result, null, 2))
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
