'use client'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'

export default function Footer() {
  const locale = useLocale()
  const da = locale === 'nl-be' ? 'nl' : locale
  const [email, setEmail] = useState('')
  const t = (nl: string, fr: string, de: string, en: string) =>
    locale === 'nl-be' ? nl : locale === 'fr-be' ? fr : locale === 'de' ? de : en

  return (
    <>
      <style>{`
        .footer { background:#0c0c0b;color:#f7f5f0;margin-top:6rem; }
        .foot-top { max-width:1400px;margin:0 auto;padding:5rem 2.5rem 3rem;display:grid;grid-template-columns:1.5fr 1fr 1fr 1.5fr;gap:4rem; }
        .foot-logo { font-size:1.1rem;font-weight:800;letter-spacing:.08em;color:#f7f5f0;margin-bottom:1rem;font-family:inherit; }
        .foot-sub { font-size:.85rem;color:rgba(247,245,240,.3);line-height:1.7; }
        .foot-col-title { font-size:.65rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(247,245,240,.25);margin-bottom:1.25rem; }
        .foot-links a { display:block;font-size:.9rem;color:rgba(247,245,240,.55);text-decoration:none;margin-bottom:.6rem;transition:color .15s; }
        .foot-links a:hover { color:#f7f5f0; }
        .foot-nl-input { width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:.8rem 1rem;font-size:.875rem;color:#f7f5f0;font-family:inherit;outline:none;margin-bottom:.6rem;transition:border-color .15s; }
        .foot-nl-input:focus { border-color:rgba(255,255,255,.3); }
        .foot-nl-btn { width:100%;background:#e8b84b;border:none;border-radius:999px;padding:.8rem;font-size:.875rem;font-weight:700;color:#0c0c0b;cursor:pointer;font-family:inherit;transition:background .15s; }
        .foot-nl-btn:hover { background:#f5d98a; }
        .foot-bot { max-width:1400px;margin:0 auto;padding:1.5rem 2.5rem;border-top:1px solid rgba(255,255,255,.07);display:flex;justify-content:space-between;align-items:center;font-size:.78rem;color:rgba(247,245,240,.22); }
        .foot-bot-links { display:flex;gap:2rem; }
        .foot-bot-links a { color:rgba(247,245,240,.3);text-decoration:none;transition:color .15s; }
        .foot-bot-links a:hover { color:rgba(247,245,240,.7); }
        @media(max-width:1024px) { .foot-top { grid-template-columns:1fr 1fr;gap:2.5rem; } }
        @media(max-width:768px) { .foot-top { grid-template-columns:1fr;gap:2rem;padding:3rem 1.5rem 2rem; } .foot-bot { flex-direction:column;gap:1rem;text-align:center;padding:1.5rem; } .foot-bot-links { flex-wrap:wrap;justify-content:center; } }
      `}</style>
      <footer className="footer">
        <div className="foot-top">
          <div>
            <div className="foot-logo">DOME AUCTIONS</div>
            <p className="foot-sub">Industrial machinery auctions across Belgium, Netherlands, Germany and Switzerland. Fast, transparent, cost-effective.</p>
          </div>
          <div>
            <div className="foot-col-title">Platform</div>
            <div className="foot-links">
              <Link href={`https://dome-auctions.com/${da}/auctions/`}>{t('Alle veilingen','Toutes les ventes','Alle Auktionen','All auctions')}</Link>
              <Link href={`https://dome-auctions.com/${da}/categories/`}>{t('Categorieën','Catégories','Kategorien','Categories')}</Link>
              <Link href={`https://dome-auctions.com/${da}/how-it-works/`}>{t('Hoe het werkt','Comment ça marche','Wie es funktioniert','How it works')}</Link>
            </div>
          </div>
          <div>
            <div className="foot-col-title">{t('Bedrijf','Entreprise','Unternehmen','Company')}</div>
            <div className="foot-links">
              <Link href={`https://dome-auctions.com/${da}/about/`}>{t('Over ons','À propos','Über uns','About us')}</Link>
              <Link href={`/${locale}/blog`}>Blog</Link>
              <Link href={`https://dome-auctions.com/${da}/faq/`}>FAQ</Link>
              <Link href={`https://dome-auctions.com/${da}/contact/`}>Contact</Link>
            </div>
          </div>
          <div>
            <div className="foot-col-title">{t('Nieuwsbrief','Newsletter','Newsletter','Newsletter')}</div>
            <input className="foot-nl-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={t('Uw e-mailadres','Votre email','Ihre E-Mail','Your email address')} />
            <button className="foot-nl-btn">{t('Abonneren',"S'abonner",'Abonnieren','Subscribe')}</button>
          </div>
        </div>
        <div className="foot-bot">
          <span>© {new Date().getFullYear()} Dome Auctions. All rights reserved.</span>
          <div className="foot-bot-links">
            <Link href={`https://dome-auctions.com/${da}/terms-and-conditions/`}>{t('Algemene voorwaarden','Conditions générales','AGB','Terms and conditions')}</Link>
            <Link href={`https://dome-auctions.com/${da}/privacy-policy/`}>{t('Privacybeleid','Politique de confidentialité','Datenschutz','Privacy policy')}</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
