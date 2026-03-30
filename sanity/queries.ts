import { groq } from 'next-sanity'

const localeToField = (locale: string) => {
  if (locale === 'en-be') return 'en'
  return locale.replace('-', '_')
}

export const getInsights = (locale: string, tagSlug?: string) => {
  const tagFilter = tagSlug ? `&& $tagSlug in (tags[]->slug.current)` : ''
  return groq`*[_type == "post" && locale == $locale ${tagFilter}] | order(publishedAt desc) {
    _id,
    title,
    excerpt,
    "slug": slug.current,
    "tags": tags[]->{
      _id,
      title,
      "slug": slug.current
    },
    mainImage,
    publishedAt
  }`
}

/** Tags for a locale (for filter tabs, ticker, etc.) */
export const getTags = (locale: string) => {
  return groq`*[_type == "tag" && locale == $locale] | order(title asc) {
    _id,
    title,
    "slug": slug.current
  }`
}

export const getInsight = (locale: string) => {
  return groq`*[_type == "post" && locale == $locale && slug.current == $slug][0] {
    _id,
    title,
    excerpt,
    body,
    "slug": slug.current,
    "tags": tags[]->{
      _id,
      title,
      "slug": slug.current
    },
    mainImage,
    publishedAt,
    seoTitle,
    seoDescription
  }`
}

export const getRecentInsights = (locale: string) => {
  return groq`*[_type == "post" && locale == $locale] | order(publishedAt desc) [0..4] {
    _id,
    title,
    "slug": slug.current,
    publishedAt
  }`
}

/** For language selector: which locales exist for a landing page translation group (based on the current document) */
export const getSectorAvailableLocales = groq`{
  "availableLocales": array::unique(
    coalesce(
      *[_type == "sectorPage" && defined(translationKey) && translationKey == *[
        _type == "sectorPage" &&
        locale == $locale &&
        (slug.current == $slug || (!defined(slug.current) && lower(sector) == $slug))
      ][0].translationKey].locale,
      *[_type == "sectorPage" && locale == $locale && (slug.current == $slug || (!defined(slug.current) && lower(sector) == $slug))].locale
    )
  )
}`

/** For language selector: which locales exist for an insight translation group (based on the current document) */
export const getInsightAvailableLocales = groq`{
  "availableLocales": array::unique(
    coalesce(
      *[_type == "post" && defined(translationKey) && translationKey == *[
        _type == "post" &&
        locale == $locale &&
        slug.current == $slug
      ][0].translationKey].locale,
      *[_type == "post" && locale == $locale && slug.current == $slug].locale
    )
  )
}`

/** All landing page slugs/locales for static generation */
export const getSectorSlugs = groq`*[_type == "sectorPage" && defined(locale) && (defined(slug.current) || defined(sector))]{
  "slug": coalesce(slug.current, lower(sector)),
  "locale": locale
}`

/** All insight slugs per locale for sitemap */
export const getInsightSlugs = groq`*[_type == "post" && defined(locale) && defined(slug.current)]{
  "slug": slug.current,
  "locale": locale
}`

/** New schema: one document per slug + locale */
export const getSectorPage = (locale: string) => {
  return groq`*[_type == "sectorPage" && (
      slug.current == $slug ||
      (!defined(slug.current) && lower(sector) == $slug)
    ) && (locale == $locale || locale == $localeAlt)][0] {
    _id,
    "slug": coalesce(slug.current, lower(sector)),
    locale,
    pageCategory,
    audienceType,
    sectorKey,
    heroTitle,
    heroSubtitle,
    heroImage,
    heroEyebrow,
    heroCtaLabel,
    heroCtaHref,
    heroSectionVisible,
    statsSection {
      isVisible,
      items[] { value, label }
    },
    processSection {
      isVisible,
      eyebrow,
      title,
      steps[] { title, description }
    },
    contentSectionVisible,
    contentImage,
    content,
    uspBlocks,
    uspSectionEyebrow,
    uspSectionTitle,
    uspSectionVisible,
    machines[] {
      name,
      description,
      image,
      buttonLabel,
      buttonHref,
      openInNewTab
    },
    machinesSectionVisible,
    successStory {
      quote,
      company,
      result
    },
    testimonialSectionVisible,
    teamSectionEyebrow,
    teamSectionTitle,
    teamSectionVisible,
    contactSectionEyebrow,
    contactSectionSubtitle,
    contactSectionVisible,
    ctaFormTitle,
    hubspotFormId,
    seoTitle,
    seoDescription,
    ogImage
  }`
}

