import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { client, urlFor } from '../../../sanity/client'
import { getInsights, getTags } from '../../../sanity/queries'
import InsightsFilterTabs from '../../../components/InsightsFilterTabs'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ tag?: string }>
}

const DOMAIN = 'https://insights.dome-auctions.com'

export async function generateMetadata(
  { params }: { params: { locale: string } }
): Promise<Metadata> {
  const { locale } = params

  const titleByLocale: Record<string, string> = {
    'nl-be': 'Insights voor industriële veilingen | Dome Auctions',
    'fr-be': 'Insights pour les ventes industrielles | Dome Auctions',
    de: 'Insights für Industrieauktionen | Dome Auctions',
    en: 'Industrial auction insights | Dome Auctions',
  }

  const descriptionByLocale: Record<string, string> = {
    'nl-be':
      'Analyse, marktrapporten en strategieën voor de verkoop en aankoop van industriële machines via veilingen in Europa.',
    'fr-be':
      'Analyses, rapports de marché et stratégies pour la vente et l’achat de machines industrielles aux enchères en Europe.',
    de:
      'Analysen, Marktberichte und Strategien für den Kauf und Verkauf von Industriewerkzeugen über Auktionen in Europa.',
    en:
      'Analysis, market reports and strategies for buying and selling industrial equipment through auctions across Europe.',
  }

  const mappedLocale: Record<string, string> = {
    'nl-be': 'nl_BE',
    'fr-be': 'fr_BE',
    de: 'de_DE',
    en: 'en_GB',
  }

  const title = titleByLocale[locale] ?? titleByLocale.en
  const description = descriptionByLocale[locale] ?? descriptionByLocale.en
  const url = `${DOMAIN}/${locale}/insights`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'Dome Auctions',
      locale: mappedLocale[locale] ?? mappedLocale.en,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function InsightsPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { tag: tagSlug } = await searchParams
  const t = await getTranslations('insights')
  const [postsRaw, tagsRaw] = await Promise.all([
    client.fetch(getInsights(locale, tagSlug), tagSlug ? { locale, tagSlug } : { locale }).catch(() => null),
    client.fetch(getTags(locale), { locale }).catch(() => null),
  ])
  const fetchFailed = postsRaw === null || tagsRaw === null
  const posts: any[] = postsRaw ?? []
  const tags: { _id: string; title: string; slug: string }[] = tagsRaw ?? []
  const featured = posts[0]
  const baseUrl = `/${locale}/insights`

  return (
    <div className="insights-overview">
      <style>{`
        .insights-overview { font-style: normal; max-width: 100%; overflow-x: hidden; box-sizing: border-box; }
        .insights-overview *, .insights-overview *::before, .insights-overview *::after { box-sizing: inherit; }
        .insights-overview i, .insights-overview em { font-style: normal; }
        .hero { margin-top:0;min-height:72vh;display:grid;grid-template-columns:1.08fr 0.92fr;background:#0c0c0b;position:relative;overflow:hidden; }
        .hero-left { padding:6.5rem 4rem 5rem 4.5rem;display:flex;flex-direction:column;justify-content:flex-end;position:relative;z-index:2; }
        .hero-eyebrow { font-size:.65rem;font-weight:700;letter-spacing:.28em;text-transform:uppercase;color:#e8b84b;margin-bottom:1.5rem;display:flex;align-items:center;gap:1rem; }
        .hero-eyebrow::after { content:'';flex:1;height:1px;background:#e8b84b;opacity:.35;max-width:48px; }
        .hero-h1 { font-size:clamp(3rem,5.2vw,5.75rem);font-weight:400;line-height:1.05;letter-spacing:-.025em;color:#f7f5f0;margin-bottom:1.5rem; }
        .hero-h1 .hero-h1-accent { color:#e8b84b; }
        .hero-sub { font-size:.95rem;color:rgba(247,245,240,.7);line-height:1.7;max-width:360px;margin-bottom:2rem; }
        .hero-cta-left { display:inline-flex;align-items:center;gap:.5rem;background:#f7f5f0;color:#0c0c0b;font-size:.8rem;font-weight:700;padding:.65rem 1.35rem;border-radius:999px;text-decoration:none;transition:background .2s,color .2s;letter-spacing:.02em;width:fit-content; }
        .hero-cta-left:hover { background:#e8b84b;color:#0c0c0b; }
        .hero-right { position:relative;overflow:hidden;min-height:72vh; }
        .hero-feat-bg { position:absolute;inset:0;background:#141210;display:flex;align-items:center;justify-content:center;font-size:8rem;z-index:0; }
        .hero-feat-bg img,.card-big-img img { width:100%;height:100%;object-fit:cover;display:block; }
        .hero-feat-block { position:absolute;right:5rem;bottom:2.5rem;left:auto;width:min(calc(100% - 7rem),400px);max-width:90%;background:#e8b84b;padding:2rem 2rem 2.25rem;z-index:2; }
        .hero-feat-block .hero-tag { display:inline-block;background:#0c0c0b;color:#f7f5f0;font-size:.6rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;padding:.35rem .75rem;border-radius:999px;margin-bottom:.85rem; }
        .hero-feat-block .hero-feat-title { font-size:clamp(1.15rem,1.8vw,1.5rem);font-weight:400;color:#0c0c0b;line-height:1.28;margin-bottom:1rem;letter-spacing:-.01em; }
        .hero-feat-block .hero-feat-meta { display:flex;align-items:center;gap:1rem;font-size:.72rem;color:rgba(12,12,11,.7);flex-wrap:wrap; }
        .hero-read { display:inline-flex;align-items:center;gap:.45rem;background:#0c0c0b;color:#f7f5f0;font-size:.75rem;font-weight:700;padding:.55rem 1.2rem;border-radius:999px;text-decoration:none;margin-top:.5rem;transition:background .2s,color .2s;letter-spacing:.02em; }
        .hero-read:hover { background:#1a1814;color:#f7f5f0; }
        .ticker { background:#e8b84b;padding:.6rem 0;overflow:hidden;border-bottom:1px solid rgba(12,12,11,.15); }
        .ticker-track { display:flex;gap:3.5rem;white-space:nowrap;animation:ticker 28s linear infinite; }
        .ticker-item { font-size:.7rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#0c0c0b;display:flex;align-items:center;gap:.85rem;flex-shrink:0;opacity:.95; }
        .ticker-item::before { content:'◆';font-size:.45rem;opacity:.8; }
        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .filters { background:#f5f2eb;border-bottom:1px solid #e2ddd2;position:sticky;top:60px;z-index:100;box-shadow:0 1px 0 rgba(255,255,255,.6) inset; }
        .filters-in { max-width:1320px;margin:0 auto;padding:1rem 2.5rem; }
        .filters-desktop { display:flex;align-items:center;justify-content:space-between;gap:1.25rem; }
        .filter-chips { display:flex;flex-wrap:wrap;align-items:center;gap:0.5rem 0.65rem; }
        .filter-chip { padding:0.55rem 1.1rem;font-size:.78rem;font-weight:500;color:#6a6560;border:1px solid #d8d2c8;background:#fff;border-radius:999px;white-space:nowrap;transition:color .2s,border-color .2s,background .2s,box-shadow .2s;cursor:pointer;font-family:inherit; }
        .filter-chip:hover { color:#0c0c0b;border-color:#b8b0a4;background:#fff;box-shadow:0 2px 8px rgba(12,12,11,.06); }
        .filter-chip.on { color:#fff;font-weight:600;background:#0c0c0b;border-color:#0c0c0b;box-shadow:0 2px 10px rgba(12,12,11,.2); }
        .filter-more-wrap { position:relative; }
        .filter-more-btn { display:inline-flex;align-items:center;gap:0.3rem;padding:0.55rem 1.1rem;font-size:.78rem;font-weight:500;color:#6a6560;border:1px solid #d8d2c8;background:#fff;border-radius:999px;cursor:pointer;font-family:inherit;transition:color .2s,border-color .2s; }
        .filter-more-btn:hover,.filter-more-btn.on { color:#0c0c0b;border-color:#0c0c0b; }
        .filter-more-chevron { font-size:.5rem;opacity:.85;transition:transform .2s; }
        .filter-more-btn.on .filter-more-chevron { transform:rotate(180deg); }
        .filter-more-popover { position:absolute;top:100%;left:0;margin-top:0.4rem;min-width:200px;padding:0.5rem;background:#fff;border:1px solid #e2ddd2;border-radius:12px;box-shadow:0 16px 48px rgba(12,12,11,.14);z-index:200;display:flex;flex-direction:column;gap:0.1rem; }
        .filter-more-item { padding:0.65rem 0.9rem;font-size:.8rem;font-weight:500;color:#0c0c0b;background:none;border:none;border-radius:8px;text-align:left;cursor:pointer;font-family:inherit;transition:background .15s; }
        .filter-more-item:hover,.filter-more-item.on { background:#f5f2eb; }
        .filter-more-item.on { font-weight:700; }
        .fcount { font-size:.72rem;color:#8a8680;white-space:nowrap;flex-shrink:0;letter-spacing:.03em; }
        .filters-mobile { display:none;align-items:center;gap:0.75rem;flex-wrap:wrap; }
        .filter-mobile-chip { padding:0.55rem 1rem;font-size:.78rem;font-weight:500;color:#6a6560;border:1px solid #d8d2c8;background:#fff;border-radius:999px;cursor:pointer;font-family:inherit; }
        .filter-mobile-chip.on { color:#fff;background:#0c0c0b;border-color:#0c0c0b; }
        .filter-mobile-current { font-size:.8rem;color:#0c0c0b;font-weight:600; }
        .filter-mobile-filters-btn { display:inline-flex;align-items:center;gap:0.4rem;padding:0.55rem 1.1rem;font-size:.78rem;font-weight:600;color:#0c0c0b;background:none;border:1.5px solid #0c0c0b;border-radius:999px;cursor:pointer;font-family:inherit;margin-left:auto;transition:background .2s,color .2s; }
        .filter-mobile-filters-btn:hover { background:#0c0c0b;color:#fff; }
        .filter-mobile-chevron { font-size:1rem; }
        .filters-sheet-overlay { position:fixed;inset:0;background:rgba(12,12,11,.45);z-index:300; }
        .filters-sheet-panel { position:fixed;bottom:0;left:0;right:0;max-height:72vh;background:#f5f2eb;border-radius:20px 20px 0 0;box-shadow:0 -12px 40px rgba(12,12,11,.18);z-index:301;display:flex;flex-direction:column;overflow:hidden; }
        .filters-sheet-header { display:flex;align-items:center;justify-content:space-between;padding:1.25rem 1.5rem;border-bottom:1px solid #e2ddd2; }
        .filters-sheet-title { font-size:.9rem;font-weight:700;color:#0c0c0b;letter-spacing:.02em; }
        .filters-sheet-close { width:2.75rem;height:2.75rem;display:flex;align-items:center;justify-content:center;font-size:1.5rem;color:#8a8680;background:none;border:none;cursor:pointer;font-family:inherit;border-radius:10px;transition:background .15s; }
        .filters-sheet-close:hover { background:rgba(12,12,11,.06); }
        .filters-sheet-list { padding:1rem 1.5rem 1.75rem;overflow-y:auto;display:flex;flex-direction:column;gap:0.35rem; }
        .filters-sheet-item { padding:0.9rem 1.1rem;font-size:.88rem;font-weight:500;color:#0c0c0b;background:#fff;border:1px solid #e2ddd2;border-radius:12px;text-align:left;cursor:pointer;font-family:inherit;transition:background .15s,border-color .15s; }
        .filters-sheet-item:hover,.filters-sheet-item.on { background:#f5f2eb;border-color:#0c0c0b; }
        .filters-sheet-item.on { font-weight:700; }
        @media(max-width:768px){ .filters-desktop{display:none} .filters-mobile{display:flex} .fcount-mobile{margin-left:0;order:4;width:100%;font-size:.7rem;padding-top:0.35rem} }
        @media(min-width:769px){ .filters-mobile{display:none} }
        .main { width: 100%; max-width: 1320px; margin: 0 auto; padding: 4.5rem 2.5rem 8rem; box-sizing: border-box; }
        .grid-top { display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto auto;gap:0;border:1px solid #0c0c0b;margin-bottom:3.5rem;overflow:hidden;background:#0c0c0b; }
        .grid-top .card-big { grid-column:1/-1; }
        .card-big { position:relative;min-height:420px;text-decoration:none;color:inherit;display:block;overflow:hidden; }
        .card-big-img { position:absolute;inset:0;background:#1a1816; }
        .card-big-img::after { content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(12,12,11,.97) 0%,rgba(12,12,11,.85) 25%,rgba(12,12,11,.4) 50%,transparent 100%); }
        .card-big-body { position:absolute;left:0;right:0;bottom:0;padding:2.75rem 3.5rem 3.5rem;display:flex;flex-direction:column;align-items:flex-start;max-width:900px; }
        .card-big-body .ctag-featured { display:inline-block;background:#e8b84b;color:#0c0c0b;font-size:.7rem;font-weight:800;letter-spacing:.22em;text-transform:uppercase;padding:.5rem 1rem;margin-bottom:1.25rem; }
        .card-big-body .ctitle { color:#f7f5f0; }
        .card-big-body .ctitle-lg { font-size:clamp(1.85rem,3vw,2.5rem);font-weight:400;line-height:1.18;letter-spacing:-.02em;margin-bottom:.75rem; }
        .card-big-body .cexcerpt { color:rgba(247,245,240,.75);font-size:1rem;line-height:1.6;margin-bottom:1.25rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
        .card-big-body .cmeta { display:flex;align-items:center;flex-wrap:wrap;gap:.75rem 1.25rem;font-size:.8rem;color:rgba(247,245,240,.55); }
        .card-big-body .cmeta .cta-read { display:inline-flex;align-items:center;gap:.4rem;margin-left:0;padding:.5rem 1.25rem;font-size:.8rem;font-weight:600;color:#f7f5f0;background:transparent;border:1px solid rgba(247,245,240,.75);border-radius:999px;text-decoration:none;transition:border-color .2s,color .2s,background .2s; }
        .card-big-body .cmeta .cta-read:hover { color:#e8b84b;border-color:#e8b84b; }
        .card-sm { background:#faf8f4;text-decoration:none;color:inherit;display:flex;flex-direction:row;border:1px solid #e0dbd0;border-top:none;transition:background .15s; min-width: 0; }
        .card-sm:first-of-type { border-left:none; }
        .card-sm:hover { background:#f5f2eb; }
        .card-sm-img { position:relative;width:160px;min-height:120px;flex-shrink:0;background:#1a1816;display:flex;align-items:center;justify-content:center;font-size:2.5rem;overflow:hidden; }
        .card-sm-img img { width:100%;height:100%;object-fit:cover;object-position:left center;display:block; }
        .card-sm .card-sm-body { padding:1.5rem 1.75rem 1.75rem;display:flex;flex-direction:column;flex:1;min-height:0;min-width:0;border-top:none;border-left:1px solid #e0dbd0;background:#faf8f4; }
        .card-sm .ctag-yellow { display:inline-block;background:#e8b84b;color:#0c0c0b;font-size:.65rem;font-weight:800;letter-spacing:.18em;text-transform:uppercase;padding:.45rem .9rem;margin-bottom:1rem;width:fit-content; }
        .ctitle { font-weight:400;line-height:1.28;letter-spacing:-.015em;color:#0c0c0b; }
        .ctitle-sm { font-size:1.08rem;line-height:1.32;margin-bottom:.5rem; }
        .card-sm .cexcerpt { font-size:.84rem;color:#5c5854;line-height:1.58;flex:1; }
        .cmeta { display:flex;align-items:center;gap:.7rem;font-size:.72rem;color:#8a8680;margin-top:auto;padding-top:.85rem; }
        .cmeta-sep { width:3px;height:3px;border-radius:50%;background:#e0dbd0; }
        .cread { margin-left:auto; }
        .cta-read { display:inline-flex;align-items:center;gap:.35rem;padding:.5rem 1.25rem;font-size:.8rem;font-weight:600;color:#0c0c0b;background:transparent;border:1px solid #0c0c0b;border-radius:999px;text-decoration:none;transition:border-color .2s,color .2s,background .2s; }
        .cta-read:hover { background:#0c0c0b;color:#f7f5f0; }
        .sect-lbl { font-size:.65rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#8a8680;margin-bottom:1.75rem;margin-top:0;display:flex;align-items:center;gap:1rem; }
        .sect-lbl::after { content:'';flex:1;height:1px;background:#e2ddd2; }
        .grid-3 { display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,340px));justify-content:start;gap:1.75rem;margin-bottom:4.5rem; min-width: 0; }
        .grid-3--one { max-width:340px; }
        .card-reg { text-decoration:none;color:inherit;border:1px solid #d0cac0;border-radius:0;overflow:hidden;background:#faf8f4;display:flex;flex-direction:column;transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease; min-width: 0; }
        .card-reg:hover { transform:translateY(-3px);box-shadow:0 20px 48px rgba(12,12,11,.08);border-color:#0c0c0b; }
        .card-reg-img { position:relative;height:200px;background:linear-gradient(145deg,#1a1816,#252219);display:flex;align-items:center;justify-content:center;font-size:3.5rem;overflow:hidden; }
        .card-reg-body { padding:1.5rem 1.65rem 1.65rem;flex:1;display:flex;flex-direction:column; }
        .card-reg-body .ctag-yellow { display:inline-block;background:#e8b84b;color:#0c0c0b;font-size:.65rem;font-weight:800;letter-spacing:.18em;text-transform:uppercase;padding:.45rem .9rem;margin-bottom:.75rem;width:fit-content; }
        .card-reg-foot { display:flex;align-items:center;justify-content:space-between;padding-top:1rem;margin-top:auto;border-top:1px solid #e8e4dc;font-size:.73rem;color:#8a8680; }
        .no-posts { text-align:center;padding:8rem 2rem;color:#8a8680; }
        .no-posts p { font-size:1.05rem;margin-top:.5rem; }
        @media(max-width:1024px){ .hero{grid-template-columns:1fr;min-height:auto} .hero-right{min-height:50vh} .hero-left{padding:5rem 2rem 4rem} .hero-feat-block{right:0;bottom:0;left:0;width:100%;max-width:none} .grid-top{display:grid;grid-template-columns:1fr;grid-template-rows:auto auto auto;gap:0} .grid-top .card-big{grid-column:1;grid-row:1} .grid-top .card-sm{grid-column:1;grid-row:auto} .grid-3{grid-template-columns:repeat(2,1fr)} .grid-3--one{grid-template-columns:1fr;max-width:340px;margin-right:auto} }
        @media(max-width:768px){ .hero{min-height:auto} .hero-left{padding:2.5rem 1.25rem 2rem} .hero-h1{font-size:2.9rem} .hero-sub{max-width:none} .hero-right{min-height:38vh} .hero-feat-block{padding:1.5rem 1.25rem;right:0;left:0;bottom:0} .hero-feat-block .hero-feat-title{font-size:1.15rem} .main{padding:2rem 1rem 4rem;width:100%} .filters{min-width:0;overflow-x:hidden} .filters-in{padding:0.75rem 1rem;max-width:100%;min-width:0} .grid-top{margin-bottom:2.5rem;width:100%;min-width:0} .grid-top .card-big,.grid-top .card-sm{width:100%;min-width:0} .grid-3{grid-template-columns:1fr;min-width:0} .grid-3--one{max-width:none} .card-big{min-height:280px} .card-big-body{padding:1.5rem 1.25rem 1.75rem;max-width:none} .card-big-body .ctitle-lg{font-size:1.35rem;line-height:1.3} .card-big-body .cexcerpt{-webkit-line-clamp:2} .card-big-body .ctag-featured{font-size:.65rem;padding:.4rem .8rem;margin-bottom:.75rem} .card-big-body .cmeta{flex-direction:column;flex-wrap:nowrap;align-items:flex-start;gap:.4rem} .card-big-body .cmeta .cread{margin-top:.15rem} .grid-top .card-sm + .card-sm{border-top:1px solid #e0dbd0} .card-sm{flex-direction:column;border-left:none;border-right:none;width:100%} .card-sm-img{width:100%;height:140px;min-height:140px} .card-sm-img img{object-position:center center} .card-sm .card-sm-body{border-left:none;border-top:1px solid #e0dbd0;padding:1.25rem 1.25rem} .card-sm .ctitle-sm{font-size:1rem} .card-sm .cexcerpt{font-size:.8rem} .card-sm .cmeta{flex-direction:column;flex-wrap:nowrap;align-items:flex-start;gap:.25rem} .card-sm .cmeta .cread{margin-top:.2rem} .cmeta{flex-direction:column;align-items:flex-start;gap:.35rem} .cread{margin-left:0} .card-reg{min-width:0;width:100%} .card-reg-body{padding:1.25rem 1.25rem} .card-reg-foot{flex-direction:column;align-items:flex-start;gap:.4rem;padding-top:.75rem} .card-reg-foot .cta-read{margin-top:.1rem} .sect-lbl{margin-bottom:1.25rem} }
        @media(max-width:480px){ .ticker{display:none} }
      `}</style>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-eyebrow">Industry Insights</div>
          <h1 className="hero-h1">Market<br/><span className="hero-h1-accent">Intelligence</span><br/>for Buyers.</h1>
          <p className="hero-sub">Expert analysis on industrial machinery markets, auction strategies and emerging trends across Europe.</p>
          <Link href={featured ? `/${locale}/articles/${featured.slug}` : '#main'} className="hero-cta-left">
            {featured ? 'Read latest' : 'Explore insights'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
        {featured ? (
          <div className="hero-right">
            <div className="hero-feat-bg">
              {featured.mainImage ? (
                <Image
                  src={urlFor(featured.mainImage).width(1200).height(800).url()}
                  alt={featured.mainImage.alt || featured.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <span style={{ fontSize: '6rem', opacity: 0.4 }}>🏭</span>
              )}
            </div>
            <div className="hero-feat-block">
              <span className="hero-tag">Featured</span>
              <h2 className="hero-feat-title">{featured.title}</h2>
              <div className="hero-feat-meta">
                {featured.publishedAt && (
                  <span>{new Date(featured.publishedAt).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                )}
              </div>
              <Link href={`/${locale}/articles/${featured.slug}`} className="hero-read">Read article →</Link>
            </div>
          </div>
        ) : (
          <div className="hero-right">
            <div className="hero-feat-bg"><span style={{ fontSize: '6rem', opacity: 0.35 }}>📰</span></div>
          </div>
        )}
      </section>

      {/* STRUCTURED DATA: ItemList */}
      {posts.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              itemListElement: posts.slice(0, 10).map((post: any, index: number) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: `${DOMAIN}/${locale}/articles/${post.slug}`,
              })),
            }),
          }}
        />
      )}

      {/* TICKER */}
      {tags.length > 0 && (
        <div className="ticker">
          <div className="ticker-track">
            {[...tags, ...tags].map((t, i) => (
              <Link
                key={`${t._id}-${i}`}
                href={`${baseUrl}?tag=${t.slug}`}
                className="ticker-item"
              >
                {t.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* FILTERS */}
      <InsightsFilterTabs
        baseUrl={baseUrl}
        tags={tags}
        currentTagSlug={tagSlug}
        postCount={posts.length}
        filterAllLabel={t('filterAll')}
        filterMoreLabel={t('filterMore')}
        filterFiltersLabel={t('filterFilters')}
        filterAllTopicsLabel={t('filterAllTopics')}
      />

      <main id="main" className="main">
        {posts.length === 0 ? (
          <div className="no-posts">
            <h2 className="hero-h1" style={{color:'#0c0c0b',fontSize:'2rem'}}>
              {fetchFailed ? 'Unable to load insights.' : t('noArticles')}
            </h2>
            {fetchFailed && <p style={{marginTop:'.5rem',fontSize:'1rem'}}>Please try again later.</p>}
          </div>
        ) : (
          <>
            {posts.length >= 3 ? (
              <>
                <div className="grid-top">
                  <Link href={`/${locale}/articles/${featured.slug}`} className="card-big">
                    <div className="card-big-img">
                      {featured.mainImage ? (
                        <Image
                          src={urlFor(featured.mainImage).width(1200).height(500).url()}
                          alt={featured.mainImage.alt || featured.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 100vw"
                          className="object-cover"
                        />
                      ) : (
                        <span style={{fontSize:'4rem',opacity:.5}}>🏭</span>
                      )}
                    </div>
                    <div className="card-big-body">
                      <span className="ctag-featured">Featured</span>
                      <h2 className="ctitle ctitle-lg">{featured.title}</h2>
                      <p className="cexcerpt" style={{marginBottom:'.5rem'}}>{featured.excerpt}</p>
                      <div className="cmeta">
                        {featured.publishedAt && (
                          <span>{new Date(featured.publishedAt).toLocaleDateString(locale, {year:'numeric',month:'long',day:'numeric'})}</span>
                        )}
                        <span className="cread cta-read">Read <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
                      </div>
                    </div>
                  </Link>
                  {posts.slice(1,3).map((post: any) => (
                    <Link key={post._id} href={`/${locale}/articles/${post.slug}`} className="card-sm">
                      <div className="card-sm-img">
                        {post.mainImage ? (
                          <Image
                            src={urlFor(post.mainImage).width(400).height(240).url()}
                            alt={post.mainImage.alt || post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 160px"
                            className="object-cover object-left"
                          />
                        ) : (
                          <span style={{fontSize:'2.5rem',opacity:.5}}>📰</span>
                        )}
                      </div>
                      <div className="card-sm-body">
                        {post.tags?.[0]?.title ? <span className="ctag-yellow">{post.tags[0].title}</span> : null}
                        <h3 className="ctitle ctitle-sm">{post.title}</h3>
                        <p className="cexcerpt" style={{fontSize:'.82rem'}}>{post.excerpt?.substring(0,100)}{post.excerpt?.length > 100 ? '...' : ''}</p>
                        <div className="cmeta">
                          {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString(locale)}</span>}
                          <span className="cread cta-read">Read →</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {posts.length > 3 && (
                  <>
                    <h2 className="sect-lbl">
                      {tagSlug ? (tags.find((tag) => tag.slug === tagSlug)?.title ?? tagSlug) : t('allArticles')}
                    </h2>
                    <div className={posts.slice(3).length === 1 ? 'grid-3 grid-3--one' : 'grid-3'}>
                      {posts.slice(3).map((post: any) => (
                        <Link key={post._id} href={`/${locale}/articles/${post.slug}`} className="card-reg">
                          <div className="card-reg-img">
                            {post.mainImage ? (
                              <Image
                                src={urlFor(post.mainImage).width(680).height(400).url()}
                                alt={post.mainImage.alt || post.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 340px"
                                className="object-cover"
                              />
                            ) : (
                              '📄'
                            )}
                          </div>
                          <div className="card-reg-body">
                            {post.tags?.[0]?.title ? <span className="ctag-yellow">{post.tags[0].title}</span> : null}
                            <h3 className="ctitle ctitle-sm">{post.title}</h3>
                            <p className="cexcerpt" style={{fontSize:'.82rem',marginTop:'.5rem'}}>{post.excerpt?.substring(0,120)}{post.excerpt?.length > 120 ? '...' : ''}</p>
                            <div className="card-reg-foot">
                              {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString(locale)}</span>}
                              <span className="cta-read">Read →</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <h2 className="sect-lbl">
                  {tagSlug ? (tags.find((tag) => tag.slug === tagSlug)?.title ?? tagSlug) : t('latestInsights')}
                </h2>
                <div className="grid-3">
                  {posts.map((post: any) => (
                    <Link key={post._id} href={`/${locale}/articles/${post.slug}`} className="card-reg">
                      <div className="card-reg-img">
                        {post.mainImage ? (
                          <Image
                            src={urlFor(post.mainImage).width(680).height(400).url()}
                            alt={post.mainImage.alt || post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 340px"
                            className="object-cover"
                          />
                        ) : (
                          '📄'
                        )}
                      </div>
                      <div className="card-reg-body">
                        {post.tags?.[0]?.title ? <span className="ctag-yellow">{post.tags[0].title}</span> : null}
                        <h3 className="ctitle ctitle-sm">{post.title}</h3>
                        <p className="cexcerpt" style={{fontSize:'.82rem',marginTop:'.5rem'}}>{post.excerpt?.substring(0,120)}{post.excerpt?.length > 120 ? '...' : ''}</p>
                        <div className="card-reg-foot">
                          {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString(locale)}</span>}
                          <span className="cta-read">Read →</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}

