/** Sanity-driven content for sector landing pages */

export type SectorPageData = {
  _id: string
  sector: string
  availableLocales?: string[] | null
  heroTitle?: string | null
  heroSubtitle?: string | null
  heroImage?: { asset?: { _ref?: string }; alt?: string } | null
  content?: unknown[] | null
  contentImage?: { asset?: { _ref?: string }; alt?: string } | null
  uspBlocks?: Array<{ icon?: string; title?: string; description?: string }> | null
  machines?: Array<{
    name?: string
    description?: string
    image?: { asset?: { _ref?: string }; alt?: string }
  }> | null
  successStory?: { quote?: string; company?: string; result?: string } | null
  ctaFormTitle?: string | null
  hubspotFormId?: string | null
}

/** Team member from Sanity (getTeamMembers) */
export type TeamMember = {
  _id: string
  naam: string
  functie?: string | null
  beschrijving?: string | null
  foto?: { asset?: { _ref?: string }; alt?: string } | null
  email?: string | null
  telefoon?: string | null
  linkedinUrl?: string | null
  meetingCalendarUrl?: string | null
  ctaLabel?: string | null
}
