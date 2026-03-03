/** Sanity-driven content for sector landing pages */

export type SectorPageData = {
  _id: string
  sector: string
  heroTitle?: string | null
  heroSubtitle?: string | null
  heroImage?: { asset?: { _ref?: string }; alt?: string } | null
  content?: unknown[] | null
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
