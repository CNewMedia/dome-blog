/**
 * Import HubSpot HTML blog exports into Sanity Insights (post documents).
 *
 * Requires: npm install cheerio slugify (and dotenv if not already present).
 * Run: npx tsx scripts/import-hubspot-insights.ts [options]
 *
 * Options:
 *   --dry-run              Parse and report only; no uploads or creates (default if no --file/--dir)
 *   --file <path>          Single HTML file to import
 *   --dir <path>           Directory to scan for HTML (locale from subdir name: nl-be, fr-be, en-be)
 *   --locale <locale>      Override locale for single file (e.g. nl-be)
 *   --translation-key <id> Optional translationKey for single file
 *   --overwrite            If document exists (locale+slug), replace it (default: skip)
 *   --debug                With --file: print body/PT diagnostic (selector, nodes, first 30 blocks) and exit
 *
 * Env: SANITY_API_WRITE_TOKEN required for any write (omit for dry-run only).
 */

import 'dotenv/config'
import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@sanity/client'
import type { SanityClient } from '@sanity/client'

// Optional deps: npm install cheerio slugify
function slugifySafe(s: string): string {
  try {
    return require('slugify')(s, { lower: true, strict: true })
  } catch {
    return s
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }
}

const ACTIVE_LOCALES = ['nl-be', 'fr-be', 'en-be'] as const
type AppLocale = (typeof ACTIVE_LOCALES)[number]

function isAppLocale(s: string): s is AppLocale {
  return ACTIVE_LOCALES.includes(s as AppLocale)
}

const PROJECT_ID = 'r1yazroc'
const DATASET = 'production'
const API_VERSION = '2024-01-01'

function getWriteClient(): SanityClient | null {
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!token) return null
  return createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: API_VERSION,
    token,
    useCdn: false,
  })
}

interface ExtractedData {
  title: string
  excerpt: string
  seoTitle: string
  seoDescription: string
  publishedAt: string | null
  mainImageUrl: string | null
  bodyHtml: string
  bodySelectorUsed: string
  images: Array<{ url: string; alt: string }>
}

function extractFromHtml(
  html: string,
  baseUrl: string,
  load: (html: string) => ReturnType<typeof import('cheerio').load>
): ExtractedData {
  const $ = load(html)
  const trim = (s: string) => (s || '').trim()

  const title = trim($('title').text() || $('meta[property="og:title"]').attr('content') || '')
  const excerpt = trim(
    $('meta[name="description"]').attr('content') ||
      $('meta[property="og:description"]').attr('content') ||
      ''
  )
  const seoTitle = trim($('meta[property="og:title"]').attr('content') || title)
  const seoDescription = excerpt
  const publishedAt =
    trim(
      $('meta[property="article:published_time"]').attr('content') ||
        $('time[datetime]').attr('datetime') ||
        ''
    ) || null
  const mainImageUrl =
    trim(
      $('meta[property="og:image"]').attr('content') ||
        $('article img').first().attr('src') ||
        $('.post-body img').first().attr('src') ||
        $('main img').first().attr('src') ||
        $('img').first().attr('src')
    ) || null

  const contentSelectors = [
    '#hs_cos_wrapper_post_body',
    'article .hs_cos_wrapper_type_rich_text',
    'article [id="hs_cos_wrapper_post_body"]',
    '.post-body',
    '.blog-post__body',
    '.hs-post-body',
    'article',
    'main .content',
    '[data-hs-content-id]',
    '.content',
    'main',
  ]
  let bodyEl = $()
  let bodySelectorUsed = 'body'
  for (const sel of contentSelectors) {
    bodyEl = $(sel).first()
    if (bodyEl.length && bodyEl.find('p, h1, h2, h3, h4, img').length > 0) {
      bodySelectorUsed = sel
      break
    }
  }
  if (!bodyEl.length) bodyEl = $('body')

  const bodyHtml = bodyEl.length ? bodyEl.html() || '' : $.html()
  const images: Array<{ url: string; alt: string }> = []
  $(bodyEl.length ? bodyEl.find('img') : 'img').each((_: number, el: any) => {
    const src = $(el).attr('src')
    if (src) images.push({ url: resolveUrl(src, baseUrl), alt: trim($(el).attr('alt') || '') })
  })

  return {
    title,
    excerpt,
    seoTitle,
    seoDescription,
    publishedAt,
    mainImageUrl,
    bodyHtml,
    bodySelectorUsed,
    images,
  }
}

