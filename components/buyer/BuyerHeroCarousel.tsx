'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

export type BuyerHeroSlide = {
  src: string
  alt: string
}

type Props = {
  slides: BuyerHeroSlide[]
  autoIntervalMs?: number
  prevLabel: string
  nextLabel: string
}

export default function BuyerHeroCarousel({
  slides,
  autoIntervalMs = 5500,
  prevLabel,
  nextLabel,
}: Props) {
  const [index, setIndex] = useState(0)
  const count = slides.length
  const hasMultiple = count > 1

  const goTo = useCallback(
    (next: number) => {
      if (!count) return
      setIndex(((next % count) + count) % count)
    },
    [count]
  )

  useEffect(() => {
    if (!hasMultiple) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count)
    }, autoIntervalMs)
    return () => window.clearInterval(timer)
  }, [autoIntervalMs, count, hasMultiple])

  if (!count) return null

  const slide = slides[index]

  return (
    <div className={`buyer-hero-carousel${hasMultiple ? ' buyer-hero-carousel--multi' : ''}`}>
      <div className="buyer-hero-carousel-frame">
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          priority={index === 0}
          sizes="(max-width: 960px) 100vw, 50vw"
          className="buyer-hero-carousel-image"
        />
      </div>

      {hasMultiple && (
        <>
          <button
            type="button"
            className="buyer-hero-carousel-nav buyer-hero-carousel-nav--prev"
            onClick={() => goTo(index - 1)}
            aria-label={prevLabel}
          >
            ‹
          </button>
          <button
            type="button"
            className="buyer-hero-carousel-nav buyer-hero-carousel-nav--next"
            onClick={() => goTo(index + 1)}
            aria-label={nextLabel}
          >
            ›
          </button>
          <div className="buyer-hero-carousel-dots" role="tablist" aria-label="Hero slides">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Slide ${i + 1}`}
                className={`buyer-hero-carousel-dot${i === index ? ' buyer-hero-carousel-dot--active' : ''}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
