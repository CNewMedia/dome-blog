# Slug strategy for sector pages – recommendation

## 1. Sector pages: short structural slugs (recommended)

**Recommendation: use short structural sector slugs** (e.g. `woodworking`, `houtbewerking`, `travail-du-bois`, `metaalbewerking`) for sector landing pages, not long SEO-style phrase slugs (e.g. `verkoop-uw-houtbewerkingsmachines`).

### Why short structural wins for sector pages

| Criterion | Short structural | Long SEO-style |
|-----------|------------------|----------------|
| **Role of the URL** | Reflects information architecture (one sector = one concept). Easy to remember, share, and link. | Locks one keyword phrase into the URL. Changing content focus can make the URL misleading. |
| **Stability** | Sector name is stable. Locale-appropriate slug (houtbewerking / woodworking / travail-du-bois) stays valid. | One of many possible phrases; targeting another phrase later would require a new URL or a breaking change. |
| **Internal linking** | Predictable pattern. Navbar, footer, cross-links: same logic across locales. | Harder to maintain; each link is a long, opaque string. |
| **SEO** | Google ranks on content, title, and meaning. Short URLs do not hurt; they can improve CTR in SERPs and are easier to read. Keyword-in-URL has very small effect. | Minor possible benefit for one phrase, but you commit that URL to that phrase. Duplicate intent (e.g. same page under two URLs) is worse. |
| **Future structure** | Leaves room for dedicated long-tail/SEO pages on a different path (e.g. articles or a future landing segment). | Mixing long-tail and sector in the same `[sector]` segment blurs “category” vs “long-tail page” and makes routing and redirects messy. |

**Conclusion:** Treat sector landing pages as **category/overview pages**. Their URL should name the category (short, structural). Use **long-tail phrases** for dedicated SEO content (e.g. articles or a separate landing route), not for the sector segment.

---

## 2. Rename the existing woodworking sector page to a clean sector slug

**Recommendation: yes.** Rename the current nl-be document from slug `verkoop-uw-houtbewerkingsmachines` to a **short structural slug** such as **`houtbewerking`**.

- Aligns nl-be with the intended pattern for en-be (`woodworking`) and fr-be (`travail-du-bois`): one concept per sector, locale-appropriate slug.
- Keeps one canonical URL per sector per locale; avoids mixing “sector” and “long-tail” in the same route type.
- The phrase “verkoop uw houtbewerkingsmachines” can later be used as a **long-tail article** (e.g. under `/[locale]/articles/verkoop-uw-houtbewerkingsmachines`) or a dedicated SEO landing page, without overloading the sector URL.

**Required when renaming:** add a **301 redirect** from the old URL to the new one so existing links and search equity are preserved (see section 3).

---

## 3. Impact of renaming (old slug → new slug)

### Routes

- **Pattern unchanged:** `[locale]/[sector]`. Only the slug value in Sanity changes.
- **After update:** Change the document’s `slug.current` in Sanity from `verkoop-uw-houtbewerkingsmachines` to `houtbewerking`, then rebuild/redeploy. `generateStaticParams` and the sitemap both read from Sanity, so they will immediately use the new slug. No route code change.

### Internal linking

- **Driven by Sanity:** Links that are built from sector data (e.g. sitemap, locale switcher, any “sector” links from content) will point to the new URL as soon as the document is updated and the app is rebuilt.
- **Hardcoded or external links** to `/nl-be/verkoop-uw-houtbewerkingsmachines` will 404 unless you add a redirect. Hence the need for a 301.

### Sitemap

- **After rebuild:** Sitemap will list `/{locale}/houtbewerking` and no longer list the old slug. The old URL will disappear from the sitemap; the redirect ensures that requests to the old URL still land on the canonical page.

### SEO

- **301 redirect:** Passes link equity from the old URL to the new one. Search engines will consolidate on the new canonical URL.
- **Canonical and metadata:** Your app already uses the document’s `slug` for `canonical`, `openGraph.url`, and metadata. So after the slug change, all of these will point to `…/houtbewerking`. No code change needed for that.
- **Result:** One canonical URL per sector per locale; no duplicate content; short, clear URL in SERPs.

### Redirects (what to implement)

- **One redirect rule:**  
  **From:** `/{locale}/verkoop-uw-houtbewerkingsmachines`  
  **To:** `/{locale}/houtbewerking`  
  **Status:** 301 (permanent).

- **Where:** Next.js `next.config.mjs` `redirects` (or middleware) so that any request to the old path is 301’d to the new path. If you add more sector renames later, add one redirect per old slug (and optionally a pattern if the structure is consistent).

- **No redirect:** Old URL returns 404; external links and any cached SERP links break; some link equity is lost. So the redirect is the clean, recommended step.

---

## 4. Long-term URL structure (sector, articles, future SEO pages)

A clear separation keeps routing, linking, and SEO predictable.

| Content type | Route pattern | Slug style | Purpose |
|--------------|----------------|-----------|--------|
| **Sector landing pages** | `/[locale]/[sector]` | **Short, structural** (e.g. `woodworking`, `houtbewerking`, `metaalbewerking`, `travail-du-bois`). One concept per sector, locale-appropriate. | Category/overview pages: “this is our woodworking (or metalworking, etc.) offering.” Stable, easy to link and maintain. |
| **Insights / articles** | `/[locale]/articles/[slug]` | **Flexible.** Can be short (`machine-valuation`) or longer/descriptive (`verkoop-uw-houtbewerkingsmachines`, `how-to-sell-woodworking-machines`). | Editorial and long-tail SEO. Long phrases belong here, not in the sector segment. |
| **Future SEO landing pages** (optional) | Either `/[locale]/articles/[long-tail-slug]` or a dedicated segment, e.g. `/[locale]/pagina/[slug]` or `/[locale]/landing/[slug]` | **Long-tail / phrase slugs** are fine here. | Dedicated long-tail or campaign pages, without overloading the sector namespace. |

**Principles:**

- **Sector = category.** Short, structural, one per sector per locale. No mixing with long-tail phrases in the same segment.
- **Articles = flexible.** Current `articles` already supports any slug; use it for insights and for long-tail SEO (e.g. “verkoop uw houtbewerkingsmachines” as an article or landing page).
- **Optional dedicated landing route.** If you want many long-tail pages and prefer to keep them separate from both sectors and editorial articles, introduce something like `/[locale]/pagina/[slug]` or `/[locale]/landing/[slug]` and use long, phrase-based slugs there.

This gives you a **clean long-term structure**: sector pages with short structural slugs; articles (and possibly a dedicated landing segment) for long-tail and SEO phrases.

---

## 5. Summary

1. **Sector pages:** Use **short structural slugs** (e.g. woodworking, houtbewerking, metaalbewerking, travail-du-bois). Avoid long SEO-style phrase slugs in the sector segment.
2. **Existing woodworking page:** **Rename** the nl-be document from `verkoop-uw-houtbewerkingsmachines` to **`houtbewerking`**, and add a **301 redirect** from the old path to the new one.
3. **Impact:** Routes and sitemap follow the new slug after doc update + rebuild; canonical and metadata already use the document slug; internal links from Sanity follow automatically; SEO is preserved via 301; implement one redirect rule for the old URL.
4. **Long-term:** Keep sectors short and structural; use **articles** (and optionally a dedicated landing route) for long-tail and SEO phrase URLs. No code changes required for this recommendation; only content (slug in Sanity) and one redirect when you implement the rename.
