import { STATS } from '../../lib/constants'

export default function StatsBar() {
  return (
    <section className="sector-stats-bar">
      <div className="sector-stats-in">
        {STATS.map((stat, i) => (
          <div key={i} className="sector-stat">
            <div className="sector-stat-value">{stat.value}</div>
            <div className="sector-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
