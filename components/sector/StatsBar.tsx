import { STATS } from '../../lib/constants'
import type { StatsSection } from './types'

type StatsBarProps = {
  statsSection?: StatsSection | null
}

export default function StatsBar({ statsSection }: StatsBarProps) {
  const visible = statsSection?.isVisible !== false
  const items = statsSection?.items?.length ? statsSection.items : STATS
  if (!visible || !items?.length) return null
  return (
    <section className="sector-stats-bar">
      <div className="sector-stats-in">
        {items.map((stat, i) => (
          <div key={i} className="sector-stat">
            <div className="sector-stat-value">{stat.value}</div>
            <div className="sector-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
