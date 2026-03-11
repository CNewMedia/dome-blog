import type { Metadata } from 'next'
import Image from 'next/image'
import { client, urlFor } from '../../../../sanity/client'
import { getInsight, getRecentInsights, getInsights } from '../../../../sanity/queries'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PortableText from '../../../../components/PortableText'

const DOMAIN = 'https://insights.dome-auctions.com'

function formatDate(dateStr: string, locale: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString(
    locale === 'nl-be' ? 'nl-BE' : locale === 'fr-be' ? 'fr-BE' : locale,
    { day: 'numeric', month: 'long', year: 'numeric' }
  )
}

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata(
  { params }: { params: { locale: string; slug: string } }
): Promise<Metadata> {
  const { locale, slug } = params

  const post = await client
    .fetch(getInsight(locale), { slug, locale })
    .catch(() => null)

  if (!post) {
    const fallbackTitle = 'Insight | Dome Auctions'
    const url = `${DOMAIN}/${locale}/articles/${slug}`
    return {
      title: fallbackTitle,
      alternates: {
        canonical: url,
      },
    }
  }

  const rawDescription =
    (post.seoDescription as string | undefined) ||
    (post.excerpt as string | undefined) ||
    ''
  const description =
    typeof rawDescription === 'string'
      ? rawDescription.length > 160
        ? `${rawDescription.slice(0, 157)}...`
        : rawDescription
      : ''

  const title = `${post.title} | Dome Auctions Insights`
  const url = `${DOMAIN}/${locale}/articles/${post.slug || slug}`

  const ogImages = post.mainImage
    ? [
        {
          url: urlFor(post.mainImage).width(1200).height(630).url(),
          width: 1200,
          height: 630,
          alt: post.mainImage.alt || post.title,
        },
      ]
    : undefined

  return {
    title,
    description: description || undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: description || undefined,
      url,
      type: 'article',
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || undefined,
    },
  }
}

export default async function InsightPage({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations('insights')
  const [post, recentPosts] = await Promise.all([
    client.fetch(getInsight(locale), { slug, locale }),
    client.fetch(getRecentInsights(locale), { locale }),
  ])

  if (!post) notFound()

  let relatedPosts: any[] = []
  const primaryTagSlug = post.tags?.[0]?.slug as string | undefined

  if (primaryTagSlug) {
    try {
      const relatedByTag: any[] = await client.fetch(
        getInsights(locale, primaryTagSlug),
        { locale, tagSlug: primaryTagSlug }
      )
      relatedPosts = relatedByTag.filter((p) => p.slug !== slug).slice(0, 3)
    } catch {
      relatedPosts = recentPosts.filter((p: any) => p.slug !== slug).slice(0, 3)
    }
  } else {
    relatedPosts = recentPosts.filter((p: any) => p.slug !== slug).slice(0, 3)
  }

  return (
    <div style={{ fontStyle: 'normal' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description:
              (post.seoDescription as string | undefined) ||
              (post.excerpt as string | undefined) ||
              undefined,
            image: post.mainImage
              ? urlFor(post.mainImage).width(1200).height(630).url()
              : undefined,
            datePublished: post.publishedAt || undefined,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${DOMAIN}/${locale}/articles/${post.slug || slug}`,
            },
            publisher: {
              '@type': 'Organization',
              name: 'Dome Auctions',
              url: DOMAIN,
            },
          }),
        }}
      />
      {post.mainImage && (
        <div style={{ position: 'relative', width: '100%', height: '460px', overflow: 'hidden', background: '#f2f2f2' }}>
          <Image
            src={urlFor(post.mainImage).width(1200).height(460).url()}
            alt={post.mainImage.alt || post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 2rem 5rem', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '4rem', alignItems: 'start' }}>
        <main>
          <Link href={`/${locale}/insights`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#000', textDecoration: 'none', marginBottom: '2rem' }}>
            ← {t('backToInsights')}
          </Link>
          <header style={{ borderBottom: '2px solid #000', paddingBottom: '1.5rem', marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: 'clamp(1.75rem,3.5vw,2.75rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.025em', color: '#000', marginBottom: '1.25rem' }}>
              {post.title}
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem 1.25rem', fontSize: '0.825rem', color: '#555' }}>
              {post.publishedAt && <span>📅 {formatDate(post.publishedAt, locale)}</span>}
            </div>
          </header>
          <article style={{ fontSize: '1.05rem', lineHeight: 1.85, color: '#1a1a1a' }}>
            <PortableText value={post.body} />
          </article>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e0e0e0' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#555' }}>{t('share')}</span>
            <a href="https://www.linkedin.com/sharing/share-offsite/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', background: '#0077b5', color: '#fff', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>in</a>
            <a href="https://twitter.com/intent/tweet" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', background: '#000', color: '#fff', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>X</a>
          </div>
          {relatedPosts.length > 0 && (
            <section style={{ marginTop: '3rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
                {t('recentArticles')}
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '1.25rem' }}>
                {relatedPosts.map((p: any) => (
                  <li key={p._id}>
                    <Link
                      href={`/${locale}/articles/${p.slug}`}
                      style={{ display: 'block', textDecoration: 'none', color: '#000' }}
                    >
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.4, marginBottom: '0.25rem' }}>
                        {p.title}
                      </div>
                      {p.publishedAt && (
                        <div style={{ fontSize: '0.8rem', color: '#777' }}>
                          {formatDate(p.publishedAt, locale)}
                        </div>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
        <aside style={{ position: 'sticky', top: '90px' }}>
          {recentPosts.length > 0 && (
            <div style={{ border: '1px solid #000', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '2px solid #000', paddingBottom: '0.6rem', marginBottom: '1.25rem' }}>{t('recentArticles')}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {recentPosts.filter((p: any) => p.slug !== slug).slice(0, 4).map((p: any, i: number, arr: any[]) => (
                  <li key={p._id} style={{ paddingBottom: i < arr.length - 1 ? '0.75rem' : 0, marginBottom: i < arr.length - 1 ? '0.75rem' : 0, borderBottom: i < arr.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
                    <Link href={`/${locale}/articles/${p.slug}`} style={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.4, display: 'block', marginBottom: '0.2rem', color: '#000', textDecoration: 'none' }}>{p.title}</Link>
                    <span style={{ fontSize: '0.75rem', color: '#999' }}>{p.publishedAt ? formatDate(p.publishedAt, locale) : ''}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

