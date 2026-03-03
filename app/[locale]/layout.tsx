import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { client } from '../../sanity/client'
import { getSiteSettings } from '../../sanity/queries'

const locales = ['nl-be', 'fr-be', 'en', 'de']

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!locales.includes(locale)) notFound()
  const messages = await getMessages()
  const siteSettings = await client.fetch(getSiteSettings)

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet" />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'DM Sans', -apple-system, sans-serif; background: #f7f5f0; color: #0c0c0b; -webkit-font-smoothing: antialiased; }
          a { color: inherit; }
          img { max-width: 100%; }
        `}</style>
      </head>
      <body style={{ paddingTop: '60px' }}>
        <NextIntlClientProvider messages={messages}>
          <Navbar settings={siteSettings} />
          {children}
          <Footer settings={siteSettings} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}