function resolveUrl(href: string, base: string): string {
  if (href.startsWith('http://') || href.startsWith('https://')) return href
  if (href.startsWith('//')) return 'https:' + href
  if (path.isAbsolute(href)) return new URL(href, base).href
  return new URL(href, base).href
}

function generateKey(): string {
  return Math.random().toString(36).slice(2, 11)
}

type BlockChild = { _type: 'span'; _key: string; text: string; marks: string[] }
type MarkDef = { _key: string; _type: string; [k: string]: unknown }
type Block = {
  _type: 'block'
  _key: string
  style: string
  children: BlockChild[]
  markDefs?: MarkDef[]
  listItem?: 'bullet' | 'number'
  level?: number
}
type ImageBlock = { _type: 'image'; _key: string; asset: { _type: 'reference'; _ref: string }; alt?: string }
type TableBlock = {
  _type: 'tableBlock'
  _key: string
  rows: { _type: 'tableRow'; cells: string[] }[]
}

function htmlToPortableText(
  bodyHtml: string,
  imageRefs: Map<string, string>,
  baseUrl: string,
  load: (html: string) => ReturnType<typeof import('cheerio').load>
): (Block | ImageBlock | TableBlock)[] {
  const $ = load('<div>' + bodyHtml + '</div>')
  const nodes: (Block | ImageBlock | TableBlock)[] = []

  function getImageRef(src: string): string | undefined {
    const resolved = resolveUrl(src, baseUrl)
    return imageRefs.get(resolved) ?? imageRefs.get(src)
  }

  function styleForTag(tag: string): string {
    const map: Record<string, string> = {
      h1: 'h1',
      h2: 'h2',
      h3: 'h3',
      h4: 'h4',
      h5: 'h5',
      h6: 'h6',
      blockquote: 'blockquote',
      li: 'normal',
      ul: 'normal',
      ol: 'normal',
      p: 'normal',
    }
    return map[tag] || 'normal'
  }

  function textToSpans(text: string): BlockChild[] {
    const t = text.replace(/\u00a0/g, ' ').trim()
    if (!t) return []
    return [{ _type: 'span', _key: generateKey(), text: t, marks: [] }]
  }

  function flushBlock(
    style: string,
    children: BlockChild[],
    markDefs?: MarkDef[],
    listItem?: 'bullet' | 'number',
    level?: number
  ): void {
    if (children.length === 0) return
    const block: Block = {
      _type: 'block',
      _key: generateKey(),
      style,
      children,
    }
    if (markDefs?.length) block.markDefs = markDefs
    if (listItem) block.listItem = listItem
    if (level != null) block.level = level
    nodes.push(block)
  }

  /** Parse inline content (text, <a>, <strong>, <em>, <b>, <i>, <span>) into spans with marks and markDefs. */
  function parseInlines(
    $container: ReturnType<ReturnType<typeof load>>,
    currentMarks: string[]
  ): { parts: BlockChild[]; markDefs: MarkDef[] } {
    const parts: BlockChild[] = []
    const markDefs: MarkDef[] = []
    $container.contents().each((_: number, node: any) => {
      if (node.type === 'text') {
        const t = $(node).text().replace(/\u00a0/g, ' ').trim()
        if (t) parts.push({ _type: 'span', _key: generateKey(), text: t, marks: [...currentMarks] })
        return
      }
      if (node.type !== 'tag') return
      const tag = (node as { name: string }).name
      const $n = $(node)
      if (tag === 'a') {
        const href = $n.attr('href')
        const key = href ? generateKey() : ''
        if (key) markDefs.push({ _key: key, _type: 'link', href: resolveUrl(href, baseUrl) })
        const sub = parseInlines($n, href ? [...currentMarks, key] : currentMarks)
        parts.push(...sub.parts)
        markDefs.push(...sub.markDefs)
        return
      }
      if (tag === 'strong' || tag === 'b') {
        const sub = parseInlines($n, [...currentMarks, 'strong'])
        parts.push(...sub.parts)
        markDefs.push(...sub.markDefs)
        return
      }
      if (tag === 'em' || tag === 'i') {
        const sub = parseInlines($n, [...currentMarks, 'em'])
        parts.push(...sub.parts)
        markDefs.push(...sub.markDefs)
        return
      }
      if (tag === 'span') {
        const sub = parseInlines($n, currentMarks)
        parts.push(...sub.parts)
        markDefs.push(...sub.markDefs)
        return
      }
      if (tag === 'p' || (typeof tag === 'string' && tag.startsWith('h'))) {
        const sub = parseInlines($n, currentMarks)
        parts.push(...sub.parts)
        markDefs.push(...sub.markDefs)
        return
      }
    })
    return { parts, markDefs }
  }

  function emitBlockContent(
    $container: ReturnType<ReturnType<typeof load>>,
    style: string
  ): void {
    let parts: BlockChild[] = []
    let markDefs: MarkDef[] = []
    $container.contents().each((_: number, node: any) => {
      if (node.type === 'text') {
        const t = $(node).text().replace(/\u00a0/g, ' ').trim()
        if (t) parts.push({ _type: 'span', _key: generateKey(), text: t, marks: [] })
        return
      }
      if (node.type !== 'tag') return
      const tag = (node as { name: string }).name
      const $n = $(node)
      if (tag === 'img') {
        if (parts.length > 0) {
          flushBlock(style, parts, markDefs.length ? markDefs : undefined)
          parts = []
          markDefs = []
        }
        const src = $n.attr('src')
        const ref = src ? getImageRef(src) : undefined
        if (ref) {
          nodes.push({
            _type: 'image',
            _key: generateKey(),
            asset: { _type: 'reference', _ref: ref },
            alt: $n.attr('alt') || undefined,
          })
        }
        return
      }
      if (tag === 'a' || tag === 'span' || tag === 'strong' || tag === 'em' || tag === 'b' || tag === 'i') {
        const sub = parseInlines($n, [])
        parts.push(...sub.parts)
        markDefs.push(...sub.markDefs)
        return
      }
    })
    if (parts.length > 0) flushBlock(style, parts, markDefs.length ? markDefs : undefined)
  }

  function isBlankBlock($el: ReturnType<ReturnType<typeof load>>): boolean {
    const t = $el.text().replace(/\u00a0/g, ' ').trim()
    return !t && $el.find('img').length === 0
  }

  const walk = (el: { contents(): unknown; each(fn: (i: number, node: unknown) => void): unknown; length: number }) => {
    el.contents().each((_: number, node: any) => {
      if (node.type === 'text') {
        const t = $(node).text().replace(/\u00a0/g, ' ').trim()
        if (t) flushBlock('normal', textToSpans(t))
        return
      }
      if (node.type !== 'tag') return
      const tag = (node as { name: string }).name
      const $n = $(node)
      if (tag === 'img') {
        const src = $n.attr('src')
        const ref = src ? getImageRef(src) : undefined
        if (ref) {
          nodes.push({
            _type: 'image',
            _key: generateKey(),
            asset: { _type: 'reference', _ref: ref },
            alt: $n.attr('alt') || undefined,
          })
        }
        return
      }
      if (tag === 'p' || tag.startsWith('h')) {
        if (isBlankBlock($n)) return
        const style = styleForTag(tag)
        emitBlockContent($n, style)
        return
      }
      if (tag === 'ul') {
        $n.find('> li').each((__: number, li: any) => {
          const { parts: liParts, markDefs: liMarkDefs } = parseInlines($(li), [])
          if (liParts.length > 0) flushBlock('normal', liParts, liMarkDefs.length ? liMarkDefs : undefined, 'bullet', 1)
        })
        return
      }
      if (tag === 'ol') {
        $n.find('> li').each((__: number, li: any) => {
          const { parts: liParts, markDefs: liMarkDefs } = parseInlines($(li), [])
          if (liParts.length > 0) flushBlock('normal', liParts, liMarkDefs.length ? liMarkDefs : undefined, 'number', 1)
        })
        return
      }
      if (tag === 'blockquote') {
        const { parts: bqParts, markDefs: bqMarkDefs } = parseInlines($n, [])
        if (bqParts.length > 0) flushBlock('blockquote', bqParts, bqMarkDefs.length ? bqMarkDefs : undefined)
        return
      }
      if (tag === 'table') {
        const rows: { _type: 'tableRow'; cells: string[] }[] = []
        $n.find('thead tr, tbody tr').each((_: number, tr: any) => {
          const cells = $(tr)
            .find('td, th')
            .map((__: number, cell: any) => $(cell).text().replace(/\u00a0/g, ' ').trim())
            .get() as string[]
          if (cells.length > 0) rows.push({ _type: 'tableRow', cells })
        })
        if (rows.length > 0) {
          nodes.push({
            _type: 'tableBlock',
            _key: generateKey(),
            rows,
          })
        }
        return
      }
      if (tag === 'div' || tag === 'span') walk($n)
    })
  }

  // Cheerio parses as a document, so root is html and our content is in body > div. Walk the wrapper div.
  const root = $('body > div').first()
  if (!root.length) {
    const fallbackRoot = $('div').first()
    if (fallbackRoot.length) walk(fallbackRoot)
  } else {
    walk(root)
  }

  if (nodes.length === 0 && bodyHtml.trim()) {
    const fallback = $.root().text().replace(/\u00a0/g, ' ').trim()
    if (fallback) flushBlock('normal', textToSpans(fallback))
  }
  return nodes
}

