import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { client, urlFor } from '../../../sanity/client'
import { getInsights, getTags } from '../../../sanity/queries'
import InsightsFilterTabs from '../../../components/InsightsFilterTabs'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ tag?: string }>
}

export default async function InsightsPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { tag: tagSlug } = await searchParams
  const t = await getTranslations('insights')
  const [posts, tags]: [any[], { _id: string; title: string; slug: string }[]] = await Promise.all([
    client.fetch(getInsights(locale, tagSlug), tagSlug ? { locale, tagSlug } : { locale }).catch(() => []),
    client.fetch(getTags(locale), { locale }).catch(() => []),
  ])
  const featured = posts[0]
  const rest = posts.slice(1)
  const baseUrl = `/${locale}/insights`

  return (
    <div className="insights-overview">
      <style>{`
        .insights-overview { font-family: 'Melody', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; }
        .hero { margin-top:0;min-height:72vh;display:grid;grid-template-columns:1fr 1fr;background:#0c0c0b;position:relative;overflow:hidden; }
        .hero-left { padding:8rem 3.5rem 6rem 4rem;display:flex;flex-direction:column;justify-content:flex-end;position:relative;z-index:2; }
        .hero-left::before { content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 10% 80%,rgba(232,184,75,.1) 0%,transparent 70%);pointer-events:none; }
        .hero-eyebrow { font-size:.68rem;font-weight:700;letter-spacing:.25em;text-transform:uppercase;color:#e8b84b;margin-bottom:1.75rem;display:flex;align-items:center;gap:1rem; }
        .hero-eyebrow::after { content:'';flex:1;height:1px;background:#e8b84b;opacity:.4;max-width:60px; }
        .hero-h1 { font-family:'Melody',-apple-system,BlinkMacSystemFont,system-ui,sans-serif;font-size:clamp(3.5rem,6vw,7rem);font-weight:400;line-height:1;letter-spacing:-.02em;color:#f7f5f0;margin-bottom:2rem; }
        .hero-h1 i { color:#e8b84b;font-style:italic; }
        .hero-sub { font-size:1rem;color:rgba(247,245,240,.45);line-height:1.7;max-width:360px;margin-bottom:3rem; }
        .hero-stats { display:flex;gap:3rem;padding-top:2.5rem;border-top:1px solid rgba(255,255,255,.1); }
        .stat-num { font-size:2rem;font-weight:800;color:#f7f5f0;line-height:1; }
        .stat-lbl { font-size:.72rem;color:rgba(247,245,240,.4);text-transform:uppercase;letter-spacing:.1em;margin-top:.3rem; }
        .hero-right { position:relative;overflow:hidden; }
        .hero-feat-bg { position:absolute;inset:0;background:linear-gradient(160deg,#222018,#161410);display:flex;align-items:center;justify-content:center;font-size:8rem;opacity:.7; }
        .hero-feat-overlay { position:absolute;inset:0;background:linear-gradient(to top,rgba(12,12,11,.95) 0%,rgba(12,12,11,.2) 60%,transparent 100%); }
        .hero-feat-body { position:absolute;bottom:0;left:0;right:0;padding:3rem; }
        .hero-tag { display:inline-block;background:#e8b84b;color:#0c0c0b;font-size:.65rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;padding:.3rem .75rem;border-radius:999px;margin-bottom:1rem; }
        .hero-feat-title { font-family:'Melody',-apple-system,BlinkMacSystemFont,system-ui,sans-serif;font-size:clamp(1.3rem,2.5vw,1.9rem);font-weight:400;color:#f7f5f0;line-height:1.25;margin-bottom:1.25rem; }
        .hero-feat-meta { display:flex;align-items:center;gap:1rem;font-size:.78rem;color:rgba(247,245,240,.45);flex-wrap:wrap; }
        .hero-read { display:inline-flex;align-items:center;gap:.5rem;background:#f7f5f0;color:#0c0c0b;font-size:.78rem;font-weight:700;padding:.6rem 1.25rem;border-radius:999px;text-decoration:none;margin-left:auto;transition:background .15s; }
        .hero-read:hover { background:#e8b84b; }
        .ticker { background:#e8b84b;padding:.65rem 0;overflow:hidden;border-bottom:1px solid #0c0c0b; }
        .ticker-track { display:flex;gap:4rem;white-space:nowrap;animation:ticker 30s linear infinite; }
        .ticker-item { font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#0c0c0b;display:flex;align-items:center;gap:1rem;flex-shrink:0; }
        .ticker-item::before { content:'◆';font-size:.5rem; }
        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .filters { background:#f7f5f0;border-bottom:1px solid #e0dbd0;position:sticky;top:60px;z-index:100; }
        .filters-in { max-width:1400px;margin:0 auto;padding:0 2.5rem;display:flex;align-items:center;gap:0;overflow-x:auto;scrollbar-width:none; }
        .filters-in::-webkit-scrollbar { display:none; }
        .ftab { padding:1rem 1.25rem;font-size:.8rem;font-weight:500;color:#8a8680;text-decoration:none;border-bottom:2px solid transparent;white-space:nowrap;transition:color .15s,border-color .15s;border:none;background:none;cursor:pointer;font-family:inherit; }
        .ftab:hover,.ftab.on { color:#0c0c0b; }
        .ftab.on { font-weight:700;border-bottom-color:#0c0c0b; }
        .fcount { margin-left:auto;font-size:.75rem;color:#8a8680;white-space:nowrap;padding-left:2rem; }
        .main { max-width:1400px;margin:0 auto;padding:4rem 2.5rem 8rem; }
        .grid-top { display:grid;grid-template-columns:1.25fr 1fr;grid-template-rows:auto auto;gap:1.5px;background:#e0dbd0;border:1.5px solid #e0dbd0;border-radius:16px;overflow:hidden;margin-bottom:3rem; }
        .card-big { grid-row:1/3;background:#f7f5f0;text-decoration:none;color:inherit;display:flex;flex-direction:column;justify-content:flex-start;overflow:hidden;transition:background .2s; }
        .card-big:hover { background:#efe9d8; }
        .card-big-img { height:180px;overflow:hidden;background:linear-gradient(135deg,#1c1a17,#2e2a22);display:flex;align-items:center;justify-content:center;font-size:5rem;position:relative; }
        .card-big-img::after { content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(12,12,11,.6),transparent 50%); }
        .card-big-body { padding:1.25rem 1.5rem 1.25rem;flex:0 1 auto;display:flex;flex-direction:column;min-height:0; }
        .card-big-body .cexcerpt { display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden; }
        .card-big-body .cmeta { padding-top:.65rem; }
        .card-sm { background:#f7f5f0;text-decoration:none;color:inherit;display:flex;flex-direction:column;padding:1.25rem 1.5rem;transition:background .2s; }
        .card-sm:hover { background:#efe9d8; }
        .card-sm-img { width:100%;height:100px;border-radius:10px;background:linear-gradient(135deg,#1c1a17,#2e2a22);margin-bottom:1rem;display:flex;align-items:center;justify-content:center;font-size:3rem; }
        .ctag { display:inline-flex;align-items:center;font-size:.65rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:.25rem .65rem;border-radius:999px;border:1px solid #c0bbb0;margin-bottom:.875rem;color:#8a8680; }
        .ctitle { font-family:'Melody',-apple-system,BlinkMacSystemFont,system-ui,sans-serif;font-weight:400;line-height:1.25;letter-spacing:-.01em;color:#0c0c0b; }
        .ctitle-lg { font-size:clamp(1.2rem,1.8vw,1.5rem);margin-bottom:.5rem; }
        .ctitle-sm { font-size:1.05rem;margin-bottom:.5rem; }
        .cexcerpt { font-size:.875rem;color:#8a8680;line-height:1.7;flex:1; }
        .cmeta { display:flex;align-items:center;gap:.75rem;font-size:.75rem;color:#8a8680;margin-top:auto;padding-top:1rem; }
        .cmeta-sep { width:3px;height:3px;border-radius:50%;background:#e0dbd0; }
        .cread { margin-left:auto;font-size:.75rem;font-weight:700;color:#0c0c0b;display:flex;align-items:center;gap:.3rem; }
        .sect-lbl { font-size:.68rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#8a8680;margin-bottom:1.5rem;margin-top:0;display:flex;align-items:center;gap:1rem; }
        .sect-lbl::after { content:'';flex:1;height:1px;background:#e0dbd0; }
        .grid-3 { display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,320px));justify-content:start;gap:1.5rem;margin-bottom:4rem; }
        .grid-3--one { max-width:320px; }
        .card-reg { text-decoration:none;color:inherit;border:1.5px solid #e0dbd0;border-radius:14px;overflow:hidden;background:#f7f5f0;display:flex;flex-direction:column;transition:transform .25s,box-shadow .25s,border-color .25s; }
        .card-reg:hover { transform:translateY(-4px);box-shadow:0 16px 48px rgba(12,12,11,.1);border-color:#f5d98a; }
        .card-reg-img { height:180px;background:linear-gradient(135deg,#1c1a17,#2e2a22);display:flex;align-items:center;justify-content:center;font-size:3.5rem; }
        .card-reg-body { padding:1.4rem 1.5rem 1.5rem;flex:1;display:flex;flex-direction:column; }
        .card-reg-foot { display:flex;align-items:center;justify-content:space-between;padding-top:1rem;margin-top:auto;border-top:1px solid #e0dbd0;font-size:.75rem;color:#8a8680; }
        .no-posts { text-align:center;padding:8rem 2rem;color:#8a8680; }
        .no-posts p { font-size:1.1rem;margin-top:.5rem; }
        @media(max-width:1024px){ .hero{grid-template-columns:1fr;min-height:auto} .hero-right{display:none} .hero-left{padding:5rem 2rem 4rem} .grid-top{grid-template-columns:1fr} .card-big{grid-row:auto} .grid-3{grid-template-columns:repeat(2,1fr)} .grid-3--one{grid-template-columns:1fr;max-width:320px;margin-right:auto} }
        @media(max-width:768px){ .hero-h1{font-size:3rem} .main{padding:2.5rem 1.25rem 5rem} .filters-in{padding:0 1.25rem} .grid-3{grid-template-columns:1fr} .hero-stats{gap:1.5rem} }
        @media(max-width:480px){ .hero-stats{display:none} .ticker{display:none} }
      `}</style>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-eyebrow">Industry Insights</div>
          <h1 className="hero-h1">Market<br/><i>Intelligence</i><br/>for Buyers.</h1>
          <p className="hero-sub">Expert analysis on industrial machinery markets, auction strategies and emerging trends across Europe.</p>
          <div className="hero-stats">
            <div><div className="stat-num">2.4k+</div><div className="stat-lbl">Auctions yearly</div></div>
            <div><div className="stat-num">18</div><div className="stat-lbl">Countries</div></div>
            <div><div className="stat-num">{posts.length}</div><div className="stat-lbl">Articles</div></div>
          </div>
        </div>
        {featured && (
          <div className="hero-right">
            <div className="hero-feat-bg">
              {featured.mainImage ? (
                <img
                  src={urlFor(featured.mainImage).width(1400).height(900).url()}
                  alt={featured.mainImage.alt || featured.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                '🏭'
              )}
            </div>
            <div className="hero-feat-overlay" />
            <div className="hero-feat-body">
              <span className="hero-tag">Featured</span>
              <h2 className="hero-feat-title">{featured.title}</h2>
              <div className="hero-feat-meta">
                <span>{new Date(featured.publishedAt).toLocaleDateString(locale, {year:'numeric',month:'long',day:'numeric'})}</span>
                <Link href={`/${locale}/articles/${featured.slug}`} className="hero-read">Read →</Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* TICKER */}
      {tags.length > 0 && (
        <div className="ticker">
          <div className="ticker-track">
            {[...tags, ...tags].map((t, i) => (
              <span key={`${t._id}-${i}`} className="ticker-item">{t.title}</span>
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
      />

      <main className="main">
        {posts.length === 0 ? (
          <div className="no-posts">
            <h2 className="hero-h1" style={{color:'#0c0c0b',fontSize:'2rem'}}>{t('noArticles')}</h2>
          </div>
        ) : (
          <>
            {posts.length >= 3 ? (
              <>
                <div className="grid-top">
                  <Link href={`/${locale}/articles/${featured.slug}`} className="card-big">
                    <div className="card-big-img">
                      {featured.mainImage ? (
                        <img
                          src={urlFor(featured.mainImage).width(1200).height(300).url()}
                          alt={featured.mainImage.alt || featured.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      ) : (
                        '🏭'
                      )}
                    </div>
                    <div className="card-big-body">
                      <span className="ctag">Featured</span>
                      <h2 className="ctitle ctitle-lg">{featured.title}</h2>
                      <p className="cexcerpt" style={{marginBottom:'.75rem'}}>{featured.excerpt}</p>
                      <div className="cmeta">
                        <span>{new Date(featured.publishedAt).toLocaleDateString()}</span>
                        <span className="cread">Read <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></span>
                      </div>
                    </div>
                  </Link>
                  {posts.slice(1,3).map((post: any, i: number) => (
                    <Link key={post._id} href={`/${locale}/articles/${post.slug}`} className="card-sm" style={i===1?{borderTop:'1.5px solid #e0dbd0'}:{}}>
                      <div className="card-sm-img">
                        {post.mainImage ? (
                          <img
                            src={urlFor(post.mainImage).width(800).height(160).url()}
                            alt={post.mainImage.alt || post.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', display: 'block' }}
                          />
                        ) : (
                          '📰'
                        )}
                      </div>
                      <span className="ctag">Insight</span>
                      <h3 className="ctitle ctitle-sm">{post.title}</h3>
                      <p className="cexcerpt" style={{fontSize:'.82rem',marginTop:'.4rem'}}>{post.excerpt?.substring(0,100)}{post.excerpt?.length > 100 ? '...' : ''}</p>
                      <div className="cmeta" style={{marginTop:'.75rem',paddingTop:'.65rem',borderTop:'1px solid #e0dbd0'}}>
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        <span className="cread">Read →</span>
                      </div>
                    </Link>
                  ))}
                </div>

                {posts.length > 3 && (
                  <>
                    <div className="sect-lbl">
                      {tagSlug ? (tags.find((tag) => tag.slug === tagSlug)?.title ?? tagSlug) : t('allArticles')}
                    </div>
                    <div className={posts.slice(3).length === 1 ? 'grid-3 grid-3--one' : 'grid-3'}>
                      {posts.slice(3).map((post: any) => (
                        <Link key={post._id} href={`/${locale}/articles/${post.slug}`} className="card-reg">
                          <div className="card-reg-img">
                            {post.mainImage ? (
                              <img
                                src={urlFor(post.mainImage).width(800).height(180).url()}
                                alt={post.mainImage.alt || post.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                              />
                            ) : (
                              '📄'
                            )}
                          </div>
                          <div className="card-reg-body">
                            <span className="ctag">Insight</span>
                            <h3 className="ctitle ctitle-sm">{post.title}</h3>
                            <p className="cexcerpt" style={{fontSize:'.82rem',marginTop:'.5rem'}}>{post.excerpt?.substring(0,120)}{post.excerpt?.length > 120 ? '...' : ''}</p>
                            <div className="card-reg-foot">
                              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                              <span style={{fontWeight:700}}>Read →</span>
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
                <div className="sect-lbl">
                  {tagSlug ? (tags.find((tag) => tag.slug === tagSlug)?.title ?? tagSlug) : t('latestInsights')}
                </div>
                <div className="grid-3">
                  {posts.map((post: any) => (
                    <Link key={post._id} href={`/${locale}/articles/${post.slug}`} className="card-reg">
                      <div className="card-reg-img">
                        {post.mainImage ? (
                          <img
                            src={urlFor(post.mainImage).width(800).height(180).url()}
                            alt={post.mainImage.alt || post.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                        ) : (
                          '📄'
                        )}
                      </div>
                      <div className="card-reg-body">
                        <span className="ctag">Insight</span>
                        <h3 className="ctitle ctitle-sm">{post.title}</h3>
                        <p className="cexcerpt" style={{fontSize:'.82rem',marginTop:'.5rem'}}>{post.excerpt?.substring(0,120)}{post.excerpt?.length > 120 ? '...' : ''}</p>
                        <div className="card-reg-foot">
                          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                          <span style={{fontWeight:700}}>Read →</span>
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

