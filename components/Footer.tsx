'use client'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'

export default function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()
  const daLocale = locale === 'nl-be' ? 'nl' : locale

  const navLinks = [
    { href: `https://dome-auctions.com/${daLocale}/auctions/`, label: t('allAuctions' as any) || 'All auctions' },
    { href: `https://dome-auctions.com/${daLocale}/about/`, label: t('about') },
    { href: `https://dome-auctions.com/${daLocale}/faq/`, label: t('faq') },
    { href: `https://dome-auctions.com/${daLocale}/contact/`, label: t('contact') },
  ]

  return (
    <footer style={{ background: '#111', color: '#fff', marginTop: '6rem' }}>
      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '4rem 2rem 2rem' }}>
        
        {/* Top row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
          
          {/* Logo + tagline */}
          <div>
            <Link href={`https://dome-auctions.com/${daLocale}/`}>
              <img
                src="https://cdn.dome-auctions.com/static/images/logo-black.svg"
                alt="Dome Auctions"
                style={{ height: '28px', width: 'auto', filter: 'brightness(0) invert(1)', marginBottom: '1rem', display: 'block' }}
                onError={(e) => {
                  const el = e.currentTarget
                  el.style.display = 'none'
                  const span = document.createElement('span')
                  span.textContent = 'Dome Auctions'
                  span.style.cssText = 'font-size:1.1rem;font-weight:800;color:#fff;display:block;margin-bottom:1rem;'
                  el.parentElement?.prepend(span)
                }}
              />
            </Link>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0 }}>
              Industrial machinery auctions across Belgium, Netherlands, Germany and Switzerland.
            </p>
          </div>

          {/* Nav links */}
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', marginBottom: '1rem' }}>
              Navigation
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {navLinks.map((item) => (
                <li key={item.href} style={{ marginBottom: '0.5rem' }}>
                  <Link href={item.href}
                    style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', marginBottom: '1rem' }}>
              {t('newsletter')}
            </div>
            <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)' }}>
              <input
                type="email"
                placeholder={t('newsletterPlaceholder')}
                style={{
                  flex: 1, background: 'transparent', border: 'none',
                  padding: '0.65rem 0.875rem', fontSize: '0.875rem',
                  color: '#fff', fontFamily: 'inherit', outline: 'none',
                }}
              />
              <button style={{
                background: '#f0c040', border: 'none',
                padding: '0 1.1rem', fontSize: '0.8rem',
                fontWeight: 700, color: '#111', cursor: 'pointer',
                fontFamily: 'inherit', borderRadius: '0 6px 6px 0',
              }}>
                {t('subscribe')}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ fontSize: '0.775rem', color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} Dome Auctions. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href={`https://dome-auctions.com/${daLocale}/terms-and-conditions/`}
              style={{ fontSize: '0.775rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>
              {t('terms')}
            </Link>
            <Link href={`https://dome-auctions.com/${daLocale}/privacy-policy/`}
              style={{ fontSize: '0.775rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>
              {t('privacy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
