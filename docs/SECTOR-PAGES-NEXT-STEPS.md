# Sector pages – next content steps

## 1. Recommended next 2–3 sector pages

Based on the current setup (one existing sectorPage: nl-be / verkoop-uw-houtbewerkingsmachines, woodworking-related) and the main-site/Navbar categories (metalworking, woodworking, agricultural, construction, transport), the most logical next pages are:

| # | Sector       | Locale | Slug              | Rationale |
|---|--------------|--------|-------------------|-----------|
| 1 | Woodworking  | en-be  | `woodworking`     | Complete woodworking in English; matches seed-tags and main site. |
| 2 | Woodworking  | fr-be  | `travail-du-bois` | Complete woodworking in French (all 3 locales then have a woodworking page). |
| 3 | Metalworking | nl-be  | `metaalbewerking` | First additional sector; aligns with Navbar/main site “Metaalbewerking”. |

After these, you’ll have:
- Woodworking in all three locales (existing nl-be + new en-be, fr-be).
- Metalworking started in nl-be (can add fr-be and en-be later).

---

## 2. Recommended approach: seed script

A **small seed script** is the cleanest option because:

- It creates exactly the required fields (`slug`, `locale`, `heroTitle`) plus `translationKey` in one go.
- It’s reproducible and avoids typos in slug/locale.
- It skips any locale+slug that already exists.
- You can then run the existing backfill to fill section defaults on the new docs.

**Manual creation** is fine for one-off pages; for 2–3 identical-structure docs, the script is faster and consistent.

---

## 3. Seed script usage

```bash
# Dry run (list what would be created)
npm run seed:sector

# Create documents (requires SANITY_API_WRITE_TOKEN)
npm run seed:sector:write

# Then fill section defaults on new docs (optional)
npm run backfill:sector:write
```

Script: `scripts/seed-sector-pages.ts`. It creates only the 3 entries above; you can edit `SEED_ENTRIES` to add or change sectors/locales/slugs.

---

## 4. Manual creation checklist (if you prefer Studio)

If you create sector pages by hand in Sanity Studio, use this for **each** new sectorPage:

**Required (must fill):**

- **Taal (locale)** – one of: Nederlands (België), Français (Belgique), English (Belgium).
- **Slug** – “Generate” from hero title, or type manually. Must be lowercase, hyphenated (e.g. `woodworking`, `travail-du-bois`, `metaalbewerking`). No reserved slug `articles`.
- **Hero title** – e.g. “Woodworking”, “Travail du bois”, “Metaalbewerking”.

**Recommended for consistency:**

- **Translation group (translationKey)** – same value for all locales of the same sector (e.g. `woodworking`, `metalworking`).

**Optional for first save:**

- Hero subtitle, hero image, hero eyebrow, hero CTA label/href, SEO title/description. You can leave these empty; the backfill script can add default section content later (`npm run backfill:sector:write`).

**After saving:** Run `npm run backfill:sector:write` to set default section copy and visibility on the new document(s).

---

## 5. Summary

- **Next 2–3 pages:** (1) Woodworking en-be, (2) Woodworking fr-be, (3) Metalworking nl-be.
- **Approach:** Use the seed script; then optionally backfill.
- **Script:** `npm run seed:sector` (dry run), `npm run seed:sector:write` (create). Edit `SEED_ENTRIES` in `scripts/seed-sector-pages.ts` to add more.
- **Manual alternative:** Create in Studio with locale + slug + hero title (and translationKey); then run backfill.
