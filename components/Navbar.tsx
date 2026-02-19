'use client'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'nl-be', label: 'NL' },
  { code: 'fr-be', label: 'FR' },
  { code: 'de', label: 'DE' },
]

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: '70px', background: '#fff',
        borderBottom: '1px solid #e0e0e0',
        zIndex: 100, display: 'flex', alignItems: 'center',
      }}>
        <div style={{
          width: '100%', maxWidth: '1280px', margin: '0 auto',
          padding: '0 2rem', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Link href={`https://dome-auctions.com/${locale === 'nl-be' ? 'nl' : locale}/`}>
            <img
              src="https://cdn.dome-auctions.com/static/images/logo-black.svg"
              alt="Dome Auctions"
              style={{ height: '36px', width: 'auto' }}
            />
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link href={`https://dome-auctions.com/${locale === 'nl-be' ? 'nl' : locale}/auctions/`}
              style={{ fontSize: '0.875rem', fontWeight: 500, color: '#000', textDecoration: 'none' }}>
              {t('allAuctions')}
            </Link>
            <Link href={`/${locale}/blog`}
              style={{ fontSize: '0.875rem', fontWeight: 600, color: '#000', textDecoration: 'none', borderBottom: '2px solid #000', paddingBottom: '2px' }}>
              {t('blog')}
            </Link>

            {/* Taalwisselaar */}
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {locales.map((l) => (
                <Link key={l.code} href={`/${l.code}/blog`}
                  style={{
                    fontSize: '0.75rem', fontWeight: locale === l.code ? 700 : 400,
                    color: locale === l.code ? '#000' : '#999',
                    textDecoration: 'none', padding: '0.25rem 0.35rem',
                    borderBottom: locale === l.code ? '2px solid #000' : '2px solid transparent',
                  }}>
                  {l.label}
                </Link>
              ))}
            </div>

            <Link href={`https://dome-auctions.com/${locale === 'nl-be' ? 'nl' : locale}/login/`}
              style={{
                background: '#000', color: '#fff', fontSize: '0.8rem',
                fontWeight: 700, padding: '0.5rem 1.25rem', textDecoration: 'none',
              }}>
              {t('login')}
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}
