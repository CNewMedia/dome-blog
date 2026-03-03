import Image from 'next/image'
import { urlFor } from '../sanity/client'
import HubSpotForm from './HubSpotForm'
import PortableText from './PortableText'

const BRAND = {
  black: '#0f0f0f',
  gold: '#FFD600',
  goldAccent: '#c8a84b',
  white: '#ffffff',
  offWhite: '#f7f6f4',
  charcoal: '#1a1918',
  muted: '#6b6760',
  border: '#e0dbd0',
}

// Minimal SVG icons for USPs (speed, personal, experience, b2b, international)
const USP_ICONS: Record<string, React.ReactNode> = {
  speed: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  personal: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  experience: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
    </svg>
  ),
  b2b: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
    </svg>
  ),
  international: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
}

export type SectorPageData = {
  _id: string
  sector: string
  heroTitle?: string | null
  heroSubtitle?: string | null
  heroImage?: { asset?: { _ref?: string }; alt?: string } | null
  content?: unknown[] | null
  uspBlocks?: Array<{ icon?: string; title?: string; description?: string }> | null
  machines?: Array<{
    name?: string
    description?: string
    image?: { asset?: { _ref?: string }; alt?: string }
  }> | null
  successStory?: { quote?: string; company?: string; result?: string } | null
  ctaFormTitle?: string | null
  hubspotFormId?: string | null
}

function getUspIcon(iconKey?: string | null, index: number = 0): React.ReactNode {
  const key = (iconKey || '').toLowerCase().replace(/\s/g, '')
  if (USP_ICONS[key]) return USP_ICONS[key]
  const fallbacks = ['speed', 'personal', 'experience', 'b2b', 'international']
  return USP_ICONS[fallbacks[index % fallbacks.length]] ?? USP_ICONS.speed
}

