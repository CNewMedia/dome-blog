import Image from 'next/image'
import { urlFor } from '../../sanity/client'

type HeroProps = {
  title: string
  subtitle?: string | null
  image?: { asset?: { _ref?: string }; alt?: string } | null
}

export default function Hero({ title, subtitle, image }: HeroProps) {
  return (
    <section className="sector-hero">
      {image?.asset && (
        <div className="sector-hero-bg">
          <Image
            src={urlFor(image).width(1920).height(1080).url()}
            alt={image.alt || title}
            fill
            priority
            sizes="100vw"
          />
        </div>
      )}
      <div className="sector-hero-overlay" aria-hidden />
      <div className="sector-hero-overlay-v" aria-hidden />
      <div className="sector-hero-in">
        <div className="sector-hero-eyebrow">Sector</div>
        <h1 className="sector-hero-h1">{title || 'Industrial Auctions'}</h1>
        {subtitle && <p className="sector-hero-sub">{subtitle}</p>}
        <a href="#cta-form" className="sector-hero-cta">
          Vraag een gesprek aan
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  )
}
