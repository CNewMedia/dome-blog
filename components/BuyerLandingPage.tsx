import Image from 'next/image'
import '../styles/sector-landing.css'
import '../styles/buyer-landing.css'
import { urlFor } from '../sanity/client'
import { BRAND } from '../lib/constants'
import HubSpotForm from './HubSpotForm'
import HubSpotFormOverrides from './HubSpotFormOverrides'
import StepIcon from './buyer/StepIcon'

export type BuyerPageData = {
  _id: string
  slug: string
  locale?: string
  heroEyebrow?: string | null
  heroTitle: string
  heroSubtitle?: string | null
  heroBody?: string | null
  heroImage?: { asset?: { _ref?: string }; alt?: string } | null
  heroCtaLabel?: string | null
  heroCtaHref?: string | null
  stats?: { value: string; label: string }[] | null
  formEyebrow?: string | null
  formTitle?: string | null
  formSubtitle?: string | null
  hubspotFormId: string
  stepsSectionEyebrow?: string | null
  stepsSectionTitle?: string | null
  steps?: { icon?: string | null; title: string; description?: string | null }[] | null
  sectorCardsSectionEyebrow?: string | null
  sectorCardsSectionTitle?: string | null
  sectorCards?: {
    icon?: string | null
    title: string
    description?: string | null
    image?: { asset?: { _ref?: string }; alt?: string } | null
    href?: string | null
    buttonLabel?: string | null
    openInNewTab?: boolean | null
  }[] | null
  finalCtaTitle?: string | null
  finalCtaBody?: string | null
  finalCtaButtonLabel?: string | null
  finalCtaButtonHref?: string | null
}

