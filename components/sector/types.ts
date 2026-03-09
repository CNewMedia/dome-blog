/** Sanity-driven content for sector landing pages */

export type LocalizedValue = string | Record<string, string>

export type SanityImage = {
  asset?: { _ref?: string }
  alt?: string
}

export type SectorUspBlock = {
  icon?: string
  title?: string
  description?: string
}

export type Machine = {
  name?: string
  description?: string
  image?: SanityImage
}

export type SuccessStory = {
  quote?: string
  company?: string
  result?: string
}

export type SectorPageData = {
  _id: string
  slug: string
  locale?: string
  language?: string
  heroTitle?: string
  heroSubtitle?: string
  heroImage?: SanityImage
  content?: unknown[]
  contentImage?: SanityImage
  uspBlocks?: SectorUspBlock[]
  machines?: Machine[]
  successStory?: SuccessStory
  ctaFormTitle?: string
  hubspotFormId?: string
  seoTitle?: string
  seoDescription?: string
}

/** Team member from Sanity (getTeamMembers) */
export type TeamMember = {
  _id: string
  naam: LocalizedValue
  functie?: LocalizedValue
  beschrijving?: LocalizedValue
  foto?: SanityImage
  email?: string
  telefoon?: string
  linkedinUrl?: string
  meetingCalendarUrl?: string
  ctaLabel?: LocalizedValue
  volgorde?: number
  actief?: boolean
}