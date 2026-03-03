import { TEAM } from '../../lib/constants'

export default function TeamSection() {
  return (
    <section className="sector-team-wrap">
      <div className="sector-team-in">
        <div className="sector-eyebrow sector-team-eyebrow">Team België</div>
        <h2 className="sector-section-title sector-team-title">Uw team</h2>
        <div className="sector-team-grid">
          {TEAM.map((member, i) => (
            <div key={i} className="sector-team-card">
              <div className="sector-team-avatar" aria-hidden>
                {member.initials}
              </div>
              <div className="sector-team-name">{member.name}</div>
              <div className="sector-team-role">{member.role}</div>
              <p className="sector-team-desc">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
