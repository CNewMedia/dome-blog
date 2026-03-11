import Image from 'next/image'
import { urlFor } from '../../sanity/client'
import { BRAND } from '../../lib/constants'
import type { Machine } from './types'

type MachinesGridProps = {
  machines: Machine[]
  eyebrow?: string
  title?: string
}

export default function MachinesGrid({
  machines,
  eyebrow = 'Machines in deze sector',
  title = 'Wat we veilen',
}: MachinesGridProps) {
  if (!machines?.length) return null
  return (
    <section className="sector-machines-wrap">
      <div className="sector-eyebrow">{eyebrow}</div>
      <h2 className="sector-section-title">{title}</h2>
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
              <div
                className="sector-machine-img-wrap"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: BRAND.muted,
                  fontSize: '2rem',
                }}
              >
                ◆
              </div>
            )}
            <div className="sector-machine-body">
              <div className="sector-machine-name">{machine.name}</div>
              {machine.description && <p className="sector-machine-desc">{machine.description}</p>}
              {machine.buttonHref && (
                <a
                  href={machine.buttonHref}
                  className="sector-machine-cta"
                  target={machine.openInNewTab ? '_blank' : undefined}
                  rel={machine.openInNewTab ? 'noopener noreferrer' : undefined}
                >
                  {machine.buttonLabel || 'Meer info'}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