export default function BuyerLandingPage({ data }: { data: BuyerPageData }) {
  const {
    heroEyebrow,
    heroTitle,
    heroSubtitle,
    heroBody,
    heroImage,
    heroCtaLabel,
    heroCtaHref,
    stats,
    formEyebrow,
    formTitle,
    formSubtitle,
    hubspotFormId,
    stepsSectionEyebrow,
    stepsSectionTitle,
    steps,
    sectorCardsSectionEyebrow,
    sectorCardsSectionTitle,
    sectorCards,
    finalCtaTitle,
    finalCtaBody,
    finalCtaButtonLabel,
    finalCtaButtonHref,
  } = data

  const safeStats = (stats ?? []).filter(
    (s): s is { value: string; label: string } =>
      Boolean(s && typeof s.value === 'string' && typeof s.label === 'string')
  )
  const safeSteps = (steps ?? []).filter(
    (s): s is { icon?: string | null; title: string; description?: string | null } =>
      Boolean(s && typeof s.title === 'string' && s.title.trim().length > 0)
  )
  const safeSectorCards = (sectorCards ?? []).filter(
    (c): c is NonNullable<BuyerPageData['sectorCards']>[number] =>
      Boolean(c && typeof c.title === 'string' && c.title.trim().length > 0)
  )

  const formAnchor = '#buyer-form'
  const heroHref = heroCtaHref?.trim() || formAnchor
  const showHeroCta = Boolean(heroCtaLabel?.trim())

  const showSteps = safeSteps.length > 0
  const showSectors = safeSectorCards.length > 0
  const showFinal =
    Boolean(finalCtaTitle?.trim()) ||
    Boolean(finalCtaBody?.trim()) ||
    Boolean(finalCtaButtonLabel?.trim())

  return (
    <div className="sector-lp buyer-lp">
      <section className="sector-hero">
        {heroImage?.asset && (
          <div className="sector-hero-bg">
            <Image
              src={urlFor(heroImage).width(1920).height(1080).url()}
              alt={heroImage.alt || heroTitle}
              fill
              priority
              sizes="100vw"
            />
          </div>
        )}
        <div className="sector-hero-overlay" aria-hidden />
        <div className="sector-hero-overlay-v" aria-hidden />
        <div className="sector-hero-in">
          <div className="buyer-hero-grid">
            <div className="buyer-hero-left">
              {heroEyebrow && <div className="sector-hero-eyebrow">{heroEyebrow}</div>}
              <h1 className="sector-hero-h1">{heroTitle}</h1>
              {heroSubtitle && <p className="sector-hero-sub">{heroSubtitle}</p>}
              {heroBody && <p className="buyer-hero-body">{heroBody}</p>}
              {safeStats.length ? (
                <div className="buyer-hero-stats">
                  {safeStats.map((s, i) => (
                    <div key={i} className="buyer-hero-stat">
                      <div className="buyer-hero-stat-value">{s.value}</div>
                      <div className="buyer-hero-stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>
              ) : null}
              {showHeroCta && (
                <a href={heroHref} className="sector-hero-cta">
                  {heroCtaLabel}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              )}
            </div>
            <div className="buyer-hero-right" aria-hidden>
              <div className="buyer-hero-right-bg" />
              <div className="buyer-hero-grid-lines" />
              <div className="buyer-hero-right-halo" />
              {safeSectorCards.length ? (
                <div className="buyer-sector-badges">
                  {safeSectorCards.slice(0, 5).map((card, i) => (
                    <div key={i} className="buyer-sector-badge">
                      <span className="buyer-sector-pill-dot">{card.icon?.trim() || '◆'}</span>
                      <div>
                        <div className="buyer-sector-badge-title">{card.title}</div>
                        {card.description && (
                          <div className="buyer-sector-badge-sub">
                            {card.description}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="sector-cta-wrap" id="buyer-form">
        <div className="sector-cta-grid buyer-form-grid">
          <div className="buyer-form-left">
            {formEyebrow && <div className="sector-cta-eyebrow">{formEyebrow}</div>}
            {formTitle && <h2 className="sector-cta-title">{formTitle}</h2>}
            <p className="sector-cta-sub buyer-form-sub">
              {formSubtitle ??
                'Laat uw gegevens achter. We sturen veilingmeldingen volgens uw voorkeuren. Geen verplichtingen.'}
            </p>
            <ul className="buyer-form-points">
              <li>Realtime veilingalerts op maat van uw sectorinteresses</li>
              <li>Enkel relevante updates, geen ruis</li>
              <li>Volledig via HubSpot, zodat opvolging centraal blijft</li>
            </ul>
          </div>
          <div className="sector-cta-form-box buyer-form-box">
            <div className="buyer-form-box-head">
              <div className="buyer-form-box-kicker">Registratie</div>
              <div className="buyer-form-box-title">Ontvang als eerste nieuwe veilingkansen</div>
            </div>
            <HubSpotFormOverrides />
            {hubspotFormId ? (
              <HubSpotForm formId={hubspotFormId} />
            ) : (
              <p style={{ color: BRAND.muted, fontSize: '0.95rem' }}>Configureer een HubSpot formulier-ID in Sanity.</p>
            )}
          </div>
        </div>
      </section>

      {showSteps && (
        <section className="sector-process-wrap">
          <div className="sector-process-in">
            {stepsSectionEyebrow && <div className="sector-eyebrow">{stepsSectionEyebrow}</div>}
            {stepsSectionTitle && <h2 className="sector-section-title">{stepsSectionTitle}</h2>}
            <div className="sector-process-grid buyer-process-grid">
              {safeSteps.map((item, i) => (
                <div
                  key={i}
                  className={`sector-process-step ${item.icon ? 'buyer-process-step--has-icon' : ''}`}
                >
                  <div className="buyer-step-index">{String(i + 1).padStart(2, '0')}</div>
                  {item.icon && (
                    <span className="buyer-step-icon" aria-hidden>
                      <StepIcon name={item.icon} />
                    </span>
                  )}
                  <div className="sector-process-step-title">{item.title}</div>
                  {item.description && <p className="sector-process-step-desc">{item.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {showSectors && (
        <section className="buyer-sectors-wrap">
          <div className="buyer-sectors-in">
            <div className="sector-eyebrow">{sectorCardsSectionEyebrow ?? 'Sectoren'}</div>
            <h2 className="sector-section-title">{sectorCardsSectionTitle ?? 'Kies uw interesses'}</h2>
            <div className="buyer-sectors-grid">
              {safeSectorCards.map((card, i) => (
                <article key={i} className="buyer-sector-card">
                  <div className="buyer-sector-card-number">{String(i + 1).padStart(2, '0')}</div>
                  <div className="buyer-sector-card-icon">{card.icon?.trim() || '◆'}</div>
                  <h3 className="buyer-sector-card-title">{card.title}</h3>
                  {card.description && <p className="buyer-sector-card-body">{card.description}</p>}
                  {card.href && (
                    <a
                      href={card.href}
                      className="buyer-sector-card-cta"
                      target={card.openInNewTab ? '_blank' : undefined}
                      rel={card.openInNewTab ? 'noopener noreferrer' : undefined}
                    >
                      {card.buttonLabel || 'Meer info'}
                    </a>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {showFinal && (
        <section className="buyer-final-wrap">
          <div className="buyer-final-bg" aria-hidden />
          <div className="buyer-final-in">
            <div className="buyer-final-kicker">Buyer registration</div>
            {finalCtaTitle && <h2 className="buyer-final-title">{finalCtaTitle}</h2>}
            {finalCtaBody && <p className="buyer-final-body">{finalCtaBody}</p>}
            {finalCtaButtonLabel?.trim() && (
              <a
                href={finalCtaButtonHref?.trim() || formAnchor}
                className="buyer-final-btn"
              >
                {finalCtaButtonLabel}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
