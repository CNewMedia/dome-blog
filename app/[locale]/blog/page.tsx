import { client } from '../../../sanity/client'
import { getPosts, getCategories } from '../../../sanity/queries'
import { urlFor } from '../../../sanity/client'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

function formatDate(dateStr: string, locale: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(locale === 'nl-be' ? 'nl-BE' : locale === 'fr-be' ? 'fr-BE' : locale, { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function BlogListingPage({ params: paramsPromise }: { params: Promise<{ locale: string }> }) {
  const { locale } = await paramsPromise
  const t = await getTranslations('blog')
  const [posts, categories] = await Promise.all([
    client.fetch(getPosts(locale)),
    client.fetch(getCategories),
  ])

  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <div>
      {/* Page header */}
      <div style={{ background: '#000', padding: '4rem 2rem 3.5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1, marginBottom: '0.75rem', margin: 0 }}>
            {t('title')}
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.75rem', marginBottom: 0 }}>
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Filter bar */}
      {categories.length > 0 && (
        <div style={{ borderBottom: '1px solid #e0e0e0', background: '#fff', position: 'sticky', top: '70px', zIndex: 10 }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', display: 'flex', overflowX: 'auto' }}>
            <Link href={`/${locale}/blog`} style={{ display: 'inline-flex', alignItems: 'center', padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 600, color: '#000', borderBottom: '2px solid #000', textDecoration: 'none', whiteSpace: 'nowrap' }}>
              All
            </Link>
            {categories.map((cat: any) => (
              <Link key={cat._id} href={`/${locale}/blog?cat=${cat.slug}`}
                style={{ display: 'inline-flex', alignItems: 'center', padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 500, color: '#555', borderBottom: '2px solid transparent', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                {cat.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', border: '1px solid #e0e0e0' }}>
            <p style={{ color: '#555' }}>{t('noArticles')}</p>
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featured && (
              <Link href={`/${locale}/blog/${featured.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'grid', gridTemplateColumns: '1fr 1fr', border: '2px solid #000', marginBottom: '3rem' }}>
                <div style={{ width: '100%', height: '380px', overflow: 'hidden', background: '#f2f2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {featured.mainImage ? (
                    <img src={urlFor(featured.mainImage).width(700).height(380).url()} alt={featured.mainImage.alt || featured.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '3rem', color: '#ccc' }}>📷</span>
                  )}
                </div>
                <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#555', marginBottom: '1rem' }}>
                    {t('featuredArticle')}
                  </div>
                  {featured.categories?.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
                      {featured.categories.map((c: any) => (
                        <span key={c.slug} style={{ background: '#000', color: '#fff', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', padding: '0.2rem 0.6rem' }}>
                          {c.title}
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{ fontSize: 'clamp(1.25rem,2.5vw,1.75rem)', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
                    {featured.title}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#555', lineHeight: 1.65, marginBottom: '1.5rem', flex: 1 }}>
                    {featured.excerpt}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: '#999', paddingTop: '1rem', borderTop: '1px solid #e0e0e0' }}>
                    {featured.publishedAt && <span>{formatDate(featured.publishedAt, locale)}</span>}
                    {featured.author && <span>{featured.author}</span>}
                  </div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#000', marginTop: '1.5rem' }}>
                    {t('readMore')} →
                  </span>
                </div>
              </Link>
            )}

            {/* Grid posts */}
            {rest.length > 0 && (
              <>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#555', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e0e0e0' }}>
                  {t('allArticles')}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5px', background: '#e0e0e0', border: '1.5px solid #e0e0e0' }}>
                  {rest.map((post: any) => (
                    <Link key={post._id} href={`/${locale}/blog/${post.slug}`}
                      style={{ background: '#fff', display: 'flex', flexDirection: 'column', textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ width: '100%', height: '200px', overflow: 'hidden', background: '#f2f2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {post.mainImage ? (
                          <img src={urlFor(post.mainImage).width(500).height(200).url()} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '2rem', color: '#ccc' }}>📷</span>
                        )}
                      </div>
                      <div style={{ padding: '1.25rem 1.5rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {post.categories?.length > 0 && (
                          <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '0.75rem' }}>
                            {post.categories.map((c: any) => (
                              <span key={c.slug} style={{ background: '#000', color: '#fff', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', padding: '0.15rem 0.5rem' }}>
                                {c.title}
                              </span>
                            ))}
                          </div>
                        )}
                        <div style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.35, letterSpacing: '-0.01em', marginBottom: '0.5rem' }}>
                          {post.title}
                        </div>
                        <div style={{ fontSize: '0.825rem', color: '#555', lineHeight: 1.6, marginBottom: '1rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as any}>
                          {post.excerpt}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.775rem', color: '#999', paddingTop: '0.875rem', borderTop: '1px solid #e0e0e0', marginTop: 'auto' }}>
                          <span>{post.publishedAt ? formatDate(post.publishedAt, locale) : ''}</span>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#000' }}>Read →</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
