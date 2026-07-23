'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import '../styles/sector-landing.css'
import '../styles/buyer-landing.css'
import { urlFor } from '../sanity/client'
import { getMainSiteLoginUrl, getMainSiteSignupUrl } from '../lib/mainSitePaths'
import { hasSanityImage, sanityImageUrl, type SanityImageLike } from '../lib/buyerSanityImage'
import {
  resolveMainAuctionBlocks,
  resolveRelevantAuctions,
  resolveRelevantHeading,
  type BuyerAuctionBlocksRaw,
} from '../lib/resolveBuyerAuctionBlocks'
import StepIcon from './buyer/StepIcon'
import BuyerHeroCarousel, { type BuyerHeroSlide } from './buyer/BuyerHeroCarousel'
import BuyerCategoryIcon from './buyer/BuyerCategoryIcon'
import BuyerMainAuctionCard from './buyer/BuyerMainAuctionCard'
import BuyerRelevantAuctionCard from './buyer/BuyerRelevantAuctionCard'

function BuyerBrandChip({ brand }: { brand: BuyerBrandItem }) {
  const brandHref = brand.href?.trim()
  const logoSrc = sanityImageUrl(brand.logo, 240)
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
      onLoad={(event) => {
        const img = event.currentTarget
        if (!img.naturalWidth || !img.naturalHeight) setLogoFailed(true)
      }}
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

function BuyerCategoryChip({ category, index }: { category: BuyerCategoryItem; index: number }) {
  const catHref = category.href?.trim()
  const iconSrc = sanityImageUrl(category.icon, 112)
  const [iconFailed, setIconFailed] = useState(false)
  const showUploadedIcon = Boolean(iconSrc && !iconFailed)
  const chipClass = `buyer-category-chip${catHref ? ' buyer-category-chip--link' : ''}`
  const chipContent = (
    <>
      {showUploadedIcon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={iconSrc!}
          alt={category.icon?.alt || category.label}
          className="buyer-category-icon buyer-category-icon--uploaded"
          loading="lazy"
          decoding="async"
          onError={() => setIconFailed(true)}
        />
      ) : (
        <BuyerCategoryIcon label={category.label} index={index} className="buyer-category-icon" />
      )}
      <span className="buyer-category-label">{category.label}</span>
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
  const imageSrc = sanityImageUrl(card.image, variant === 'badge' ? 96 : 640)
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

function resolveHeroSlides(
  heroImages: SanityImageLike[] | null | undefined,
  heroImage: SanityImageLike,
  fallbackAlt: string
): BuyerHeroSlide[] {
  const fromArray = (heroImages ?? []).filter(hasSanityImage)
  const sources = fromArray.length > 0 ? fromArray : hasSanityImage(heroImage) ? [heroImage] : []

  return sources
    .map((image) => {
      const src =
        sanityImageUrl(image, 1400) ||
        (() => {
          try {
            return urlFor(image).width(1400).url()
          } catch {
            return null
          }
        })()
      if (!src) return null
      return { src, alt: image?.alt || fallbackAlt }
    })
    .filter((slide): slide is BuyerHeroSlide => Boolean(slide))
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

export type BuyerAuctionBlockItem = {
  title?: string | null
  subtitle?: string | null
  href?: string | null
  frameStyle?: 'none' | 'black' | 'yellow' | string | null
  image?: { asset?: { _ref?: string; _id?: string; url?: string }; alt?: string } | null
}

export type BuyerAuctionBlocks = BuyerAuctionBlocksRaw

export type BuyerPageData = {
  _id: string
  slug: string
  locale?: string
  heroEyebrow?: string | null
  heroTitle: string
  heroSubtitle?: string | null
  heroBody?: string | null
  heroImages?: SanityImageLike[] | null
  heroImage?: SanityImageLike
  heroLinkHref?: string | null
  heroCtaLabel?: string | null
  heroCtaHref?: string | null
  allAuctionsUrl?: string | null
  heroCtaSecondary?: string | null
  navRegisterCta?: string | null
  urgencyLine?: string | null
  auctionBlocks?: BuyerAuctionBlocks | null
  /** Legacy free cards — used as relevant-auctions fallback when auctionBlocks.relevant is empty. */
  auctionCards?: {
    label: string
    subtitle?: string | null
    href?: string | null
    image?: { asset?: { _ref?: string; _id?: string; url?: string }; alt?: string } | null
  }[] | null
  categoriesHeading?: string | null
  categories?: BuyerCategoryItem[] | null
  brandsHeading?: string | null
  brandNames?: string[] | null
  brands?: BuyerBrandItem[] | null
  stats?: { value: string; label: string }[] | null
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
    locale,
    heroEyebrow,
    heroTitle,
    heroSubtitle,
    heroBody,
    heroImages,
    heroImage,
    heroLinkHref,
    heroCtaLabel,
    heroCtaHref,
    allAuctionsUrl,
    heroCtaSecondary,
    urgencyLine,
    auctionBlocks,
    auctionCards,
    categoriesHeading,
    categories,
    brandsHeading,
    brandNames,
    brands,
    stats,
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
  const safeCategories = (categories ?? []).filter(
    (c): c is BuyerCategoryItem =>
      Boolean(c && typeof c.label === 'string' && c.label.trim().length > 0)
  )
  const safeBrands = (
    brands && brands.length > 0
      ? brands
      : (brandNames ?? []).map((name) => ({ name }))
  ).filter((b): b is BuyerBrandItem => Boolean(b?.name && b.name.trim().length > 0))
  const mainAuctionBlocks = resolveMainAuctionBlocks(auctionBlocks)
  const relevantFromBlocks = resolveRelevantAuctions(auctionBlocks)
  const relevantFromCards = (auctionCards ?? [])
    .filter((c) => Boolean(c?.label?.trim()))
    .slice(0, 2)
    .map((c) => ({
      title: c.label,
      href: c.href,
      image: c.image,
    }))
  const relevantAuctions =
    relevantFromBlocks.length > 0 ? relevantFromBlocks : relevantFromCards
  const relevantHeading = resolveRelevantHeading(auctionBlocks, t('blocks.relevantHeading'))
  const showMainAuctions = mainAuctionBlocks.length > 0
  const showRelevantAuctions = relevantAuctions.length > 0
  const showAuctionSection = showMainAuctions || showRelevantAuctions
  const showHeavyEquipment =
    showAuctionSection || safeCategories.length > 0 || safeBrands.length > 0

  const showSteps = safeSteps.length > 0
  const showSectors = safeSectorCards.length > 0
  const showFinal =
    Boolean(finalCtaTitle?.trim()) ||
    Boolean(finalCtaBody?.trim()) ||
    Boolean(finalCtaButtonLabel?.trim())

  const heroSlides = resolveHeroSlides(heroImages, heroImage, heroTitle)
  const hasHeroSlides = heroSlides.length > 0
  const heroLinkUrl =
    heroLinkHref?.trim() || heroCtaHref?.trim() || allAuctionsUrl?.trim() || ''
  const showHeroLink = Boolean(heroLinkUrl)
  const heroRightShowsImage = hasHeroSlides && safeSectorCards.length === 0
  const heroRightShowsSectors = safeSectorCards.length > 0
  const showHeroRight = heroRightShowsImage || heroRightShowsSectors
  const showHeroBackground = hasHeroSlides && !heroRightShowsImage
  const pageLocale = locale || 'en-be'
  const signupUrl = getMainSiteSignupUrl(pageLocale)
  const loginUrl = getMainSiteLoginUrl(pageLocale)

  const heroLeft = (
    <div className="buyer-hero-left">
      {heroEyebrow && <div className="sector-hero-eyebrow buyer-hero-eyebrow">{heroEyebrow}</div>}
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
  )

  const heroRightPanel =
    showHeroRight &&
    (heroRightShowsImage ? (
      <BuyerHeroCarousel
        slides={heroSlides}
        prevLabel={t('carouselPrev')}
        nextLabel={t('carouselNext')}
      />
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
                {card.description && <div className="buyer-sector-badge-sub">{card.description}</div>}
              </div>
            </div>
          ))}
        </div>
      </>
    ) : null)

  return (
    <div className="sector-lp buyer-lp">
      <section
        className={`sector-hero${showHeroRight ? ' sector-hero--split' : ''}${heroRightShowsImage ? ' buyer-hero--has-image-panel' : ''}${showHeroLink ? ' buyer-hero--linked' : ''}`}
      >
        {showHeroBackground && heroSlides[0] && (
          <div className="sector-hero-bg">
            <Image
              src={heroSlides[0].src}
              alt={heroSlides[0].alt}
              fill
              priority
              sizes="100vw"
            />
          </div>
        )}
        <div className="sector-hero-overlay" aria-hidden />
        <div className="sector-hero-overlay-v" aria-hidden />
        <div className="sector-hero-in">
          {showHeroRight ? heroLeft : <div className="buyer-hero-grid">{heroLeft}</div>}
        </div>
        {heroRightPanel && <div className="buyer-hero-right">{heroRightPanel}</div>}
        {showHeroLink && (
          <a
            href={heroLinkUrl}
            className="buyer-hero-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={heroTitle}
          />
        )}
      </section>

      {showHeavyEquipment && (
        <section className="buyer-heavy-wrap">
          {safeCategories.length > 0 && (
            <div className="buyer-categories-band">
              <div className="buyer-heavy-in">
                <div className="buyer-categories-block">
                  {categoriesHeading && <h2 className="buyer-heavy-heading">{categoriesHeading}</h2>}
                  <ul className="buyer-categories-list">
                    {safeCategories.map((cat, i) => (
                      <li key={i}>
                        <BuyerCategoryChip category={cat} index={i} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          {showAuctionSection && (
            <>
              {showMainAuctions && (
                <div className="buyer-auction-band">
                  <div className="buyer-heavy-in">
                    <div className="buyer-main-auction-grid">
                      {mainAuctionBlocks.map(({ key, block }) => (
                        <BuyerMainAuctionCard
                          key={key}
                          blockKey={key}
                          block={block}
                          statusLabel={t(`blocks.status.${key}`)}
                          viewLabel={t('blocks.view')}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {showRelevantAuctions && (
                <div className="buyer-heavy-in--page">
                  <div className="buyer-heavy-in">
                    <div className="buyer-relevant-auctions">
                      <h2 className="buyer-heavy-heading">{relevantHeading}</h2>
                      <div className="buyer-relevant-auction-grid">
                        {relevantAuctions.map((item, i) => (
                          <BuyerRelevantAuctionCard key={i} item={item} viewLabel={t('blocks.view')} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {safeBrands.length > 0 && (
            <div className="buyer-brands-band">
              <div className="buyer-heavy-in">
                <div className="buyer-brands-block">
                  {brandsHeading && <h2 className="buyer-heavy-heading">{brandsHeading}</h2>}
                  <div className="buyer-brands-list">
                    {safeBrands.map((brand, i) => (
                      <BuyerBrandChip key={i} brand={brand} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      <section className="sector-cta-wrap buyer-auth-section" id="buyer-form">
        <div className="buyer-auth-cta-box">
          <div className="buyer-auth-cta-row">
            <a
              href={signupUrl}
              className="buyer-auth-cta buyer-auth-cta--primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('cta.signup')}
            </a>
            <span className="buyer-auth-cta-or" aria-hidden="true">
              {t('cta.or')}
            </span>
            <a
              href={loginUrl}
              className="buyer-auth-cta buyer-auth-cta--secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('cta.login')}
            </a>
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
