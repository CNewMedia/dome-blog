'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '../sanity/client'
import type { SiteSettings } from '../lib/siteSettings'
import { useState } from 'react'

export default function Footer({ settings }: { settings?: SiteSettings | null }) {
  const t = useTranslations('footer')
  const [email, setEmail] = useState('')

  const logo = settings?.footerLogo
  const logoAlt = settings?.logoAlt || 'Dome Auctions'

  const newsletterTitle = settings?.nieuwsbriefTitel ? t('newsletter') : ''
  const newsletterPlaceholder = t('newsletterPlaceholder')
  const newsletterButtonLabel = t('subscribe')

  const footerPrimaryLinks = settings?.footerPrimaryLinks ?? []
  const footerLegalLinks = settings?.footerLegalLinks ?? []

  return (
    <>
      <style>{`
        .footer { background:#0b0b0a;color:#f5f3ec;margin-top:6rem; }
        .foot-inner { max-width:1400px;margin:0 auto;padding:3rem 1.5rem 2.25rem; }
        .foot-main { display:grid;gap:2.25rem;align-items:flex-start; }

        .foot-logo { margin-bottom:1.75rem; }
        .foot-logo img { display:block;width:auto;max-height:88px; }

        .foot-newsletter { }
        .foot-nl-title { font-size:.75rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:#f5f3ec;margin-bottom:1rem; }
        .foot-nl-form { display:flex;flex-direction:column;gap:.75rem;max-width:360px; }
        .foot-nl-input { width:100%;background:rgba(245,243,236,.04);border:1px solid rgba(245,243,236,.24);border-radius:999px;padding:.9rem 1.1rem;font-size:.95rem;color:#f5f3ec;font-family:inherit;outline:none;transition:border-color .16s,background .16s; }
        .foot-nl-input::placeholder { color:rgba(245,243,236,.6); }
        .foot-nl-input:focus { border-color:#e8b84b;background:rgba(245,243,236,.06); }
        .foot-nl-btn { align-self:flex-start;min-height:46px;padding:0 1.6rem;background:#e8b84b;border:none;border-radius:999px;font-size:.9rem;font-weight:700;color:#15120c;cursor:pointer;font-family:inherit;letter-spacing:.08em;text-transform:uppercase;transition:background .16s,transform .16s,box-shadow .16s; }
        .foot-nl-btn:hover { background:#d4a63e;transform:translateY(-1px);box-shadow:0 10px 30px rgba(0,0,0,.35); }

        .foot-links-wrap { }
        .foot-links { display:flex;flex-direction:column;gap:.15rem; }
        .foot-links a { display:inline-flex;align-items:center;font-size:.95rem;color:rgba(245,243,236,.86);text-decoration:none;padding:.35rem 0;min-height:40px;transition:color .16s,transform .16s; }
        .foot-links a:hover { color:#ffffff;transform:translateX(1px); }

        .foot-bot { border-top:1px solid rgba(245,243,236,.18);margin-top:2.25rem;padding-top:1.4rem;display:flex;flex-wrap:wrap;justify-content:flex-end;gap:1.25rem;font-size:.8rem;color:rgba(245,243,236,.75); }
        .foot-bot-links { display:flex;flex-wrap:wrap;gap:1.5rem; }
        .foot-bot-links a { color:rgba(245,243,236,.75);text-decoration:none;min-height:36px;display:inline-flex;align-items:center;transition:color .16s; }
        .foot-bot-links a:hover { color:#ffffff; }

        @media (min-width: 768px) {
          .foot-main { grid-template-columns:1fr 1.2fr;column-gap:3rem;row-gap:2.5rem; }
          .foot-links-wrap { justify-self:flex-end; }
          .foot-logo img { max-height:112px; }
        }

        @media (min-width: 1024px) {
          .foot-inner { padding:4rem 2.5rem 2.5rem; }
          .foot-main { grid-template-columns:1.1fr 1.2fr 1.1fr;column-gap:3.5rem; }
          .foot-logo img { max-height:144px; }
        }
      `}</style>
      <footer className="footer">
        <div className="foot-inner">
          <div className="foot-main">
            {/* LEFT: logo only */}
            <div className="foot-logo">
              {logo && (
                <Image
                  src={urlFor(logo).width(480).height(160).fit('max').url()}
                  alt={logoAlt}
                  width={180}
                  height={40}
                />
              )}
            </div>

            {/* CENTER: newsletter */}
            <div className="foot-newsletter">
              {newsletterTitle && <div className="foot-nl-title">{newsletterTitle}</div>}
              <div className="foot-nl-form">
                <input
                  className="foot-nl-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={newsletterPlaceholder}
                  aria-label={newsletterPlaceholder}
                />
                <button type="button" className="foot-nl-btn">
                  {newsletterButtonLabel}
                </button>
              </div>
            </div>

            {/* RIGHT: primary links */}
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

          {/* BOTTOM RIGHT: legal links */}
          {footerLegalLinks.length > 0 && (
            <div className="foot-bot">
              <nav className="foot-bot-links" aria-label="Legal">
                {footerLegalLinks.map((link, i) =>
                  link.url ? (
                    <a key={i} href={link.url}>
                      {link.label || link.url}
                    </a>
                  ) : null
                )}
              </nav>
            </div>
          )}
        </div>
      </footer>
    </>
  )
}
