# Implementation plan: sector slug rename (verkoop-uw-houtbewerkingsmachines → houtbewerking)

## 1. What changes when we rename the sectorPage slug

| Item | Change required | Where |
|------|-----------------|--------|
| **Sanity document** | Update `slug.current` from `verkoop-uw-houtbewerkingsmachines` to `houtbewerking` for the nl-be woodworking sectorPage. | Sanity Studio (or API patch). |
| **301 redirect** | Old URL → new URL so existing links and SEO equity are preserved. | `next.config.mjs` (see below). |
| **App code** | None. Routes, params, sitemap, canonical, and metadata all read the slug from Sanity. | — |

No other code or content references the old sector slug. Internal links to sector pages are built from Sanity (`getSectorSlugs`, locale switcher, etc.), so they will use the new slug after the document is updated and the app is rebuilt.

---

## 2. Impact summary

| Area | Impact |
|------|--------|
| **Routes** | Pattern `[locale]/[sector]` unchanged. After Sanity update, the only nl-be sector path generated is `/nl-be/houtbewerking`. The old path is no longer a static route; the redirect sends it to the new one. |
| **generateStaticParams** | Reads `getSectorSlugs` from Sanity. After document update, next build will emit `{ locale: 'nl-be', sector: 'houtbewerking' }` and will not emit the old slug. No code change. |
| **Sitemap** | Same source (`getSectorSlugs`). After update, sitemap will list `…/nl-be/houtbewerking` and will no longer list the old URL. No code change. |
| **Canonical URLs** | Page uses `data.slug` from the document for `canonical`, JSON-LD `url`, and metadata. After update, all point to `…/nl-be/houtbewerking`. No code change. |
| **Internal links** | All sector URLs are derived from Sanity (sitemap, `getSectorSlugs`, locale switcher). No hardcoded sector path in the app. After document update + rebuild, all point to the new slug. No code change. |
| **Redirects** | Must add one 301: `/nl-be/verkoop-uw-houtbewerkingsmachines` → `/nl-be/houtbewerking`. Implemented in `next.config.mjs` (see section 4). |

---

## 3. 301 redirect strategy

- **One redirect rule:**  
  - **Source:** `/nl-be/verkoop-uw-houtbewerkingsmachines`  
  - **Destination:** `/nl-be/houtbewerking`  
  - **Status:** 301 (permanent). Next.js: `permanent: true`.

- **Trailing slashes / query strings:** Next.js redirect `source` matches the path; by default, requests to `/nl-be/verkoop-uw-houtbewerkingsmachines` and `/nl-be/verkoop-uw-houtbewerkingsmachines?foo=bar` will both redirect to `/nl-be/houtbewerking` (query string is preserved by default for `destination` if you need it; for a simple path redirect we only set destination to the new path).

- **Future renames:** If you add more sector slug renames later, add one entry per old path in the same `redirects` array.

---

## 4. Where to implement the redirect

**Recommended place: `next.config.mjs`.**

- Next.js supports a `redirects` async function (or array) on the config. Redirects run early and return 301/302 responses without hitting the page.
- This project has no existing `redirects` in `next.config.mjs` and uses `withNextIntl`; the config wrapper does not conflict with adding `redirects`.
- Alternatives (middleware or a dedicated redirects file) would duplicate logic; the built-in `redirects` option is the standard and keeps all redirects in one place.

---

## 5. Execution order

1. **Add the redirect** in `next.config.mjs` (so the old URL is 301’d as soon as the new build is deployed).
2. **Update the document in Sanity:** set `slug.current` to `houtbewerking` for the nl-be woodworking sectorPage.
3. **Rebuild and deploy** so that static params, sitemap, and canonical all use the new slug. The redirect will then send any requests for the old URL to the new one.

Doing the redirect first (or in the same release as the Sanity change) avoids a window where the old URL 404s.

**Optional:** After the rename, update `docs/SECTOR-PAGES-NEXT-STEPS.md` so the “existing sectorPage” example reads `nl-be/houtbewerking` instead of `verkoop-uw-houtbewerkingsmachines`.

---

## 6. Strategy consistency

- **Sector pages:** Short structural slugs (e.g. `houtbewerking`, `woodworking`, `metaalbewerking`). This rename aligns the single existing sector page with that rule.
- **Articles:** Long-tail SEO slugs remain in `/[locale]/articles/[slug]`; no change. The phrase “verkoop uw houtbewerkingsmachines” can later be used as an article slug if you want a dedicated long-tail page.

No redesign or new features; only the one document slug change and the one redirect.
