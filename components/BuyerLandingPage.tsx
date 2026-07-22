'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import '../styles/sector-landing.css'
import '../styles/buyer-landing.css'
import { urlFor } from '../sanity/client'
import { BRAND } from '../lib/constants'
import HubSpotForm from './HubSpotForm'
import HubSpotFormOverrides from './HubSpotFormOverrides'
import StepIcon from './buyer/StepIcon'

type SanityImageLike =
  | { asset?: { _ref?: string; _id?: string; url?: string } | null; alt?: string }
  | null
  | undefined

function hasSanityImage(image: SanityImageLike): boolean {
  const asset = image?.asset
  if (!asset || typeof asset !== 'object') return false
  if (typeof asset._ref === 'string' && asset._ref.trim()) return true
  if (typeof asset._id === 'string' && asset._id.trim()) return true
  if (typeof asset.url === 'string' && asset.url.trim()) return true
  return false
}

function sanityImageUrl(image: SanityImageLike, width: number, height: number): string | null {
  if (!hasSanityImage(image)) return null
  try {
    return urlFor(image).width(width).height(height).fit('max').url()
  } catch {
    return null
  }
}

function BuyerBrandChip({ brand }: { brand: BuyerBrandItem }) {
  const brandHref = brand.href?.trim()
  const logoSrc = sanityImageUrl(brand.logo, 240, 80)
  const [logoFailed, setLogoFailed] = useState(false)
  const showLogo = Boolean(logoSrc && !logoFailed)
  const chipClass = `buyer-brand-chip${brandHref ? ' buyer-brand-chip--link' : ''}${showLogo ? ' buyer-brand-chip--logo' : ''}`
  const chipContent = showLogo ? (
    // eslint-disable-next-line @next/next/no-img-element -- Sanity SVG brand marks; Next/Image blocks SVG
    <img
      src={logoSrc!}
      alt={brand.logo?.alt || brand.name}
      className="buyer-brand-logo"
      loading="lazy"
      decoding="async"
      onError={() => setLogoFailed(true)}
    />
  ) : (
    brand.name
  )

  if (brandHref) {
    return (
      <a
        href={brandHref}
        className={chipClass}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={showLogo ? brand.name : undefined}
      >
        {chipContent}
      </a>
    )
  }

  return <span className={chipClass}>{chipContent}</span>
}

function BuyerCategoryChip({ category }: { category: BuyerCategoryItem }) {
  const catHref = category.href?.trim()
  const iconSrc = sanityImageUrl(category.icon, 64, 64)
  const [iconFailed, setIconFailed] = useState(false)
  const showIcon = Boolean(iconSrc && !iconFailed)
  const chipClass = `buyer-category-chip${catHref ? ' buyer-category-chip--link' : ''}${showIcon ? ' buyer-category-chip--has-icon' : ''}`
  const chipContent = (
    <>
      {showIcon && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={iconSrc!}
          alt={category.icon?.alt || category.label}
          className="buyer-category-icon"
          loading="lazy"
          decoding="async"
          onError={() => setIconFailed(true)}
        />
      )}
      <span>{category.label}</span>
    </>
  )

  if (catHref) {
    return (
      <a href={catHref} className={chipClass} target="_blank" rel="noopener noreferrer">
        {chipContent}
      </a>
    )
  }

  return <span className={chipClass}>{chipContent}</span>
}

