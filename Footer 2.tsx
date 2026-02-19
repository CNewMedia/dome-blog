'use client'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'

export default function Footer() {
  const locale = useLocale()
  const daLocale = locale === 'nl-be' ? 'nl' : locale
  const [email, setEmail] = useState('')

  const links = {
    col1: [
      { href: `https://dome-auctions.com/${daLocale}/about/`, label: locale === 'nl-be' ? 'Over ons' : locale === 'fr-be' ? 'À propos' : locale === 'de' ? 'Über uns' : 'About us' },
      { href: `https://dome-auctions.com/${daLocale}/faq/`, label: 'FAQ' },
      { href: `https://dome-auctions.com/${daLocale}/contact/`, label: locale === 'nl-be' ? 'Contact' : 'Contact' },
    ],
  }

  return (
    <footer style={{ background: '#111', color: '#fff', marginTop: '6rem' }}>
      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '5rem 2rem 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr', gap: '4rem', paddingBottom: '4rem' }}>

          {/* Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Link href={`https://dome-auctions.com/${daLocale}/`}>
              <img
                src="https://cdn.dome-auctions.com/static/images/logo-black.svg"
                alt="Dome Auctions"
                style={{ height: '60px', width: 'auto', filter: 'brightness(0) invert(1)', display: 'block' }}
              />
            </Link>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {links.col1.map((link) => (
              <Link key={link.href} href={link.href}
                style={{ fontSize: '1rem', color: '#fff', textDecoration: 'none', fontWeight: 400 }}
                onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Newsletter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff' }}>
              {locale === 'nl-be' ? 'Nieuwsbrief' : locale === 'fr-be' ? 'Newsletter' : locale === 'de' ? 'Newsletter' : 'Subscribe to Newsletter'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                style={{
                  background: '#222', border: '1px solid #333',
                  borderRadius: '8px', padding: '0.85rem 1rem',
                  fontSize: '0.95rem', color: '#fff',
                  fontFamily: 'inherit', outline: 'none', width: '100%',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#555')}
                onBlur={e => (e.currentTarget.style.borderColor = '#333')}
              />
              <button style={{
                background: '#f0c040', border: 'none',
                borderRadius: '999px', padding: '0.85rem 1.5rem',
                fontSize: '1rem', fontWeight: 700, color: '#111',
                cursor: 'pointer', fontFamily: 'inherit', width: '100%',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = '#e0b030')}
                onMouseLeave={e => (e.currentTarget.style.background = '#f0c040')}>
                {locale === 'nl-be' ? 'Abonneren' : locale === 'fr-be' ? "S'abonner" : locale === 'de' ? 'Abonnieren' : 'Subscribe'}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #2a2a2a', padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link href={`https://dome-auctions.com/${daLocale}/terms-and-conditions/`}
              style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
              {locale === 'nl-be' ? 'Algemene voorwaarden' : locale === 'fr-be' ? 'Conditions générales' : 'Terms and conditions'}
            </Link>
            <Link href={`https://dome-auctions.com/${daLocale}/privacy-policy/`}
              style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
              {locale === 'nl-be' ? 'Privacybeleid' : locale === 'fr-be' ? 'Politique de confidentialité' : 'Privacy policy'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
