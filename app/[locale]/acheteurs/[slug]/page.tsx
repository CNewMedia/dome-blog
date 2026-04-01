import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { client, previewClient, urlFor } from '../../../../sanity/client'
import { getBuyerPage, getBuyerSlugs } from '../../../../sanity/queries'
import BuyerLandingPage from '../../../../components/BuyerLandingPage'
import { activeLocales, isAppLocale } from '../../../../i18n/locales'
import { getBuyerBasePath } from '../../../../lib/buyerPaths'

const DOMAIN = 'https://insights.dome-auctions.com'

const OG_LOCALE: Record<string, string> = {
  'nl-be': 'nl_BE',
  'fr-be': 'fr_BE',
  'en-be': 'en_GB',
}

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export default async function BuyerRegistrationPageFr({ params }: Props) {
  const { locale, slug } = await params
  if (!isAppLocale(locale)) notFound()
  if (locale !== 'fr-be') notFound()

  const { isEnabled } = await draftMode()
  const preview = isEnabled

  const data = await (preview ? previewClient : client).fetch(getBuyerPage, {
    slug: slug.toLowerCase(),
    locale,
  })

  if (!data) notFound()

  const slugStr = typeof data.slug === 'string' ? data.slug : slug
  const canonicalUrl = `${DOMAIN}/${locale}/${getBuyerBasePath(locale)}/${slugStr}`

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isAppLocale(locale)) {
    return { title: 'Dome Auctions' }
  }
  if (locale !== 'fr-be') {
    return { title: 'Dome Auctions' }
  }

  const data = await client.fetch(getBuyerPage, {
    slug: slug.toLowerCase(),
    locale,
  })

  if (!data) {
    return { title: 'Dome Auctions' }
  }

  const title = data.seoTitle || data.heroTitle || `${slug} | Dome Auctions`
  const description = data.seoDescription ?? undefined
  const slugStr = typeof data.slug === 'string' ? data.slug : slug
  const url = `${DOMAIN}/${locale}/${getBuyerBasePath(locale)}/${slugStr}`
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
    alternates: { canonical: url },
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

export async function generateStaticParams() {
  const pages = (await client.fetch(getBuyerSlugs)) as { slug?: string; locale?: string }[]

  const valid = pages.filter(
    (p) =>
      typeof p.slug === 'string' &&
      typeof p.locale === 'string' &&
      p.locale === 'fr-be' &&
      activeLocales.includes(p.locale as (typeof activeLocales)[number])
  )

  return valid.map((p) => ({
    locale: p.locale as string,
    slug: p.slug as string,
  }))
}

