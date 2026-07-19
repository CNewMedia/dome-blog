import Image from 'next/image'
import { urlFor } from '../../sanity/client'
import type { ReferenceAuction } from './types'

type ReferenceAuctionsProps = {
  items: ReferenceAuction[]
  title?: string | null
}

export default function ReferenceAuctions({ items, title }: ReferenceAuctionsProps) {
  const panels = (items ?? []).filter((item) => Boolean(item?.title?.trim()))
  if (!panels.length) return null

  const heading = title?.trim() || 'Referentieveilingen'

  return (
    <section className="sector-ref-wrap">
      <div className="sector-ref-in">
        <h2 className="sector-section-title">{heading}</h2>
        <div className="sector-ref-grid">
          {panels.map((item, i) => {
            const href = item.link?.trim()
            const body = (
              <>
                {item.image?.asset ? (
                  <div className="sector-ref-img-wrap">
                    <Image
                      src={urlFor(item.image).width(600).height(375).url()}
                      alt={item.image.alt || item.title || ''}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="sector-ref-img-wrap sector-ref-img-wrap--placeholder" aria-hidden>
                    ◆
                  </div>
                )}
                <div className="sector-ref-body">
                  <div className="sector-ref-name">{item.title}</div>
                  {item.text?.trim() ? <p className="sector-ref-desc">{item.text.trim()}</p> : null}
                </div>
              </>
            )

            if (href) {
              return (
                <a
                  key={i}
                  href={href}
                  className="sector-ref-card sector-ref-card--link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {body}
                </a>
              )
            }

            return (
              <article key={i} className="sector-ref-card">
                {body}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
