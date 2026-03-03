import Image from 'next/image'
import { urlFor } from '../../sanity/client'
import type { TeamMember } from './types'

type TeamSectionProps = {
  teamMembers: TeamMember[]
  locale: string
}

function pickLocalized(value: unknown, locale: string) {
  if (typeof value === 'string') return value

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const record = value as Record<string, string>
    const key = locale.replace('-', '_')
    return record[key] ?? record.nl_be ?? record.fr_be ?? record.en ?? record.de ?? ''
  }

  return ''
}

export default function TeamSection({ teamMembers, locale }: TeamSectionProps) {
  if (!teamMembers?.length) return null

  return (
    <section className="sector-team-wrap">
      <div className="sector-team-in">
        <div className="sector-eyebrow sector-team-eyebrow">Team België</div>
        <h2 className="sector-section-title sector-team-title">Uw team</h2>

        <div className="sector-team-list">
          {teamMembers.map((member) => {
            const naam = pickLocalized(member.naam, locale)
            const functie = pickLocalized(member.functie, locale)
            const beschrijving = pickLocalized(member.beschrijving, locale)
            const fotoAlt = pickLocalized(member.foto?.alt, locale) || naam

            return (
              <article key={member._id} className="sector-team-card">
                <div className="sector-team-photo-wrap">
                  {member.foto ? (
                    <Image
                      src={urlFor(member.foto).width(360).height(360).fit('crop').url()}
                      alt={fotoAlt}
                      width={360}
                      height={360}
                      className="sector-team-photo"
                    />
                  ) : (
                    <div className="sector-team-photo-placeholder" aria-hidden>
                      {naam
                        .split(/\s+/)
                        .map((w) => w[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="sector-team-body">
                  <h3 className="sector-team-name">{naam}</h3>

                  {functie && (
                    <p className="sector-team-role">{functie}</p>
                  )}

                  {beschrijving && (
                    <p className="sector-team-desc">{beschrijving}</p>
                  )}

                  {(member.email || member.telefoon) && (
                    <div className="sector-team-meta">
                      {member.email && (
                        <a href={`mailto:${member.email}`} className="sector-team-email">
                          {member.email}
                        </a>
                      )}
                      {member.telefoon && (
                        <a href={`tel:${member.telefoon.replace(/\s/g, '')}`} className="sector-team-phone">
                          {member.telefoon}
                        </a>
                      )}
                    </div>
                  )}

                  <div className="sector-team-ctas">
                    {member.meetingCalendarUrl && (
                      <a
                        href={member.meetingCalendarUrl}
                        className="sector-team-btn sector-team-btn-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {pickLocalized(member.ctaLabel, locale) || 'Plan een gesprek'}
                      </a>
                    )}

                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        className="sector-team-btn sector-team-btn-linkedin"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}