async function downloadImage(url: string): Promise<Buffer> {
  if (url.startsWith('file://')) {
    const p = path.resolve(url.replace(/^file:\/\//, '').replace(/^\/([a-z]:)/i, '$1'))
    return fs.promises.readFile(p)
  }
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
  const arr = new Uint8Array(await res.arrayBuffer())
  return Buffer.from(arr)
}

async function uploadImage(client: SanityClient, buffer: Buffer, filename: string): Promise<string> {
  const ext = path.extname(filename) || '.jpg'
  const name = path.basename(filename, ext) || 'image'
  const asset = await client.assets.upload('image', buffer, {
    filename: name + ext,
  })
  return asset._id
}

function slugFromTitle(title: string): string {
  return slugifySafe(title)
}

function slugFromFilePath(filePath: string): string {
  const base = path.basename(filePath, '.html')
  return slugifySafe(base)
}

interface FileJob {
  filePath: string
  locale: AppLocale
  translationKey?: string
}

function parseArgs(): {
  dryRun: boolean
  overwrite: boolean
  debug: boolean
  jobs: FileJob[]
  localeOverride: AppLocale | null
  translationKeyOverride: string | null
} {
  const args = process.argv.slice(2)
  let dryRun = true
  let overwrite = false
  let debug = false
  let file: string | null = null
  let dir: string | null = null
  let localeOverride: AppLocale | null = null
  let translationKeyOverride: string | null = null

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--dry-run') dryRun = true
    else if (args[i] === '--debug') debug = true
    else if (args[i] === '--file' && args[i + 1]) {
      file = args[++i]
      dryRun = false
    } else if (args[i] === '--dir' && args[i + 1]) {
      dir = args[++i]
      dryRun = false
    } else if (args[i] === '--locale' && args[i + 1]) {
      const v = args[++i]
      if (isAppLocale(v)) localeOverride = v
    } else if (args[i] === '--translation-key' && args[i + 1]) translationKeyOverride = args[++i]
    else if (args[i] === '--overwrite') overwrite = true
  }

  const jobs: FileJob[] = []

  if (file) {
    const loc = localeOverride || (path.basename(path.dirname(path.resolve(file))) as AppLocale)
    jobs.push({
      filePath: path.resolve(file),
      locale: isAppLocale(loc) ? loc : ACTIVE_LOCALES[0],
      translationKey: translationKeyOverride || undefined,
    })
  } else if (dir) {
    const root = path.resolve(dir)
    for (const sub of fs.readdirSync(root, { withFileTypes: true })) {
      if (!sub.isDirectory()) continue
      const loc = sub.name as AppLocale
      if (!isAppLocale(loc)) continue
      const subPath = path.join(root, sub.name)
      for (const f of fs.readdirSync(subPath)) {
        if (!f.endsWith('.html')) continue
        jobs.push({
          filePath: path.join(subPath, f),
          locale: loc,
        })
      }
    }
  }

  return {
    dryRun,
    overwrite,
    debug,
    jobs,
    localeOverride,
    translationKeyOverride,
  }
}

interface SummaryRow {
  file: string
  locale: string
  slug: string
  title: string
  status: 'created' | 'skipped' | 'error'
  message?: string
}

function runDiagnostic(
  filePath: string,
  load: (html: string) => ReturnType<typeof import('cheerio').load>
): void {
  const html = fs.readFileSync(filePath, 'utf-8')
  const fileBaseUrl = 'file://' + path.dirname(filePath) + '/'
  const data = extractFromHtml(html, fileBaseUrl, load)

  const $body = load('<div>' + data.bodyHtml + '</div>')
  let root = $body('body > div').first()
  if (!root.length) root = $body('div').first()
  const directChildren = root.length ? (root.contents().toArray?.() ?? Array.from(root.contents())) : []

  const mockImageRefs = new Map<string, string>()
  data.images.forEach((img, i) => {
    mockImageRefs.set(img.url, `mock-ref-${i}`)
  })
  const body = htmlToPortableText(data.bodyHtml, mockImageRefs, fileBaseUrl, load)

  console.log('=== DIAGNOSTIC ===')
  console.log('1. Body source selector:', data.bodySelectorUsed)
  console.log('2. bodyHtml length:', data.bodyHtml.length)
  console.log('3. bodyHtml first 400 chars:', JSON.stringify(data.bodyHtml.slice(0, 400)))
  console.log('4. Images collected (extractFromHtml):', data.images.length, data.images.map((i) => i.url.slice(0, 50) + '...'))
  console.log('5. Direct children of root div (parsed body):', directChildren.length)
  directChildren.slice(0, 25).forEach((node: any, i) => {
    const type = node.type
    const name = node.name || node.tagName || '(no name)'
    const preview = type === 'tag' ? name : (type === 'text' ? `text(${(node.data || '').slice(0, 40)}...)` : type)
    console.log('   [' + i + ']', type, preview)
  })
  if (directChildren.length > 25) console.log('   ... and', directChildren.length - 25, 'more')
  console.log('6. Total PT blocks generated:', body.length)
  const imageBlocks = body.filter((b) => b._type === 'image')
  const tableBlocks = body.filter((b) => b._type === 'tableBlock')
  console.log('7. Image blocks in PT:', imageBlocks.length)
  console.log('8. Table blocks:', tableBlocks.length)
  console.log('9. First 30 PT blocks:')
  body.slice(0, 30).forEach((b, i) => {
    if (b._type === 'block') {
      const text = (b as Block).children.map((c) => (c as any).text).join('').slice(0, 60)
      console.log('   [' + i + '] block style=' + (b as Block).style + ' text=' + JSON.stringify(text))
    } else if (b._type === 'image') {
      console.log('   [' + i + '] image ref=' + (b as ImageBlock).asset._ref)
    } else if (b._type === 'tableBlock') {
      const rowCount = (b as TableBlock).rows?.length ?? 0
      console.log('   [' + i + '] tableBlock rows=' + rowCount)
    }
  })
}

async function main() {
  const { dryRun, overwrite, debug, jobs } = parseArgs()

  if (jobs.length === 0 && !dryRun) {
    console.log('Usage: npx tsx scripts/import-hubspot-insights.ts --file <path> | --dir <path> [--locale nl-be] [--translation-key <id>] [--overwrite]')
    console.log('       Add --dry-run to only parse and report. Add --debug with --file to print body/PT diagnostic.')
    process.exit(1)
  }

  let load: (html: string) => ReturnType<typeof import('cheerio').load>
  try {
    const cheerio = await import('cheerio')
    load = (html: string) => cheerio.load(html)
  } catch {
    console.error('Install cheerio: npm install cheerio')
    process.exit(1)
  }

  if (debug && jobs.length === 1) {
    runDiagnostic(jobs[0].filePath, load)
    process.exit(0)
  }

  const client = getWriteClient()
  if (!dryRun && !client) {
    console.error('SANITY_API_WRITE_TOKEN is required for import. Use --dry-run to only parse.')
    process.exit(1)
  }

  const summary: SummaryRow[] = []

  for (const job of jobs.length ? jobs : []) {
    const relPath = path.relative(process.cwd(), job.filePath)
    try {
      const html = fs.readFileSync(job.filePath, 'utf-8')
      const fileBaseUrl = 'file://' + path.dirname(job.filePath) + '/'
      const data = extractFromHtml(html, fileBaseUrl, load)
      const slug = slugFromFilePath(job.filePath) || slugFromTitle(data.title) || 'untitled'
      const title = data.title || path.basename(job.filePath, '.html')

      if (dryRun) {
        summary.push({
          file: relPath,
          locale: job.locale,
          slug,
          title,
          status: 'created',
          message: '[dry-run] would create',
        })
        console.log(`[dry-run] ${relPath} → locale=${job.locale} slug=${slug} title=${title}`)
        continue
      }

      const existing = await client!.fetch<{ _id: string } | null>(
        `*[_type == "post" && locale == $locale && slug.current == $slug][0]{ _id }`,
        { locale: job.locale, slug }
      )
      if (existing?._id && !overwrite) {
        summary.push({
          file: relPath,
          locale: job.locale,
          slug,
          title,
          status: 'skipped',
          message: 'duplicate (use --overwrite to replace)',
        })
        console.log(`Skip (duplicate): ${relPath} [${job.locale}] ${slug}`)
        continue
      }

      const imageRefs = new Map<string, string>()
      const allUrls = new Set<string>()
      if (data.mainImageUrl) allUrls.add(resolveUrl(data.mainImageUrl, fileBaseUrl))
      data.images.forEach((img) => allUrls.add(resolveUrl(img.url, fileBaseUrl)))

      for (const url of allUrls) {
        try {
          const buffer = await downloadImage(url)
          const filename = path.basename(new URL(url).pathname) || 'image.jpg'
          const ref = await uploadImage(client!, buffer, filename)
          imageRefs.set(url, ref)
        } catch (e) {
          console.warn(`Could not upload image ${url}:`, (e as Error).message)
        }
      }

      const body = htmlToPortableText(data.bodyHtml, imageRefs, fileBaseUrl, load)
      const mainImageRef = data.mainImageUrl
        ? imageRefs.get(resolveUrl(data.mainImageUrl, fileBaseUrl)) ?? null
        : null

      const doc = {
        _type: 'post',
        locale: job.locale,
        ...(job.translationKey && { translationKey: job.translationKey }),
        title,
        excerpt: data.excerpt || undefined,
        slug: { _type: 'slug', current: slug },
        body,
        ...(mainImageRef && {
          mainImage: {
            _type: 'image',
            asset: { _type: 'reference', _ref: mainImageRef },
          },
        }),
        ...(data.publishedAt && { publishedAt: data.publishedAt }),
        ...(data.seoTitle && { seoTitle: data.seoTitle }),
        ...(data.seoDescription && { seoDescription: data.seoDescription }),
      }

      if (existing?._id && overwrite) {
        await client!.createOrReplace({ ...doc, _id: existing._id })
        summary.push({ file: relPath, locale: job.locale, slug, title, status: 'created', message: 'replaced' })
        console.log(`Replaced: ${relPath} [${job.locale}] ${slug}`)
      } else {
        await client!.create(doc)
        summary.push({ file: relPath, locale: job.locale, slug, title, status: 'created' })
        console.log(`Created: ${relPath} [${job.locale}] ${slug}`)
      }
    } catch (e) {
      const msg = (e as Error).message
      summary.push({
        file: relPath,
        locale: job.locale,
        slug: '-',
        title: '-',
        status: 'error',
        message: msg,
      })
      console.error(`Error ${relPath}:`, msg)
    }
  }

  const created = summary.filter((s) => s.status === 'created').length
  const skipped = summary.filter((s) => s.status === 'skipped').length
  const errors = summary.filter((s) => s.status === 'error').length
  console.log('\nSummary:', { processed: summary.length, created, skipped, errors })
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
