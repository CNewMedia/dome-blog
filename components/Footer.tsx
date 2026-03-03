'use client'

import { useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '../sanity/client'
import { getLocaleString, type SiteSettings } from '../lib/siteSettings'
import { useState } from 'react'

export default function Footer({ settings }: { settings?: SiteSettings | null }) {
  const locale = useLocale()
  const da = locale === 'nl-be' ? 'nl' : locale
  const [email, setEmail] = useState('')

  const companyName = settings?.bedrijfsnaam || 'DOME AUCTIONS'
  const logoAlt = settings?.logoAlt || companyName
  const tagline = getLocaleString(settings?.tagline, locale) || 'Industrial machinery auctions across Belgium, Netherlands, Germany and Switzerland. Fast, transparent, cost-effective.'
  const adres = settings?.adres
  const copyrightTekst = getLocaleString(settings?.copyrightTekst, locale) || `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`
  const nieuwsbriefTitel = getLocaleString(settings?.nieuwsbriefTitel, locale) || (locale === 'nl-be' ? 'Nieuwsbrief' : locale === 'fr-be' ? 'Newsletter' : locale === 'de' ? 'Newsletter' : 'Newsletter')
  const footerKolommen = settings?.footerKolommen ?? []
  const socialLinks = settings?.socialLinks ?? []

  const placeholder = locale === 'nl-be' ? 'Uw e-mailadres' : locale === 'fr-be' ? 'Votre email' : locale === 'de' ? 'Ihre E-Mail' : 'Your email address'
  const subscribeLabel = locale === 'nl-be' ? 'Abonneren' : locale === 'fr-be' ? "S'abonner" : locale === 'de' ? 'Abonnieren' : 'Subscribe'

  return (
    <>
      <style>{`
        .footer { background:#0f0f0f;color:#f7f5f0;margin-top:6rem; }
        .foot-top { max-width:1400px;margin:0 auto;padding:5rem 2.5rem 3rem;display:grid;gap:4rem; }
        .foot-logo { margin-bottom:1.25rem; }
        .foot-logo-text { font-size:1.1rem;font-weight:800;letter-spacing:.08em;color:#f7f5f0;font-family:inherit; }
        .foot-sub { font-size:.85rem;color:rgba(247,245,240,.35);line-height:1.7;margin-bottom:.65rem; }
        .foot-address { font-size:.8rem;color:rgba(247,245,240,.28);line-height:1.6;white-space:pre-line; }
        .foot-col-title { font-size:.65rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(247,245,240,.25);margin-bottom:1.25rem; }
        .foot-links a { display:block;font-size:.9rem;color:rgba(247,245,240,.55);text-decoration:none;margin-bottom:.6rem;transition:color .15s; }
        .foot-links a:hover { color:#f7f5f0; }
        .foot-social { display:flex;gap:.9rem;margin-top:1.25rem;flex-wrap:wrap; }
        .foot-social a { font-size:.78rem;color:rgba(247,245,240,.5);text-decoration:none;text-transform:uppercase;letter-spacing:.12em; }
        .foot-social a:hover { color:#f7f5f0; }
        .foot-nl-copy { font-size:.8rem;color:rgba(247,245,240,.4);line-height:1.6;margin-bottom:.75rem; }
        .foot-nl-input { width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:.8rem 1rem;font-size:.875rem;color:#f7f5f0;font-family:inherit;outline:none;margin-bottom:.6rem;transition:border-color .15s; }
        .foot-nl-input:focus { border-color:rgba(255,255,255,.3); }
        .foot-nl-btn { width:100%;background:#FFD600;border:none;border-radius:999px;padding:.8rem;font-size:.875rem;font-weight:700;color:#0f0f0f;cursor:pointer;font-family:inherit;transition:background .15s,transform .15s; }
        .foot-nl-btn:hover { background:#e6c200;transform:translateY(-1px); }
        .foot-bot { max-width:1400px;margin:0 auto;padding:1.5rem 2.5rem;border-top:1px solid rgba(255,255,255,.07);display:flex;justify-content:space-between;align-items:center;font-size:.78rem;color:rgba(247,245,240,.22); }
        .foot-bot-links { display:flex;gap:2rem;flex-wrap:wrap; }
        .foot-bot-links a { color:rgba(247,245,240,.3);text-decoration:none;transition:color .15s; }
        .foot-bot-links a:hover { color:rgba(247,245,240,.7); }
        @media(max-width:1024px) { .foot-top { grid-template-columns:1fr 1fr !important;gap:2.5rem; } }
        @media(max-width:768px) { .foot-top { grid-template-columns:1fr !important;gap:2rem;padding:3rem 1.5rem 2rem; } .foot-bot { flex-direction:column;gap:1rem;text-align:center;padding:1.5rem; } .foot-bot-links { justify-content:center; } }
      `}</style>
      <footer className="footer">
        <div
          className="foot-top"
          style={{
            gridTemplateColumns: `1.7fr ${footerKolommen.map(() => '1fr').join(' ')} 1.5fr`,
          }}
        >
          <div>
            <div className="foot-logo">
              {settings?.logo ? (
                <Image
                  src={urlFor(settings.logo).width(180).height(40).fit('max').url()}
                  alt={logoAlt}
                  width={180}
                  height={40}
                  style={{ height: 'auto', width: 'auto', maxWidth: '180px' }}
                />
              ) : (
                <div className="foot-logo-text">{companyName}</div>
              )}
            </div>
            <p className="foot-sub">{tagline}</p>
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
          {footerKolommen.map((kolom, ki) => (
            <div key={ki}>
              <div className="foot-col-title">{getLocaleString(kolom.titel, locale)}</div>
              <div className="foot-links">
                {kolom.links?.map((link, li) =>
                  link.url ? (
                    <Link key={li} href={link.url}>
                      {getLocaleString(link.label, locale) || link.url}
                    </Link>
                  ) : null
                )}
              </div>
            </div>
          ))}
          <div>
            <div className="foot-col-title">{nieuwsbriefTitel}</div>
            <input
              className="foot-nl-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
            />
            <button type="button" className="foot-nl-btn">
              {subscribeLabel}
            </button>
          </div>
        </div>
        <div className="foot-bot">
          <span>{copyrightTekst}</span>
        </div>
      </footer>
    </>
  )
}
