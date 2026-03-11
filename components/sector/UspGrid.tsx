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

function getIcon(iconKey?: string | null, index: number = 0): React.ReactNode {
  const key = (iconKey || '').toLowerCase().replace(/\s/g, '')
  if (USP_ICONS[key]) return USP_ICONS[key]
  const fallbacks = ['speed', 'personal', 'experience', 'b2b', 'international']
  return USP_ICONS[fallbacks[index % fallbacks.length]] ?? USP_ICONS.speed
}

type UspBlock = { icon?: string; title?: string; description?: string }

type UspGridProps = {
  items: UspBlock[]
  eyebrow?: string
  title?: string
}

export default function UspGrid({ items, eyebrow, title }: UspGridProps) {
  const eyebrowText = eyebrow ?? 'Waarom Dome Auctions'
  const titleText = title ?? 'Bewezen aanpak. Geen verrassingen.'
  if (!items?.length) return null
  return (
    <section className="sector-usp-wrap">
      <div className="sector-usp-in">
        <div className="sector-eyebrow">{eyebrowText}</div>
        <h2 className="sector-section-title">{titleText}</h2>
        <div className="sector-usp-grid">
          {items.map((usp, i) => (
            <div key={i} className="sector-usp-card">
              <div className="sector-usp-icon">{getIcon(usp.icon, i)}</div>
              <div className="sector-usp-card-title">{usp.title}</div>
              {usp.description && <p className="sector-usp-card-desc">{usp.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
