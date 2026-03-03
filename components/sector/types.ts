/** Sanity-driven content for sector landing pages */

export type LocalizedValue = string | Record<string, string>

export type SanityImage = {
  asset?: { _ref?: string }
  alt?: LocalizedValue | null
} | null

export type SectorPageData = {
  _id: string
  sector: string
  locale?: string
  language?: string
  heroTitle?: string | null
  heroSubtitle?: string | null
  heroImage?: SanityImage
  content?: unknown[] | null
  contentImage?: SanityImage
  uspBlocks?: Array<{
    icon?: string
    title?: string
    description?: string
  }> | null
  machines?: Array<{
    name?: string
    description?: string
    image?: SanityImage
  }> | null
  successStory?: {
    quote?: string
    company?: string
    result?: string
  } | null
  ctaFormTitle?: string | null
  hubspotFormId?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
}

/** Team member from Sanity (getTeamMembers) */
export type TeamMember = {
  _id: string
  naam: LocalizedValue
  functie?: LocalizedValue | null
  beschrijving?: LocalizedValue | null
  foto?: SanityImage
  email?: string | null
  telefoon?: string | null
  linkedinUrl?: string | null
  meetingCalendarUrl?: string | null
  ctaLabel?: LocalizedValue | null
}