export default function SectorLandingPage({ data }: { data: SectorPageData }) {
  const {
    heroTitle,
    heroSubtitle,
    heroImage,
    content,
    uspBlocks,
    machines,
    successStory,
    ctaFormTitle,
    hubspotFormId,
  } = data

  return (
    <div className="sector-lp" style={{ fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      <style>{`
        .sector-lp { background: ${BRAND.offWhite}; color: ${BRAND.black}; -webkit-font-smoothing: antialiased; }
        /* Hero — full-width, overlay */
        .sector-hero { position: relative; min-height: 82vh; display: flex; align-items: flex-end; justify-content: flex-start; overflow: hidden; background: ${BRAND.charcoal}; }
        .sector-hero-bg { position: absolute; inset: 0; }
        .sector-hero-bg img { width: 100%; height: 100%; object-fit: cover; transition: transform 12s ease-out; }
        .sector-hero:hover .sector-hero-bg img { transform: scale(1.04); }
        .sector-hero-overlay { position: absolute; inset: 0; background: linear-gradient( to right, ${BRAND.charcoal} 0%, ${BRAND.charcoal} 25%, rgba(26,25,24,0.92) 50%, rgba(26,25,24,0.4) 75%, transparent 100% ); }
        .sector-hero-overlay-v { position: absolute; inset: 0; background: linear-gradient( to top, ${BRAND.charcoal} 0%, transparent 50% ); }
        .sector-hero-in { position: relative; z-index: 2; max-width: 1400px; margin: 0 auto; width: 100%; padding: 6rem 2.5rem 5rem; }
        .sector-hero-eyebrow { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: ${BRAND.gold}; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1rem; }
        .sector-hero-eyebrow::after { content: ''; width: 48px; height: 1px; background: ${BRAND.gold}; opacity: 0.6; }
        .sector-hero-h1 { font-family: 'Instrument Serif', Georgia, serif; font-size: clamp(2.75rem, 5.5vw, 4.5rem); font-weight: 400; line-height: 1.05; letter-spacing: -0.02em; color: ${BRAND.white}; margin-bottom: 1.5rem; max-width: 16ch; }
        .sector-hero-sub { font-size: 1.05rem; color: rgba(247,246,244,0.7); line-height: 1.7; max-width: 42ch; margin-bottom: 2rem; }
        .sector-hero-cta { display: inline-flex; align-items: center; gap: 0.5rem; background: ${BRAND.gold}; color: ${BRAND.black}; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 0.75rem 1.5rem; border-radius: 999px; text-decoration: none; transition: background 0.2s, transform 0.2s; }
        .sector-hero-cta:hover { background: #e6c200; transform: translateY(-1px); }
        /* Content block */
        .sector-content-wrap { max-width: 1400px; margin: 0 auto; padding: 5rem 2.5rem; }
        .sector-content { font-size: 1.0625rem; line-height: 1.85; color: ${BRAND.black}; max-width: 720px; }
        .sector-content a { color: ${BRAND.goldAccent}; text-decoration: underline; text-underline-offset: 3px; transition: color 0.2s; }
        .sector-content a:hover { color: ${BRAND.gold}; }
        .sector-content-section { animation: sectorFadeIn 0.7s ease-out both; }
        @keyframes sectorFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        /* USP section */
        .sector-usp-wrap { background: ${BRAND.white}; border-top: 1px solid ${BRAND.border}; border-bottom: 1px solid ${BRAND.border}; }
        .sector-usp-in { max-width: 1400px; margin: 0 auto; padding: 5rem 2.5rem; }
        .sector-usp-eyebrow { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: ${BRAND.muted}; margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem; }
        .sector-usp-eyebrow::after { content: ''; flex: 1; max-width: 120px; height: 1px; background: ${BRAND.border}; }
        .sector-usp-title { font-family: 'Instrument Serif', Georgia, serif; font-size: clamp(1.9rem, 3.2vw, 2.5rem); font-weight: 400; color: ${BRAND.black}; margin-bottom: 3rem; }
        .sector-usp-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 2rem; }
        .sector-usp-card { padding: 2rem 1.75rem; background: ${BRAND.offWhite}; border: 1.5px solid ${BRAND.border}; border-radius: 12px; transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s; }
        .sector-usp-card:hover { border-color: ${BRAND.goldAccent}; box-shadow: 0 12px 40px rgba(15,15,15,0.08); transform: translateY(-2px); }
        .sector-usp-icon { width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; background: ${BRAND.black}; color: ${BRAND.gold}; border-radius: 12px; margin-bottom: 1.25rem; }
        .sector-usp-card-title { font-size: 0.8rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: ${BRAND.black}; margin-bottom: 0.5rem; }
        .sector-usp-card-desc { font-size: 0.9375rem; color: ${BRAND.muted}; line-height: 1.65; }
        /* Machines grid */
        .sector-machines-wrap { max-width: 1400px; margin: 0 auto; padding: 5rem 2.5rem; }
        .sector-machines-eyebrow { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: ${BRAND.muted}; margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem; }
        .sector-machines-eyebrow::after { content: ''; flex: 1; max-width: 120px; height: 1px; background: ${BRAND.border}; }
        .sector-machines-title { font-family: 'Instrument Serif', Georgia, serif; font-size: clamp(1.9rem, 3.2vw, 2.5rem); font-weight: 400; color: ${BRAND.black}; margin-bottom: 2.5rem; }
        .sector-machines-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.75rem; }
        .sector-machine-card { background: ${BRAND.white}; border: 1.5px solid ${BRAND.border}; border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s; }
        .sector-machine-card:hover { border-color: ${BRAND.goldAccent}; box-shadow: 0 20px 50px rgba(15,15,15,0.1); transform: translateY(-6px); }
        .sector-machine-img-wrap { position: relative; width: 100%; aspect-ratio: 16/10; background: ${BRAND.border}; overflow: hidden; }
        .sector-machine-img-wrap img { transition: transform 0.5s ease; }
        .sector-machine-card:hover .sector-machine-img-wrap img { transform: scale(1.06); }
        .sector-machine-body { padding: 1.5rem 1.75rem; flex: 1; display: flex; flex-direction: column; }
        .sector-machine-name { font-size: 1.0625rem; font-weight: 700; color: ${BRAND.black}; margin-bottom: 0.5rem; }
        .sector-machine-desc { font-size: 0.9375rem; color: ${BRAND.muted}; line-height: 1.6; }
        /* Success story */
        .sector-success { background: ${BRAND.charcoal}; color: ${BRAND.white}; padding: 6rem 2.5rem; position: relative; overflow: hidden; }
        .sector-success::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 80% 50% at 50% 100%, rgba(255,214,0,0.06) 0%, transparent 60%); pointer-events: none; }
        .sector-success-in { max-width: 820px; margin: 0 auto; text-align: center; position: relative; z-index: 1; }
        .sector-success-quote { font-family: 'Instrument Serif', Georgia, serif; font-size: clamp(1.5rem, 2.8vw, 2.25rem); line-height: 1.5; margin-bottom: 2rem; color: rgba(255,255,255,0.96); }
        .sector-success-company { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: ${BRAND.gold}; }
        .sector-success-result { font-size: 0.9375rem; color: rgba(255,255,255,0.65); margin-top: 0.75rem; }
        /* CTA + Form */
        .sector-cta-wrap { max-width: 1400px; margin: 0 auto; padding: 6rem 2.5rem; }
        .sector-cta-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 4rem; align-items: start; }
        .sector-cta-eyebrow { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: ${BRAND.muted}; margin-bottom: 1rem; }
        .sector-cta-title { font-family: 'Instrument Serif', Georgia, serif; font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 400; color: ${BRAND.black}; margin-bottom: 1rem; line-height: 1.2; }
        .sector-cta-sub { font-size: 1rem; color: ${BRAND.muted}; line-height: 1.7; margin-bottom: 0; }
        .sector-cta-form-box { background: ${BRAND.white}; border: 1.5px solid ${BRAND.border}; border-radius: 16px; padding: 2.5rem; box-shadow: 0 8px 32px rgba(15,15,15,0.04); }
        .hubspot-form-container { min-height: 220px; }
        @media (max-width: 1024px) { .sector-hero { min-height: 70vh; } .sector-cta-grid { grid-template-columns: 1fr; } }
        @media (max-width: 768px) { .sector-hero-in, .sector-content-wrap, .sector-usp-in, .sector-machines-wrap, .sector-cta-wrap { padding-left: 1.25rem; padding-right: 1.25rem; } .sector-hero { min-height: 65vh; } .sector-success { padding: 4rem 1.25rem; } .sector-machines-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* ——— Hero (full-width, overlay) ——— */}
      <section className="sector-hero">
        {heroImage?.asset && (
          <div className="sector-hero-bg">
            <Image
              src={urlFor(heroImage).width(1920).height(1080).url()}
              alt={heroImage.alt || heroTitle || ''}
              fill
              priority
              sizes="100vw"
            />
          </div>
        )}
        <div className="sector-hero-overlay" />
        <div className="sector-hero-overlay-v" aria-hidden />
        <div className="sector-hero-in">
          <div className="sector-hero-eyebrow">Sector</div>
          <h1 className="sector-hero-h1">{heroTitle || 'Industrial Auctions'}</h1>
          {heroSubtitle && <p className="sector-hero-sub">{heroSubtitle}</p>}
          <a href="#cta-form" className="sector-hero-cta">
            Vraag een gesprek aan
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </section>

      {/* ——— Content (Portable Text) ——— */}
      {content && Array.isArray(content) && content.length > 0 && (
        <section className="sector-content-wrap sector-content-section">
          <div className="sector-content">
            <PortableText value={content} />
          </div>
        </section>
      )}

      {/* ——— USP blocks ——— */}
      {uspBlocks && uspBlocks.length > 0 && (
        <section className="sector-usp-wrap">
          <div className="sector-usp-in">
            <div className="sector-usp-eyebrow">Waarom Dome Auctions</div>
            <h2 className="sector-usp-title">Bewezen aanpak. Geen verrassingen.</h2>
            <div className="sector-usp-grid">
              {uspBlocks.map((usp, i) => (
                <div key={i} className="sector-usp-card">
                  <div className="sector-usp-icon">{getUspIcon(usp.icon, i)}</div>
                  <div className="sector-usp-card-title">{usp.title}</div>
                  {usp.description && <p className="sector-usp-card-desc">{usp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ——— Machines grid ——— */}
      {machines && machines.length > 0 && (
        <section className="sector-machines-wrap">
          <div className="sector-machines-eyebrow">Machines in deze sector</div>
          <h2 className="sector-machines-title">Wat we veilen</h2>
          <div className="sector-machines-grid">
            {machines.map((machine, i) => (
              <article key={i} className="sector-machine-card">
                {machine.image?.asset ? (
                  <div className="sector-machine-img-wrap">
                    <Image
                      src={urlFor(machine.image).width(600).height(375).url()}
                      alt={machine.image.alt || machine.name || ''}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  </div>
                ) : (
                  <div className="sector-machine-img-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: BRAND.muted, fontSize: '2rem' }}>◆</div>
                )}
                <div className="sector-machine-body">
                  <div className="sector-machine-name">{machine.name}</div>
                  {machine.description && <p className="sector-machine-desc">{machine.description}</p>}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ——— Success story ——— */}
      {successStory && (successStory.quote || successStory.company) && (
        <section className="sector-success">
          <div className="sector-success-in">
            {successStory.quote && (
              <blockquote className="sector-success-quote">"{successStory.quote}"</blockquote>
            )}
            {successStory.company && <div className="sector-success-company">{successStory.company}</div>}
            {successStory.result && <div className="sector-success-result">{successStory.result}</div>}
          </div>
        </section>
      )}

      {/* ——— CTA + HubSpot form ——— */}
      <section className="sector-cta-wrap" id="cta-form">
        <div className="sector-cta-grid">
          <div>
            <div className="sector-cta-eyebrow">Contact</div>
            {ctaFormTitle && <h2 className="sector-cta-title">{ctaFormTitle}</h2>}
            <p className="sector-cta-sub">
              Laat uw gegevens achter en we nemen binnen één werkdag contact op. Geen verplichtingen.
            </p>
          </div>
          <div className="sector-cta-form-box">
            {hubspotFormId ? (
              <HubSpotForm formId={hubspotFormId} />
            ) : (
              <p style={{ color: BRAND.muted, fontSize: '0.95rem' }}>Configureer een HubSpot formulier in Sanity voor deze sector.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
