import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { VisualEditing } from 'next-sanity'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { brandFont } from '../../lib/brand-font'
import { buildSiteSettingsFromChrome } from '../../lib/siteSettings'
import { client } from '../../sanity/client'
import { SanityLive } from '../../sanity/live'
import { getSiteChrome, getSiteSettings } from '../../sanity/queries'
import { activeLocales, isAppLocale } from '../../i18n/locales'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!isAppLocale(locale)) notFound()

  const messages = await getMessages()
  const { isEnabled: isDraftMode } = await draftMode()
  const [siteChrome, siteSettings] = await Promise.all([
    client.fetch(getSiteChrome, { locale }),
    client.fetch(getSiteSettings),
  ])

  const chromeSettings = buildSiteSettingsFromChrome(siteChrome, locale)
  const effectiveSettings = chromeSettings ?? null
  const trackingRaw =
    (typeof siteSettings?.googleTagManagerId === 'string' && siteSettings.googleTagManagerId.trim()) || ''
  const trackingId =
    typeof trackingRaw === 'string' && /^(GTM-[A-Z0-9]+|G-[A-Z0-9]+)$/i.test(trackingRaw.trim())
      ? trackingRaw.trim().toUpperCase()
      : ''
  const isGtmContainer = trackingId.startsWith('GTM-')
  const isGa4Measurement = trackingId.startsWith('G-')

  const brandFontDisabled = process.env.NEXT_PUBLIC_BRAND_FONT_DISABLED === '1'

  const fontBodyStack = brandFontDisabled
    ? '-apple-system, BlinkMacSystemFont, system-ui, Segoe UI, sans-serif'
    : 'var(--font-brand), -apple-system, BlinkMacSystemFont, system-ui, Segoe UI, sans-serif'

  return (
    <html lang={locale} className={brandFontDisabled ? undefined : brandFont.variable}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>{`
          :root {
            --font-body: ${fontBodyStack};
          }
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: var(--font-body); background: #f7f5f0; color: #0c0c0b; -webkit-font-smoothing: antialiased; }
          a { color: inherit; }
          img { max-width: 100%; }
        `}</style>
      </head>
      <body style={{ paddingTop: '60px' }}>
        {isGtmContainer ? (
          <Script id="gtm-init" strategy="afterInteractive">{`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${trackingId}');
          `}</Script>
        ) : null}
        {isGtmContainer ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${trackingId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        ) : null}
        {isGa4Measurement ? (
          <Script
            id="ga4-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
            strategy="afterInteractive"
          />
        ) : null}
        {isGa4Measurement ? (
          <Script id="ga4-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${trackingId}');
          `}</Script>
        ) : null}
        <Script
          id="hs-script-loader"
          src="//js-eu1.hs-scripts.com/147410570.js"
          strategy="afterInteractive"
        />
        <NextIntlClientProvider messages={messages}>
          <Navbar settings={effectiveSettings} />
          {children}
          <Footer settings={effectiveSettings} />
        </NextIntlClientProvider>
        {isDraftMode ? <SanityLive /> : null}
        {isDraftMode ? <VisualEditing /> : null}
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return activeLocales.map((locale) => ({ locale }))
}