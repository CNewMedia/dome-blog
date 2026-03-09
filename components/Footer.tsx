'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '../sanity/client'
import { getLocaleString, type SiteSettings } from '../lib/siteSettings'
import { useState } from 'react'

export default function Footer({ settings }: { settings?: SiteSettings | null }) {
  const locale = useLocale()
  const [email, setEmail] = useState('')

  const companyName = settings?.bedrijfsnaam || 'DOME AUCTIONS'
  const logoAlt = settings?.logoAlt || companyName
  const tagline = getLocaleString(settings?.tagline, locale)
  const adres = settings?.adres
  const copyrightTekst = getLocaleString(settings?.copyrightTekst, locale)
  const nieuwsbriefTitel = getLocaleString(settings?.nieuwsbriefTitel, locale)
  const newsletterPlaceholder = settings?.newsletterPlaceholder ?? ''
  const newsletterButtonLabel = settings?.newsletterButtonLabel ?? ''
  const footerPrimaryLinks = settings?.footerPrimaryLinks ?? []
  const footerLegalLinks = settings?.footerLegalLinks ?? []
  const socialLinks = settings?.socialLinks ?? []

  return (
    <>
      <style>{`
        .footer { background:#0f0f0f;color:#f7f5f0;margin-top:6rem; }
        .foot-inner { max-width:1400px;margin:0 auto;padding:3rem 1.5rem 2.5rem; }
        .foot-main { display:grid;gap:2.5rem; }
        .foot-brand { }
        .foot-logo { margin-bottom:1rem; }
        .foot-logo img { display:block;height:36px;width:auto; }
        .foot-logo-text { font-size:1.05rem;font-weight:800;letter-spacing:.08em;color:#f7f5f0;font-family:inherit; }
        .foot-tagline { font-size:.8125rem;color:rgba(247,245,240,.4);line-height:1.65;margin-top:.5rem; }
        .foot-address { font-size:.8125rem;color:rgba(247,245,240,.3);line-height:1.6;white-space:pre-line;margin-top:.75rem; }
        .foot-social { display:flex;gap:1rem;margin-top:1.25rem;flex-wrap:wrap; }
        .foot-social a { font-size:.75rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(247,245,240,.5);text-decoration:none;padding:.35rem 0;min-height:44px;display:inline-flex;align-items:center;transition:color .15s; }
        .foot-social a:hover { color:#f7f5f0; }
        .foot-newsletter { }
        .foot-nl-title { font-size:.6875rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(247,245,240,.35);margin-bottom:1rem; }
        .foot-nl-input { width:100%;max-width:320px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:1rem 1.125rem;font-size:1rem;color:#f7f5f0;font-family:inherit;outline:none;transition:border-color .15s;min-height:48px; }
        .foot-nl-input::placeholder { color:rgba(247,245,240,.4); }
        .foot-nl-input:focus { border-color:rgba(255,255,255,.35); }
        .foot-nl-btn { margin-top:.75rem;min-height:48px;padding:0 1.75rem;background:#e8b84b;border:none;border-radius:999px;font-size:.9375rem;font-weight:700;color:#0c0c0b;cursor:pointer;font-family:inherit;transition:background .15s,transform .15s; }
        .foot-nl-btn:hover { background:#d4a63e;transform:translateY(-1px); }
        .foot-links-wrap { }
        .foot-links { display:flex;flex-direction:column;gap:.25rem; }
        .foot-links a { display:inline-block;font-size:.9375rem;color:rgba(247,245,240,.6);text-decoration:none;padding:.5rem 0;min-height:44px;display:inline-flex;align-items:center;transition:color .15s; }
        .foot-links a:hover { color:#f7f5f0; }
        .foot-bot { max-width:1400px;margin:0 auto;padding:1.5rem 1.5rem 2rem;border-top:1px solid rgba(255,255,255,.08);display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1rem;font-size:.8125rem;color:rgba(247,245,240,.35); }
        .foot-bot-links { display:flex;flex-wrap:wrap;gap:1.5rem; }
        .foot-bot-links a { color:rgba(247,245,240,.4);text-decoration:none;padding:.4rem 0;min-height:44px;display:inline-flex;align-items:center;transition:color .15s; }
        .foot-bot-links a:hover { color:rgba(247,245,240,.85); }
        @media (min-width: 768px) {
          .foot-main { grid-template-columns:1fr 1fr; }
          .foot-newsletter { grid-column:1; }
          .foot-links-wrap { grid-column:2; }
        }
        @media (min-width: 1024px) {
          .foot-inner { padding:4.5rem 2.5rem 3rem; }
          .foot-main { grid-template-columns:1.25fr 1fr 1.25fr;gap:3rem; }
          .foot-newsletter { grid-column:2; }
          .foot-links-wrap { grid-column:3; }
          .foot-nl-input { max-width:100%; }
        }
      `}</style>
      <footer className="footer">
        <div className="foot-inner">
          <div className="foot-main">
            <div className="foot-brand">
              <div className="foot-logo">
                {settings?.logo ? (
                  <Image
                    src={urlFor(settings.logo).width(180).height(40).fit('max').url()}
                    alt={logoAlt}
                    width={180}
                    height={40}
                    style={{ height: 36, width: 'auto' }}
                  />
                ) : (
                  <div className="foot-logo-text">{companyName}</div>
                )}
              </div>
              {tagline && <p className="foot-tagline">{tagline}</p>}
              {adres && <p className="foot-address">{adres}</p>}
              {socialLinks.length > 0 && (
                <div className="foot-social">
                  {socialLinks.map((s, i) =>
                    s.url ? (
                      <a key={i} href={s.url} target="_blank" rel="noopener noreferrer">
                        {s.platform || 'Social'}
                      </a>
                    ) : null
                  )}
                </div>
              )}
            </div>

            <div className="foot-newsletter">
              {nieuwsbriefTitel && <div className="foot-nl-title">{nieuwsbriefTitel}</div>}
              <input
                className="foot-nl-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={newsletterPlaceholder}
                aria-label={newsletterPlaceholder || 'Email'}
              />
              {newsletterButtonLabel && (
                <button type="button" className="foot-nl-btn">
                  {newsletterButtonLabel}
                </button>
              )}
            </div>

            <div className="foot-links-wrap">
              <div className="foot-links">
                {footerPrimaryLinks.map((link, i) =>
                  link.url ? (
                    <Link key={i} href={link.url}>
                      {link.label || link.url}
                    </Link>
                  ) : null
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="foot-bot">
          <span>{copyrightTekst || (companyName ? `© ${new Date().getFullYear()} ${companyName}` : '')}</span>
          {footerLegalLinks.length > 0 && (
            <nav className="foot-bot-links" aria-label="Legal">
              {footerLegalLinks.map((link, i) =>
                link.url ? (
                  <a key={i} href={link.url}>
                    {link.label || link.url}
                  </a>
                ) : null
              )}
            </nav>
          )}
        </div>
      </footer>
    </>
  )
}
