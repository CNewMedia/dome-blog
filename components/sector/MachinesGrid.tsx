import Image from 'next/image'
import { urlFor } from '../../sanity/client'
import { BRAND } from '../../lib/constants'

type Machine = {
  name?: string
  description?: string
  image?: { asset?: { _ref?: string }; alt?: string }
}

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
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