function SectorCardVisual({
  card,
  variant,
}: {
  card: NonNullable<BuyerPageData['sectorCards']>[number]
  variant: 'badge' | 'tile'
}) {
  const imageSrc = sanityImageUrl(card.image, variant === 'badge' ? 96 : 640, variant === 'badge' ? 96 : 400)
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(imageSrc && !imageFailed)

  if (showImage) {
    return (
      <div className={`buyer-sector-card-image buyer-sector-card-image--${variant}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc!}
          alt={card.image?.alt || card.title}
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
        />
      </div>
    )
  }

  if (variant === 'badge') {
    return <span className="buyer-sector-pill-dot">{card.icon?.trim() || '◆'}</span>
  }

  return <div className="buyer-sector-card-icon">{card.icon?.trim() || '◆'}</div>
}

export type BuyerBrandItem = {
  name: string
  href?: string | null
  logo?: { asset?: { _ref?: string }; alt?: string } | null
}

export type BuyerCategoryItem = {
  label: string
  href?: string | null
  icon?: { asset?: { _ref?: string; _id?: string; url?: string }; alt?: string } | null
}

export type BuyerAuctionCardItem = {
  label: string
  subtitle?: string | null
  href?: string | null
  image?: { asset?: { _ref?: string; _id?: string; url?: string }; alt?: string } | null
}

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
  allAuctionsUrl?: string | null
  heroCtaSecondary?: string | null
  navRegisterCta?: string | null
  urgencyLine?: string | null
  auctionCards?: BuyerAuctionCardItem[] | null
  categoriesHeading?: string | null
  categories?: BuyerCategoryItem[] | null
  brandsHeading?: string | null
  brandNames?: string[] | null
  brands?: BuyerBrandItem[] | null
  newsletter?: { heading?: string | null; placeholder?: string | null; button?: string | null } | null
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
    image?: { asset?: { _ref?: string; _id?: string; url?: string }; alt?: string } | null
    href?: string | null
    buttonLabel?: string | null
    openInNewTab?: boolean | null
  }[] | null
  finalCtaTitle?: string | null
  finalCtaBody?: string | null
  finalCtaButtonLabel?: string | null
  finalCtaButtonHref?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
  ogImage?: { asset?: { _ref?: string }; alt?: string } | null
}

export default function BuyerLandingPage({ data }: { data: BuyerPageData }) {
  const t = useTranslations('buyer')
  const {
    heroEyebrow,
    heroTitle,
    heroSubtitle,
    heroBody,
    heroImage,
    heroCtaLabel,
    heroCtaHref,
    allAuctionsUrl,
    heroCtaSecondary,
    navRegisterCta,
    urgencyLine,
    auctionCards,
    categoriesHeading,
    categories,
    brandsHeading,
    brandNames,
    brands,
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
  const secondaryAuctionsUrl = allAuctionsUrl?.trim() || ''
  const showHeroCtaSecondary = Boolean(heroCtaSecondary?.trim() && secondaryAuctionsUrl)
  const safeAuctionCards = (auctionCards ?? []).filter(
    (c): c is BuyerAuctionCardItem =>
      Boolean(c && typeof c.label === 'string' && c.label.trim().length > 0)
  )
  const safeCategories = (categories ?? []).filter(
    (c): c is BuyerCategoryItem =>
      Boolean(c && typeof c.label === 'string' && c.label.trim().length > 0)
  )
  const safeBrands = (
    brands && brands.length > 0
      ? brands
      : (brandNames ?? []).map((name) => ({ name }))
  ).filter((b): b is BuyerBrandItem => Boolean(b?.name && b.name.trim().length > 0))
  const showHeavyEquipment =
    safeAuctionCards.length > 0 ||
    safeCategories.length > 0 ||
    safeBrands.length > 0 ||
    Boolean(categoriesHeading?.trim()) ||
    Boolean(brandsHeading?.trim())

  const showSteps = safeSteps.length > 0
  const showSectors = safeSectorCards.length > 0
  const showFinal =
    Boolean(finalCtaTitle?.trim()) ||
    Boolean(finalCtaBody?.trim()) ||
    Boolean(finalCtaButtonLabel?.trim())

  const hasHeroImage = hasSanityImage(heroImage)
  const heroRightShowsImage = hasHeroImage && safeSectorCards.length === 0
  const heroRightShowsSectors = safeSectorCards.length > 0
  const showHeroRight = heroRightShowsImage || heroRightShowsSectors
  const showHeroBackground = hasHeroImage && !heroRightShowsImage

  return (
    <div className="sector-lp buyer-lp">
      <section className={`sector-hero${showHeroRight ? ' sector-hero--split' : ''}`}>
        {showHeroBackground && heroImage && (
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
              {urgencyLine && <p className="buyer-urgency-line">{urgencyLine}</p>}
              {(showHeroCta || showHeroCtaSecondary) && (
                <div className="buyer-hero-cta-row">
                  {showHeroCta && (
                    <a href={heroHref} className="sector-hero-cta buyer-hero-cta">
                      {heroCtaLabel}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </a>
                  )}
                  {showHeroCtaSecondary && (
                    <a
                      href={secondaryAuctionsUrl}
                      className="buyer-hero-cta-secondary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {heroCtaSecondary}
                    </a>
                  )}
                </div>
              )}
              {navRegisterCta && (
                <p className="buyer-nav-register-hint">
                  <a href={heroHref}>{navRegisterCta}</a>
                </p>
              )}
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
            </div>
            {showHeroRight && (
              <div className="buyer-hero-right">
                {heroRightShowsImage && heroImage ? (
                  <div className="buyer-hero-right-image">
                    <Image
                      src={urlFor(heroImage).width(960).height(720).fit('crop').url()}
                      alt={heroImage.alt || heroTitle}
                      fill
                      priority
                      sizes="(max-width: 960px) 100vw, 45vw"
                      className="buyer-hero-right-image-el"
                    />
                  </div>
                ) : heroRightShowsSectors ? (
                  <>
                    <div className="buyer-hero-right-bg" aria-hidden />
                    <div className="buyer-hero-grid-lines" aria-hidden />
                    <div className="buyer-hero-right-halo" aria-hidden />
                    <div className="buyer-sector-badges">
                      {safeSectorCards.slice(0, 5).map((card, i) => (
                        <div key={i} className="buyer-sector-badge buyer-sector-badge--chip">
                          <SectorCardVisual card={card} variant="badge" />
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
                  </>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </section>

      {showHeavyEquipment && (
        <section className="buyer-heavy-wrap">
          <div className="buyer-heavy-in">
            {safeAuctionCards.length > 0 && (
              <div className="buyer-auction-cards">
                {safeAuctionCards.map((card, i) => {
                  const cardHref = card.href?.trim()
                  const imageSrc = sanityImageUrl(card.image, 640, 400)
                  const cardClass = `buyer-auction-card${cardHref ? ' buyer-auction-card--link' : ''}${imageSrc ? ' buyer-auction-card--has-image' : ''}`
                  const cardBody = (
                    <>
                      {imageSrc && (
                        <div className="buyer-auction-card-image">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imageSrc}
                            alt={card.image?.alt || card.label}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      )}
                      <div className="buyer-auction-card-body">
                        <h3 className="buyer-auction-card-label">{card.label}</h3>
                        {card.subtitle && <p className="buyer-auction-card-sub">{card.subtitle}</p>}
                      </div>
                    </>
                  )
                  return cardHref ? (
                    <a
                      key={i}
                      href={cardHref}
                      className={cardClass}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {cardBody}
                    </a>
                  ) : (
                    <article key={i} className={cardClass}>
                      {cardBody}
                    </article>
                  )
                })}
              </div>
            )}
            {safeCategories.length > 0 && (
              <div className="buyer-categories-block">
                {categoriesHeading && <h2 className="buyer-heavy-heading">{categoriesHeading}</h2>}
                <ul className="buyer-categories-list">
                  {safeCategories.map((cat, i) => (
                    <li key={i}>
                      <BuyerCategoryChip category={cat} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {safeBrands.length > 0 && (
              <div className="buyer-brands-block">
                {brandsHeading && <h2 className="buyer-heavy-heading">{brandsHeading}</h2>}
                <div className="buyer-brands-list">
                  {safeBrands.map((brand, i) => (
                    <BuyerBrandChip key={i} brand={brand} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="sector-cta-wrap" id="buyer-form">
        <div className="sector-cta-grid buyer-form-grid">
          <div className="buyer-form-left">
            {formEyebrow && <div className="sector-cta-eyebrow">{formEyebrow}</div>}
            {formTitle && <h2 className="sector-cta-title">{formTitle}</h2>}
            {(formSubtitle || t('formSubtitleFallback')) && (
              <p className="sector-cta-sub buyer-form-sub">
                {formSubtitle || t('formSubtitleFallback')}
              </p>
            )}
            <ul className="buyer-form-points">
              <li>{t('formPoint1')}</li>
              <li>{t('formPoint2')}</li>
              <li>{t('formPoint3')}</li>
            </ul>
          </div>
          <div className="sector-cta-form-box buyer-form-box">
            <div className="buyer-form-box-head">
              <div className="buyer-form-box-kicker">{t('formBoxKicker')}</div>
              <div className="buyer-form-box-title">{t('formBoxTitle')}</div>
            </div>
            <HubSpotFormOverrides />
            {hubspotFormId?.trim() && hubspotFormId !== '__TODO_HUBSPOT_FORM_ID__' ? (
              <HubSpotForm formId={hubspotFormId} />
            ) : (
              <p style={{ color: BRAND.muted, fontSize: '0.95rem' }}>{t('hubspotMissingId')}</p>
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
            <div className="sector-eyebrow">{sectorCardsSectionEyebrow ?? t('sectorEyebrowFallback')}</div>
            <h2 className="sector-section-title">{sectorCardsSectionTitle ?? t('sectorTitleFallback')}</h2>
            <div className="buyer-sectors-grid">
              {safeSectorCards.map((card, i) => (
                <article
                  key={i}
                  className={`buyer-sector-card${hasSanityImage(card.image) ? ' buyer-sector-card--has-image' : ''}`}
                >
                  <div className="buyer-sector-card-number">{String(i + 1).padStart(2, '0')}</div>
                  <SectorCardVisual card={card} variant="tile" />
                  <h3 className="buyer-sector-card-title">{card.title}</h3>
                  {card.description && <p className="buyer-sector-card-body">{card.description}</p>}
                  {card.href && (
                    <a
                      href={card.href}
                      className="buyer-sector-card-cta"
                      target={card.openInNewTab ? '_blank' : undefined}
                      rel={card.openInNewTab ? 'noopener noreferrer' : undefined}
                    >
                      {card.buttonLabel || t('moreInfo')}
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
            <div className="buyer-final-kicker">{t('finalCtaKicker')}</div>
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
