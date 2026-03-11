# Sector landing pages – audit

## 1. How the app discovers sector pages

- **Routes** are dynamic: `[locale]/[sector]` (e.g. `/nl-be/woodworking`). There is **no hardcoded list** of sector slugs in the app.
- **Static generation & sitemap** use only **new-schema** `sectorPage` documents:
  - `generateStaticParams()` in `app/[locale]/[sector]/page.tsx` calls `getSectorSlugs`.
  - `getSectorSlugs` (in `sanity/queries.ts`) returns only documents with **`defined(locale)`** and a slug (`slug.current` or `sector`).
  - So: **only sectorPage documents that have a `locale`** are in the sitemap and get static params. Legacy documents (no `locale`) are **not** included.

**Conclusion:** “Expected” sector routes from the app’s point of view are exactly the set returned by `getSectorSlugs`. If that returns 0 documents, no sector URLs are pre-rendered or listed in the sitemap, but any URL can still be requested at runtime (see below).

---

## 2. How a request like `/nl-be/woodworking` is resolved

In `app/[locale]/[sector]/page.tsx`, `getSectorData(sector, locale)`:

1. **Tries new schema:** `getSectorPage(locale)` – document with matching `slug` (or `sector`) **and** `locale`. If found and valid → **real Sanity sectorPage (new schema)**.
2. **Falls back to legacy:** `getSectorPageLegacy(locale)` – document with `lower(sector) == slug` and **no locale** (`locale == null || !defined(locale)`). Content comes from localized fields (e.g. `heroTitle.nl_be`). If found → **legacy fallback**.
3. **Otherwise:** returns `null` → **404**.

So the site can be using a **mix**: some routes served from new-schema docs, others from legacy docs, and others 404.

---

## 3. Getting the real status (existing vs missing)

To see what actually exists in your dataset, run the read-only audit script:

```bash
npm run audit:sector
```

It prints:

- **Existing sectorPage documents (new schema)** – have `locale`; used for static params and sitemap.
- **Legacy sectorPage documents** – no `locale`; can still serve requests via `getSectorPageLegacy` but are **not** in static params or sitemap.
- A short summary and reminder of the resolution order.

Interpretation:

- **Existing (new schema):** these routes are fully driven by Sanity with the new schema and appear in sitemap/static generation.
- **Legacy only:** those sector slugs work at runtime via fallback but are not pre-rendered or in the sitemap.
- **Missing:** if you have an “intended” list of sectors (e.g. metalworking, woodworking, agricultural, construction, transport from the Navbar), any slug that has neither a new-schema doc nor a legacy doc will 404. The app does **not** define that list; the Navbar links point to `dome-auctions.com/.../categories/...`, not to this app’s `/[locale]/[sector]` routes.

---

## 4. Reliance per route type

| Situation | Static params / sitemap | Request resolution | Content source |
|-----------|--------------------------|---------------------|----------------|
| New-schema doc for (slug, locale) | Yes | `getSectorPage` | Real Sanity (new schema). Empty fields may still use defaults in components. |
| Legacy doc for slug, no new-schema doc | No | `getSectorPageLegacy` | Legacy Sanity (localized fields). |
| No doc for slug | No | 404 | — |

So:

- **Real Sanity sectorPage content:** when a new-schema document exists for that slug + locale (and fields are filled).
- **Legacy fallback:** when only a legacy document exists for that slug.
- **Hardcoded/default content:** components may still show defaults for missing optional fields (e.g. hero title fallback “Industrial Auctions”, placeholder copy). That applies on top of either new or legacy docs.
- **Mix:** possible: e.g. one locale from new doc, another from legacy; or some sectors new, others legacy.

---

## 5. If some sector pages are missing as real documents

- **Only legacy docs exist:** Those sector routes work at runtime but are not in sitemap/static generation. To make them “first-class” you can run the existing **migration** (`scripts/migrate-sector-pages.ts`) to create new-schema documents per locale from legacy, then re-run the audit.
- **No doc at all for a desired sector:** You need to create content:
  - **Manual:** create `sectorPage` documents in Sanity Studio (with `locale` and slug).
  - **Seed script:** add a script that creates one document per (sector slug, locale) with minimal/default fields.
  - **Fallback remains acceptable:** only if you don’t need that sector on this app (e.g. links stay on dome-auctions.com).

---

## 6. Concise audit checklist

1. Run: `npm run audit:sector`.
2. From the output, note:
   - **Existing (new schema):** list of `locale/slug` and whether that’s the full set you want.
   - **Legacy only:** which sector slugs still depend on fallback (and thus are not in sitemap/static).
   - **Missing:** intended sectors that have neither new nor legacy docs → 404 today.
3. Decide next step:
   - All intended sectors have new-schema docs → no change, or backfill fields if needed.
   - Some only legacy → run migration script if you want them in sitemap/static.
   - Some missing → create in Studio or add a seed script; or keep fallback/off-site links.

---

## 7. Next clean step

- **Immediate:** Run `npm run audit:sector` and keep the output as the reference for “existing vs missing” and “which routes use fallback.”
- **Then:** If you want every linked or intended sector to be a real, sitemapped page: ensure each has a new-schema `sectorPage` (by migration from legacy and/or manual/seed creation). If you’re fine with some sectors only via legacy or external links, document which routes rely on fallback and leave as-is.
