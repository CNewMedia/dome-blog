# HubSpot HTML → Sanity Insights import

## Implementation plan

### Goal
Convert local HubSpot HTML blog exports into Sanity `post` (Insight) documents: one document per language version, with images uploaded to Sanity assets and inline image URLs replaced by asset references in Portable Text.

### File structure

```
scripts/
  import-hubspot-insights.ts   # Main script (run with npx tsx)
  README-hubspot-import.md     # This plan + usage
  (input)
  hubspot-export/              # Recommended folder for HTML exports (gitignored)
    en-be/
      my-article.html
    nl-be/
      mijn-artikel.html
    (optional) manifest.json   # Optional: locale + translationKey per file
```

### Pipeline (per HTML file)

1. **Read** HTML from path (single file or scan directory).
2. **Parse** with Cheerio: extract `<title>`, `<meta name="description">`, `<meta property="og:...">`, `<article>` or main content, all `<img>`.
3. **Derive** slug (from filename or first heading or meta), published date (from meta or parsing), locale (from parent folder or manifest or CLI).
4. **Resolve** main image (first article image or og:image) and all inline images (with src URLs).
5. **Download** image bytes for each URL (or read from local path if file:// or relative path).
6. **Upload** each image to Sanity via `client.assets.upload()`; collect `_id` (asset ref).
7. **Build** Portable Text body: map HTML blocks (p, h1–h6, ul, ol, blockquote) to block nodes; replace img with image blocks using asset refs.
8. **Check** duplicate: fetch existing post by `locale` + `slug.current`; skip or update.
9. **Create** document: `_type: 'post'`, locale, translationKey, title, excerpt, slug, body, mainImage, publishedAt, seoTitle, seoDescription.
10. **Report** per file: created / skipped (duplicate) / error.

### NPM packages

Install once (already in `package.json` devDependencies):

```bash
npm install
```

| Package    | Purpose                      |
|-----------|------------------------------|
| `cheerio` | Parse HTML, query selectors  |
| `slugify` | Generate URL-safe slugs      |
| `tsx`     | Run TypeScript script        |

- `@sanity/client`: already in project (write client uses `SANITY_API_WRITE_TOKEN` for upload + create).
- Node built-in `fetch` for downloading images (Node 18+).

### Modes

- **Dry-run** (default): parse and report only; no uploads, no creates.
- **Single-file**: `--file path/to/article.html` (+ optional `--locale`, `--translation-key`).
- **Bulk**: `--dir path/to/hubspot-export` (locale from subfolder name, e.g. `nl-be`, `en-be`).

### Locale and translationKey

- Locale: from folder name (`nl-be`, `fr-be`, `en-be`) or `--locale` or manifest.
- translationKey: optional UUID or slug shared across language versions; from manifest or `--translation-key` for single file.

### Duplicate handling

- Query: `*[_type == "post" && locale == $locale && slug.current == $slug][0]._id`.
- If exists: skip (or optional `--overwrite` in future).

### Sanity write client

- New client with `apiVersion: '2024-01-01'`, `dataset: 'production'`, `token: process.env.SANITY_API_WRITE_TOKEN`.
- Used for `client.assets.upload()` and `client.createOrReplace()`.

### Portable Text body shape

- Blocks: `{ _type: 'block', _key, style: 'normal'|'h2'|'h3'|'h4', children: [{ _type: 'span', _key, text, marks: [] }] }`.
- Images: `{ _type: 'image', _key, asset: { _type: 'reference', _ref: assetId } }`.
- Slug: `{ _type: 'slug', current: 'article-slug' }`.

### Output summary

Per file: path, locale, slug, title, status (created | skipped: duplicate | error), and if error the message. Final counts: processed, created, skipped, errors.

### Usage

```bash
# Dry-run (parse only, no writes)
npx tsx scripts/import-hubspot-insights.ts --file path/to/article.html --dry-run
npm run import-insights -- --dir hubspot-export --dry-run

# Single file (requires SANITY_API_WRITE_TOKEN)
npx tsx scripts/import-hubspot-insights.ts --file hubspot-export/nl-be/my-post.html --locale nl-be

# Bulk (locale from subdir names nl-be, fr-be, en-be)
npx tsx scripts/import-hubspot-insights.ts --dir hubspot-export

# Overwrite existing document (same locale + slug)
npx tsx scripts/import-hubspot-insights.ts --file path/to/article.html --overwrite
```
