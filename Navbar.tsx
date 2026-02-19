'use client'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

const localeLabels: Record<string, string> = {
  'en': 'English',
  'nl-be': 'Nederlands',
  'fr-be': 'Français',
  'de': 'Deutsch',
}

const localeShort: Record<string, string> = {
  'en': 'EN',
  'nl-be': 'NL',
  'fr-be': 'FR',
  'de': 'DE',
}

export default function Navbar() {
  const locale = useLocale()
  const daLocale = locale === 'nl-be' ? 'nl' : locale
  const [langOpen, setLangOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const catRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const categories = [
    { label: locale === 'nl-be' ? 'Metaalbewerking' : 'Metalworking', href: `https://dome-auctions.com/${daLocale}/categories/metalworking/` },
    { label: locale === 'nl-be' ? 'Houtbewerking' : 'Woodworking', href: `https://dome-auctions.com/${daLocale}/categories/woodworking/` },
    { label: locale === 'nl-be' ? 'Landbouw' : 'Agricultural', href: `https://dome-auctions.com/${daLocale}/categories/agricultural/` },
    { label: locale === 'nl-be' ? 'Bouw' : 'Construction', href: `https://dome-auctions.com/${daLocale}/categories/construction/` },
    { label: locale === 'nl-be' ? 'Transport' : 'Transport', href: `https://dome-auctions.com/${daLocale}/categories/transport/` },
  ]

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      height: '64px', background: '#fff',
      borderBottom: '1px solid #ebebeb',
      zIndex: 1000,
    }}>
      <div style={{
        maxWidth: '1380px', margin: '0 auto',
        padding: '0 1.5rem', height: '100%',
        display: 'flex', alignItems: 'center',
        gap: '0.5rem',
      }}>
        {/* Logo */}
        <Link href={`https://dome-auctions.com/${daLocale}/`} style={{ marginRight: '1rem', flexShrink: 0 }}>
          <img
            src="https://cdn.dome-auctions.com/static/images/logo-black.svg"
            alt="Dome Auctions"
            style={{ height: '30px', width: 'auto', display: 'block' }}
          />
        </Link>

        {/* All auctions */}
        <Link href={`https://dome-auctions.com/${daLocale}/auctions/`}
          style={{
            fontSize: '0.875rem', fontWeight: 500, color: '#111',
            textDecoration: 'none', padding: '0.45rem 0.75rem',
            borderRadius: '8px', whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f5')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
          {locale === 'nl-be' ? 'Alle veilingen' : locale === 'fr-be' ? 'Toutes les ventes' : locale === 'de' ? 'Alle Auktionen' : 'All auctions'}
        </Link>

        {/* Categories dropdown */}
        <div ref={catRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setCatOpen(!catOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              fontSize: '0.875rem', fontWeight: 500, color: '#111',
              background: catOpen ? '#f5f5f5' : 'transparent',
              border: 'none', padding: '0.45rem 0.75rem',
              borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}>
            {locale === 'nl-be' ? 'Categorieën' : locale === 'fr-be' ? 'Catégories' : locale === 'de' ? 'Kategorien' : 'Categories'}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: catOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {catOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: 0,
              background: '#fff', border: '1px solid #ebebeb',
              borderRadius: '12px', padding: '0.5rem',
              minWidth: '200px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
              zIndex: 200,
            }}>
              {categories.map((cat) => (
                <Link key={cat.href} href={cat.href}
                  style={{
                    display: 'block', padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem', color: '#111', textDecoration: 'none',
                    borderRadius: '8px',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f5')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  {cat.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Blog - active */}
        <Link href={`/${locale}/blog`}
          style={{
            fontSize: '0.875rem', fontWeight: 600, color: '#111',
            textDecoration: 'none', padding: '0.45rem 0.75rem',
            borderRadius: '8px', background: '#f0f0f0',
            whiteSpace: 'nowrap',
          }}>
          Blog
        </Link>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Zoekbalk - decoratief */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: '#f5f5f5', borderRadius: '999px',
          padding: '0.45rem 1rem', cursor: 'pointer',
          border: '1px solid transparent', minWidth: '180px',
        }}
          onClick={() => window.open(`https://dome-auctions.com/${daLocale}/auctions/`, '_blank')}
          onMouseEnter={e => (e.currentTarget.style.border = '1px solid #ddd')}
          onMouseLeave={e => (e.currentTarget.style.border = '1px solid transparent')}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <span style={{ fontSize: '0.8rem', color: '#888' }}>
            {locale === 'nl-be' ? 'Zoek kavels...' : locale === 'fr-be' ? 'Rechercher...' : locale === 'de' ? 'Suchen...' : 'Search lots...'}
          </span>
        </div>

        {/* Language dropdown */}
        <div ref={langRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              fontSize: '0.875rem', fontWeight: 500, color: '#111',
              background: langOpen ? '#f5f5f5' : 'transparent',
              border: '1px solid #ddd', padding: '0.45rem 0.75rem',
              borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit',
            }}>
            {localeShort[locale] || 'EN'}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: langOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {langOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              background: '#fff', border: '1px solid #ebebeb',
              borderRadius: '12px', padding: '0.5rem',
              minWidth: '160px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
              zIndex: 200,
            }}>
              {Object.entries(localeLabels).map(([code, label]) => (
                <Link key={code} href={`/${code}/blog`}
                  onClick={() => setLangOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem', fontSize: '0.875rem',
                    color: '#111', textDecoration: 'none', borderRadius: '8px',
                    background: code === locale ? '#f5f5f5' : 'transparent',
                    fontWeight: code === locale ? 600 : 400,
                  }}
                  onMouseEnter={e => { if (code !== locale) e.currentTarget.style.background = '#f9f9f9' }}
                  onMouseLeave={e => { if (code !== locale) e.currentTarget.style.background = 'transparent' }}>
                  {label}
                  {code === locale && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sign in */}
        <Link href={`https://dome-auctions.com/${daLocale}/login/`}
          style={{
            display: 'inline-flex', alignItems: 'center',
            fontSize: '0.875rem', fontWeight: 600, color: '#fff',
            textDecoration: 'none', padding: '0.5rem 1.1rem',
            borderRadius: '999px', background: '#111',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#333')}
          onMouseLeave={e => (e.currentTarget.style.background = '#111')}>
          {locale === 'nl-be' ? 'Inloggen' : locale === 'fr-be' ? 'Se connecter' : locale === 'de' ? 'Einloggen' : 'Sign in'}
        </Link>
      </div>
    </nav>
  )
}