/** Legacy schema: one document per sector with localeString fields; use when no new doc exists */
export const getSectorPageLegacy = (locale: string) => {
  const l = localeToField(locale)
  const fallback = 'nl_be'
  return groq`*[_type == "sectorPage" && lower(sector) == $slug && (locale == null || !defined(locale))][0] {
    _id,
    "slug": lower(sector),
    "heroTitle": coalesce(heroTitle.${l}, heroTitle.${fallback}),
    "heroSubtitle": coalesce(heroSubtitle.${l}, heroSubtitle.${fallback}),
    heroImage,
    heroEyebrow,
    heroCtaLabel,
    heroCtaHref,
    heroSectionVisible,
    statsSection { isVisible, items[] { value, label } },
    processSection { isVisible, eyebrow, title, steps[] { title, description } },
    contentSectionVisible,
    contentImage,
    "content": coalesce(content.${l}, content.${fallback}),
    "uspBlocks": uspBlocks[] {
      icon,
      "title": coalesce(title.${l}, title.${fallback}, title),
      "description": coalesce(description.${l}, description.${fallback}, description)
    },
    uspSectionEyebrow,
    uspSectionTitle,
    uspSectionVisible,
    "machines": machines[] {
      "name": coalesce(name.${l}, name.${fallback}, name),
      "description": coalesce(description.${l}, description.${fallback}, description),
      image,
      buttonLabel,
      buttonHref,
      openInNewTab
    },
    machinesSectionVisible,
    "successStory": successStory {
      "quote": coalesce(quote.${l}, quote.${fallback}, quote),
      "company": coalesce(company.${l}, company.${fallback}, company),
      "result": coalesce(result.${l}, result.${fallback}, result)
    },
    testimonialSectionVisible,
    teamSectionEyebrow,
    teamSectionTitle,
    teamSectionVisible,
    contactSectionEyebrow,
    contactSectionSubtitle,
    contactSectionVisible,
    "ctaFormTitle": coalesce(ctaFormTitle.${l}, ctaFormTitle.${fallback}),
    hubspotFormId,
    "seoTitle": coalesce(seo.title.${l}, seo.title.${fallback}),
    "seoDescription": coalesce(seo.description.${l}, seo.description.${fallback}),
    ogImage
  }`
}

export const getTeamMembers = groq`*[_type == "teamMember" && actief == true] | order(volgorde asc) {
  _id,
  naam,
  functie,
  beschrijving,
  foto,
  email,
  telefoon,
  linkedinUrl,
  meetingCalendarUrl,
  ctaLabel,
  volgorde,
  actief
}`

export const getSiteSettings = groq`*[_type == "siteSettings"][0]{
  _id,
  logo,
  logoAlt,
  bedrijfsnaam,
  tagline,
  headerMenu[] {
    label,
    url,
    submenu[] { label, url }
  },
  footerKolommen[] {
    titel,
    links[] { label, url }
  },
  socialLinks[] { platform, url },
  adres,
  copyrightTekst,
  nieuwsbriefTitel
}`

export const getSiteChrome = (locale: string) => {
  return groq`*[_type == "siteChrome" && locale == $locale][0]{
    _id,
    locale,
    companyName,
    headerLogo,
    footerLogo,
    logoAlt,
    headerMenu[]{
      label,
      href,
      openInNewTab
    },
    newsletterTitle,
    footerPrimaryLinks[]{
      label,
      href
    },
    footerLegalLinks[]{
      label,
      href
    },
    socialLinks[]{
      platform,
      url
    },
    address,
    copyrightText
  }`
}
