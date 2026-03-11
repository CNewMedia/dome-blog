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
  buttonLabel?: string
  buttonHref?: string
  openInNewTab?: boolean
}

export type SuccessStory = {
  quote?: string
  company?: string
  result?: string
}

export type StatsSectionItem = { value?: string; label?: string }
export type StatsSection = { isVisible?: boolean; items?: StatsSectionItem[] }

export type ProcessStep = { title?: string; description?: string }
export type ProcessSection = { isVisible?: boolean; eyebrow?: string; title?: string; steps?: ProcessStep[] }

export type SectorPageData = {
  _id: string
  slug: string
  locale?: string
  language?: string
  heroTitle?: string
  heroSubtitle?: string
  heroImage?: SanityImage
  heroEyebrow?: string
  heroCtaLabel?: string
  heroCtaHref?: string
  heroSectionVisible?: boolean
  statsSection?: StatsSection
  processSection?: ProcessSection
  contentSectionVisible?: boolean
  content?: unknown[]
  contentImage?: SanityImage
  uspBlocks?: SectorUspBlock[]
  uspSectionEyebrow?: string
  uspSectionTitle?: string
  uspSectionVisible?: boolean
  machines?: Machine[]
  machinesSectionVisible?: boolean
  successStory?: SuccessStory
  testimonialSectionVisible?: boolean
  teamSectionEyebrow?: string
  teamSectionTitle?: string
  teamSectionVisible?: boolean
  contactSectionEyebrow?: string
  contactSectionSubtitle?: string
  contactSectionVisible?: boolean
  ctaFormTitle?: string
  hubspotFormId?: string
  seoTitle?: string
  seoDescription?: string
  ogImage?: SanityImage
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