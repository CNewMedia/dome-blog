import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { client, urlFor } from '../sanity/client'
import { sanityFetch } from '../sanity/live'
import { getBuyerHreflangVariants, getBuyerPage, getBuyerSlugs } from '../sanity/queries'
import BuyerLandingPage from '../components/BuyerLandingPage'
import type { BuyerPageData } from '../components/BuyerLandingPage'
import { activeLocales, isAppLocale } from '../i18n/locales'
import { getBuyerBasePath } from './buyerPaths'

const DOMAIN = 'https://insights.dome-auctions.com'

const OG_LOCALE: Record<string, string> = {
  'nl-be': 'nl_BE',
  'fr-be': 'fr_BE',
  'en-be': 'en_GB',
  de: 'de_DE',
  pl: 'pl_PL',
  ro: 'ro_RO',
  hu: 'hu_HU',
  bg: 'bg_BG',
  sk: 'sk_SK',
  sl: 'sl_SI',
}

const HREFLANG_BY_LOCALE: Record<string, string> = {
  'nl-be': 'nl-BE',
  'fr-be': 'fr-BE',
  'en-be': 'en-GB',
  de: 'de',
  pl: 'pl',
  ro: 'ro',
  hu: 'hu',
  bg: 'bg',
  sk: 'sk',
  sl: 'sl',
}

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export function hasPublishableBuyerContent(
  data: BuyerPageData | null | undefined,
  options?: { preview?: boolean }
): data is BuyerPageData {
  if (!data) return false
  if (!data.heroTitle?.trim()) return false
  if (options?.preview) return true
  if (!data.hubspotFormId?.trim() || data.hubspotFormId === '__TODO_HUBSPOT_FORM_ID__') return false
  return true
}

function buildBuyerUrl(locale: string, slug: string): string {
  return `${DOMAIN}/${locale}/${getBuyerBasePath(locale)}/${slug}`
}

async function fetchBuyerPage(locale: string, slug: string) {
  const { data } = await sanityFetch({
    query: getBuyerPage,
    params: { slug: slug.toLowerCase(), locale },
  })
  return data
}

export function createBuyerPageRoute(expectedLocale: string) {
  async function Page({ params }: Props) {
    const { locale, slug } = await params
    if (!isAppLocale(locale)) notFound()
    if (locale !== expectedLocale) notFound()

    const { isEnabled } = await draftMode()
    const data = await fetchBuyerPage(locale, slug)

    if (!hasPublishableBuyerContent(data, { preview: isEnabled })) notFound()

    const slugStr = typeof data.slug === 'string' ? data.slug : slug
    const canonicalUrl = buildBuyerUrl(locale, slugStr)

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: data.seoTitle || data.heroTitle || 'Buyer registration | Dome Auctions',
              description: data.seoDescription || undefined,
              url: canonicalUrl,
            }),
          }}
        />
        <BuyerLandingPage data={data} />
      </>
    )
  }

  async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params
    if (!isAppLocale(locale) || locale !== expectedLocale) {
      return { title: 'Dome Auctions' }
    }

    const { data } = await sanityFetch({
      query: getBuyerPage,
      params: { slug: slug.toLowerCase(), locale },
      stega: false,
    })

    if (!hasPublishableBuyerContent(data)) {
      return { title: 'Dome Auctions' }
    }

    const title = data.seoTitle || data.heroTitle || `${slug} | Dome Auctions`
    const description = data.seoDescription ?? undefined
    const slugStr = typeof data.slug === 'string' ? data.slug : slug
    const url = buildBuyerUrl(locale, slugStr)

    const variants = (await client.fetch(getBuyerHreflangVariants, {
      locale,
      slug: slug.toLowerCase(),
    })) as { locale?: string; slug?: string }[]

    const languages: Record<string, string> = {}
    for (const variant of variants ?? []) {
      if (!variant.locale || !variant.slug || !isAppLocale(variant.locale)) continue
      const hreflang = HREFLANG_BY_LOCALE[variant.locale]
      if (!hreflang) continue
      languages[hreflang] = buildBuyerUrl(variant.locale, variant.slug)
    }

    const ogImageSource = data.ogImage ?? data.heroImage
    const ogImages = ogImageSource?.asset
      ? [
          {
            url: urlFor(ogImageSource).width(1200).height(630).url(),
            width: 1200,
            height: 630,
            alt: (ogImageSource as { alt?: string }).alt ?? title,
          },
        ]
      : undefined

    return {
      title,
      description,
      alternates: {
        canonical: url,
        languages: Object.keys(languages).length ? languages : undefined,
      },
      openGraph: {
        title,
        description,
        url,
        type: 'website',
        siteName: 'Dome Auctions',
        locale: OG_LOCALE[locale] ?? undefined,
        images: ogImages,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    }
  }

  async function generateStaticParams() {
    const pages = (await client.fetch(getBuyerSlugs)) as { slug?: string; locale?: string }[]

    const valid = pages.filter(
      (p) =>
        typeof p.slug === 'string' &&
        typeof p.locale === 'string' &&
        p.locale === expectedLocale &&
        activeLocales.includes(p.locale as (typeof activeLocales)[number])
    )

    return valid.map((p) => ({
      locale: p.locale as string,
      slug: p.slug as string,
    }))
  }

  return { Page, generateMetadata, generateStaticParams }
}
