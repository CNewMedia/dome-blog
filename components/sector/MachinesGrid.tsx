'use client'

import Image from 'next/image'
import { useId, useState } from 'react'
import { urlFor } from '../../sanity/client'
import type { Machine } from './types'

type MachinesGridProps = {
  machines: Machine[]
  eyebrow?: string
  title?: string
}

function cleanStrings(values?: string[] | null): string[] {
  if (!Array.isArray(values)) return []
  return values.map((v) => (typeof v === 'string' ? v.trim() : '')).filter(Boolean)
}

function MachineCard({ machine }: { machine: Machine }) {
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const types = cleanStrings(machine.machineTypes)
  const brands = cleanStrings(machine.brands)
  const hasDetails = types.length > 0 || brands.length > 0

  return (
    <article className={`sector-machine-card${hasDetails ? ' sector-machine-card--expandable' : ''}${open ? ' is-open' : ''}`}>
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
        <div className="sector-machine-img-wrap sector-machine-img-wrap--placeholder" aria-hidden>
          ◆
        </div>
      )}
      <div className="sector-machine-body">
        <div className="sector-machine-name">{machine.name}</div>
        {machine.description && <p className="sector-machine-desc">{machine.description}</p>}

        {hasDetails && (
          <>
            <button
              type="button"
              className="sector-machine-toggle"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((v) => !v)}
            >
              <span>{open ? 'Minder info' : 'Meer info'}</span>
              <span className="sector-machine-toggle-icon" aria-hidden>
                {open ? '−' : '+'}
              </span>
            </button>
            <div
              id={panelId}
              className={`sector-machine-details${open ? ' is-open' : ''}`}
              aria-hidden={!open}
            >
              <div className="sector-machine-details-inner">
                {types.length > 0 && (
                  <div className="sector-machine-details-block">
                    <div className="sector-machine-details-label">Types</div>
                    <ul className="sector-machine-types">
                      {types.map((type) => (
                        <li key={type}>{type}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {brands.length > 0 && (
                  <div className="sector-machine-details-block">
                    <div className="sector-machine-details-label">Merken</div>
                    <div className="sector-machine-brands">
                      {brands.map((brand) => (
                        <span key={brand} className="sector-machine-brand-chip">
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

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
  )
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
          <MachineCard key={i} machine={machine} />
        ))}
      </div>
    </section>
  )
}
