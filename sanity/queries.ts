import { groq } from 'next-sanity'

const localeToField = (locale: string) => {
  if (locale === 'en-be') return 'en'
  return locale.replace('-', '_')
}

export const getPosts = (locale: string) => {
  return groq`*[_type == "post" && locale == $locale] | order(publishedAt desc) {
    _id,
    "title": titlePlain,
    "excerpt": excerptPlain,
    "slug": slugPlain.current,
    mainImage,
    publishedAt,
    author,
    "categories": categories[]->{ title, "slug": slug.current }
  }`
}

export const getPost = (locale: string) => {
  return groq`*[_type == "post" && locale == $locale && slugPlain.current == $slug][0] {
    _id,
    "title": titlePlain,
    "excerpt": excerptPlain,
    "body": bodyPlain,
    "slug": slugPlain.current,
    mainImage,
    publishedAt,
    author,
    "categories": categories[]->{ title, "slug": slug.current },
    "seoTitle": seoTitlePlain,
    "seoDescription": seoDescriptionPlain
  }`
}

export const getRecentPosts = (locale: string) => {
  return groq`*[_type == "post" && locale == $locale] | order(publishedAt desc) [0..4] {
    _id,
    "title": titlePlain,
    "slug": slugPlain.current,
    publishedAt
  }`
}

export const getCategories = groq`*[_type == "category"] | order(title asc) {
  _id, title, "slug": slug.current
}`

/** For language selector: which locales exist for a sector (new docs) or all if only legacy */
export const getSectorAvailableLocales = groq`{
  "availableLocales": array::unique(*[_type == "sectorPage" && sector == $sector].locale)
}`

/** All sector landing page slugs/locales for static generation */
export const getSectorSlugs = groq`*[_type == "sectorPage" && defined(sector) && defined(locale)]{
  "sector": sector,
  "locale": locale
}`

/** New schema: one document per sector + locale (locale can be "nl-be" or "nl_be" in dataset) */
export const getSectorPage = (locale: string) => {
  return groq`*[_type == "sectorPage" && sector == $sector && (locale == $locale || locale == $localeAlt)][0] {
    _id,
    sector,
    locale,
    heroTitle,
    heroSubtitle,
    heroImage,
    contentImage,
    content,
    uspBlocks,
    machines[] {
      name,
      description,
      image
    },
    successStory {
      quote,
      company,
      result
    },
    ctaFormTitle,
    hubspotFormId,
    seoTitle,
    seoDescription
  }`
}

/** Legacy schema: one document per sector with localeString fields; use when no new doc exists */
export const getSectorPageLegacy = (locale: string) => {
  const l = localeToField(locale)
  const fallback = 'nl_be'
  return groq`*[_type == "sectorPage" && sector == $sector && (locale == null || !defined(locale))][0] {
    _id,
    sector,
    "heroTitle": coalesce(heroTitle.${l}, heroTitle.${fallback}),
    "heroSubtitle": coalesce(heroSubtitle.${l}, heroSubtitle.${fallback}),
    heroImage,
    contentImage,
    "content": coalesce(content.${l}, content.${fallback}),
    "uspBlocks": uspBlocks[] {
      icon,
      "title": coalesce(title.${l}, title.${fallback}, title),
      "description": coalesce(description.${l}, description.${fallback}, description)
    },
    "machines": machines[] {
      "name": coalesce(name.${l}, name.${fallback}, name),
      "description": coalesce(description.${l}, description.${fallback}, description),
      image
    },
    "successStory": successStory {
      "quote": coalesce(quote.${l}, quote.${fallback}, quote),
      "company": coalesce(company.${l}, company.${fallback}, company),
      "result": coalesce(result.${l}, result.${fallback}, result)
    },
    "ctaFormTitle": coalesce(ctaFormTitle.${l}, ctaFormTitle.${fallback}),
    hubspotFormId,
    "seoTitle": coalesce(seo.title.${l}, seo.title.${fallback}),
    "seoDescription": coalesce(seo.description.${l}, seo.description.${fallback})
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
    footerBaseline,
    newsletterTitle,
    newsletterPlaceholder,
    newsletterButtonLabel,
    footerColumns[]{
      title,
      links[]{
        label,
        href,
        openInNewTab
      }
    },
    footerBottomLinks[]{
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
