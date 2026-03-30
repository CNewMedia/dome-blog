import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { brandFont } from '../../lib/brand-font'
import { buildSiteSettingsFromChrome } from '../../lib/siteSettings'
import { client } from '../../sanity/client'
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
  const [siteChrome, siteSettings] = await Promise.all([
    client.fetch(getSiteChrome(locale), { locale }),
    client.fetch(getSiteSettings),
  ])

  const chromeSettings = buildSiteSettingsFromChrome(siteChrome, locale)
  const effectiveSettings = chromeSettings ?? siteSettings

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
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return activeLocales.map((locale) => ({ locale }))
}