'use client'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'

export default function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()
  const daLocale = locale === 'nl-be' ? 'nl' : locale

  return (
    <footer style={{ background: '#000', color: '#fff', marginTop: '5rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3.5rem 2rem 2rem', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '4rem', alignItems: 'start' }}>

        <div>
          <Link href={`https://dome-auctions.com/${daLocale}/`}>
            <img src="https://cdn.dome-auctions.com/static/images/logo-white.svg" alt="Dome Auctions"
              style={{ height: '32px', width: 'auto', filter: 'brightness(0) invert(1)' }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
                const parent = (e.target as HTMLImageElement).parentElement
                if (parent) parent.innerHTML = '<span style="font-size:1.25rem;font-weight:800;color:#fff;">Dome Auctions</span>'
              }}
            />
          </Link>
        </div>

        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {[
              { href: `https://dome-auctions.com/${daLocale}/auctions/`, label: t('allAuctions' as any) || 'All auctions' },
              { href: `https://dome-auctions.com/${daLocale}/about/`, label: t('about') },
              { href: `https://dome-auctions.com/${daLocale}/faq/`, label: t('faq') },
              { href: `https://dome-auctions.com/${daLocale}/contact/`, label: t('contact') },
            ].map((item) => (
              <li key={item.href} style={{ marginBottom: '0.6rem' }}>
                <Link href={item.href} style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', textDecoration: 'none' }}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>
            {t('newsletter')}
          </div>
          <div style={{ display: 'flex', border: '1px solid rgba(255,255,255,0.2)' }}>
            <input type="email" placeholder={t('newsletterPlaceholder')}
              style={{ flex: 1, background: 'transparent', border: 'none', padding: '0.65rem 0.875rem', fontSize: '0.875rem', color: '#fff', fontFamily: 'inherit', outline: 'none' }} />
            <button style={{ background: '#f0c040', border: 'none', padding: '0 1rem', fontSize: '0.8rem', fontWeight: 700, color: '#000', cursor: 'pointer', fontFamily: 'inherit' }}>
              {t('subscribe')}
            </button>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', padding: '1.25rem 2rem', maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.775rem', color: 'rgba(255,255,255,0.3)' }}>© Dome Auctions</span>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link href={`https://dome-auctions.com/${daLocale}/terms-and-conditions/`} style={{ fontSize: '0.775rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>{t('terms')}</Link>
          <Link href={`https://dome-auctions.com/${daLocale}/privacy-policy/`} style={{ fontSize: '0.775rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>{t('privacy')}</Link>
        </div>
      </div>
    </footer>
  )
}
