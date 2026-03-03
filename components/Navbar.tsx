'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { urlFor } from '../sanity/client'
import { getLocaleString, type SiteSettings } from '../lib/siteSettings'

const locales: Record<string, string> = { en: 'English', 'nl-be': 'Nederlands', 'fr-be': 'Français', de: 'Deutsch' }
const localeShort: Record<string, string> = { en: 'EN', 'nl-be': 'NL', 'fr-be': 'FR', de: 'DE' }

export default function Navbar({ settings }: { settings?: SiteSettings | null }) {
  const locale = useLocale()
  const da = locale === 'nl-be' ? 'nl' : locale
  const [langOpen, setLangOpen] = useState(false)
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null)
  const [fallbackCatOpen, setFallbackCatOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const menuRefs = useRef<(HTMLDivElement | null)[]>([])
  const fallbackCatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
      const target = e.target as Node
      if (openMenuIndex !== null && menuRefs.current[openMenuIndex] && !menuRefs.current[openMenuIndex]!.contains(target)) setOpenMenuIndex(null)
      if (fallbackCatRef.current && !fallbackCatRef.current.contains(target)) setFallbackCatOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [openMenuIndex])

  const companyName = settings?.bedrijfsnaam || 'DOME AUCTIONS'
  const logoAlt = settings?.logoAlt || companyName
  const menuItems = settings?.headerMenu ?? []

  return (
    <>
      <style>{`
        .nav { position:fixed;top:0;left:0;right:0;z-index:200;height:60px;background:rgba(247,245,240,0.92);backdrop-filter:blur(20px);border-bottom:1px solid #e0dbd0; }
        .nav-in { max-width:1400px;margin:0 auto;padding:0 2.5rem;height:100%;display:flex;align-items:center;gap:.25rem; }
        .nav-logo { font-size:.95rem;font-weight:800;letter-spacing:.08em;text-decoration:none;color:#0c0c0b;margin-right:2rem;white-space:nowrap;display:flex;align-items:center; }
        .nav-logo img { height:28px;width:auto; }
        .nav-a { font-size:.8rem;font-weight:500;color:#8a8680;text-decoration:none;padding:.4rem .7rem;border-radius:6px;transition:color .15s,background .15s;white-space:nowrap;background:none;border:none;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:.3rem; }
        .nav-a:hover { color:#0c0c0b;background:#efe9d8; }
        .nav-a.on { color:#0c0c0b;font-weight:600; }
        .nav-sp { flex:1; }
        .nav-search { display:flex;align-items:center;gap:.5rem;background:#efe9d8;border-radius:999px;padding:.45rem 1rem;cursor:pointer;min-width:160px;border:1px solid transparent;transition:border-color .15s;font-size:.8rem;color:#8a8680; }
        .nav-search:hover { border-color:#e0dbd0; }
        .nav-lang { font-size:.78rem;font-weight:600;color:#0c0c0b;background:none;border:1px solid #e0dbd0;padding:.35rem .7rem;border-radius:6px;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:.3rem;transition:border-color .15s; }
        .nav-lang:hover { border-color:#0c0c0b; }
        .nav-btn { background:#0c0c0b;color:#f7f5f0;font-size:.8rem;font-weight:600;padding:.5rem 1.25rem;border-radius:999px;text-decoration:none;transition:opacity .15s;white-space:nowrap; }
        .nav-btn:hover { opacity:.75; }
        .dropdown { position:absolute;top:calc(100% + 8px);background:#fff;border:1px solid #e0dbd0;border-radius:12px;padding:.5rem;box-shadow:0 8px 30px rgba(0,0,0,.1);z-index:300; }
        .drop-a { display:flex;align-items:center;justify-content:space-between;padding:.5rem .75rem;font-size:.875rem;color:#0c0c0b;text-decoration:none;border-radius:8px;font-weight:400;white-space:nowrap; }
        .drop-a:hover { background:#f7f5f0; }
        .drop-a.on { font-weight:600;background:#f7f5f0; }
        @media(max-width:768px) { .nav-a:not(.on):not(.cat-btn) { display:none; } .nav-search { display:none; } .nav-in { padding:0 1.25rem; } .nav-logo { margin-right:.5rem;font-size:.85rem; } .nav-logo img { height:24px; } }
      `}</style>
      <nav className="nav">
        <div className="nav-in">
          <Link href={`https://dome-auctions.com/${da}/`} className="nav-logo">
            {settings?.logo ? (
              <Image
                src={urlFor(settings.logo).width(160).height(40).fit('max').url()}
                alt={logoAlt}
                width={160}
                height={40}
                style={{ height: 28, width: 'auto' }}
              />
            ) : (
              companyName
            )}
          </Link>

          {menuItems.length > 0 ? (
            <>
              {menuItems.map((item, idx) => {
                const label = getLocaleString(item.label, locale)
                const hasSub = item.submenu && item.submenu.length > 0
                const isBlog = item.url === `/${locale}/blog` || item.url?.endsWith('/blog')
                if (hasSub) {
                  return (
                    <div key={idx} ref={(el) => { menuRefs.current[idx] = el }} style={{ position: 'relative' }}>
                      <button
                        type="button"
                        className="nav-a cat-btn"
                        onClick={() => setOpenMenuIndex(openMenuIndex === idx ? null : idx)}
                      >
                        {label}
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: openMenuIndex === idx ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}>
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                      {openMenuIndex === idx && (
                        <div className="dropdown" style={{ left: 0, minWidth: '200px' }}>
                          {item.submenu!.map((sub, si) => (
                            <Link
                              key={si}
                              href={sub.url || '#'}
                              className="drop-a"
                              onClick={() => setOpenMenuIndex(null)}
                            >
                              {getLocaleString(sub.label, locale)}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }
                return (
                  <Link
                    key={idx}
                    href={item.url || '#'}
                    className={`nav-a${isBlog ? ' on' : ''}`}
                  >
                    {label}
                  </Link>
                )
              })}
            </>
          ) : (
            <>
              <Link href={`https://dome-auctions.com/${da}/auctions/`} className="nav-a">
                {locale === 'nl-be' ? 'Alle veilingen' : locale === 'fr-be' ? 'Toutes les ventes' : locale === 'de' ? 'Alle Auktionen' : 'All auctions'}
              </Link>
              <div ref={fallbackCatRef} style={{ position: 'relative' }}>
                <button type="button" className="nav-a cat-btn" onClick={() => setFallbackCatOpen(!fallbackCatOpen)}>
                  {locale === 'nl-be' ? 'Categorieën' : locale === 'fr-be' ? 'Catégories' : locale === 'de' ? 'Kategorien' : 'Categories'}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: fallbackCatOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {fallbackCatOpen && (
                  <div className="dropdown" style={{ left: 0, minWidth: '200px' }}>
                    {[
                      [locale === 'nl-be' ? 'Metaalbewerking' : locale === 'fr-be' ? 'Métallurgie' : locale === 'de' ? 'Metallverarbeitung' : 'Metalworking', 'metalworking'],
                      [locale === 'nl-be' ? 'Houtbewerking' : locale === 'fr-be' ? 'Travail du bois' : locale === 'de' ? 'Holzbearbeitung' : 'Woodworking', 'woodworking'],
                      [locale === 'nl-be' ? 'Landbouw' : locale === 'fr-be' ? 'Agriculture' : locale === 'de' ? 'Landwirtschaft' : 'Agricultural', 'agricultural'],
                      [locale === 'nl-be' ? 'Bouw' : locale === 'fr-be' ? 'Construction' : locale === 'de' ? 'Bau' : 'Construction', 'construction'],
                      ['Transport', 'transport'],
                    ].map(([label, slug]) => (
                      <Link key={slug} href={`https://dome-auctions.com/${da}/categories/${slug}/`} className="drop-a" onClick={() => setFallbackCatOpen(false)}>
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link href={`/${locale}/blog`} className="nav-a on">
                Blog
              </Link>
            </>
          )}

          <div className="nav-sp" />

          <div className="nav-search" onClick={() => window.open(`https://dome-auctions.com/${da}/auctions/`, '_blank')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            {locale === 'nl-be' ? 'Zoek kavels...' : locale === 'fr-be' ? 'Rechercher...' : locale === 'de' ? 'Suchen...' : 'Search lots...'}
          </div>

          <div ref={langRef} style={{ position: 'relative' }}>
            <button type="button" className="nav-lang" onClick={() => setLangOpen(!langOpen)}>
              {localeShort[locale] || 'EN'}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: langOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {langOpen && (
              <div className="dropdown" style={{ right: 0, minWidth: '160px' }}>
                {Object.entries(locales).map(([code, label]) => (
                  <Link key={code} href={`/${code}/blog`} className={`drop-a${code === locale ? ' on' : ''}`} onClick={() => setLangOpen(false)}>
                    {label}
                    {code === locale && (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0c0c0b" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href={`https://dome-auctions.com/${da}/login/`} className="nav-btn">
            {locale === 'nl-be' ? 'Inloggen' : locale === 'fr-be' ? 'Se connecter' : locale === 'de' ? 'Einloggen' : 'Sign in'}
          </Link>
        </div>
      </nav>
    </>
  )
}
