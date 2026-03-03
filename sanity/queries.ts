import { groq } from 'next-sanity'

const localeToField = (locale: string) => locale.replace('-', '_')

export const getPosts = (locale: string) => {
  const l = localeToField(locale)
  return groq`*[_type == "post"] | order(publishedAt desc) {
    _id,
    "title": title.${l},
    "excerpt": excerpt.${l},
    "slug": slug.${l}.current,
    mainImage,
    publishedAt,
    author,
    "categories": categories[]->{ title, "slug": slug.current }
  }`
}

export const getPost = (locale: string) => {
  const l = localeToField(locale)
  return groq`*[_type == "post" && slug.${l}.current == $slug][0] {
    _id,
    "title": title.${l},
    "excerpt": excerpt.${l},
    "body": body.${l},
    "slug": slug.${l}.current,
    mainImage,
    publishedAt,
    author,
    "categories": categories[]->{ title, "slug": slug.current },
    "seoTitle": seoTitle.${l},
    "seoDescription": seoDescription.${l}
  }`
}

export const getRecentPosts = (locale: string) => {
  const l = localeToField(locale)
  return groq`*[_type == "post"] | order(publishedAt desc) [0..4] {
    _id,
    "title": title.${l},
    "slug": slug.${l}.current,
    publishedAt
  }`
}

export const getCategories = groq`*[_type == "category"] | order(title asc) {
  _id, title, "slug": slug.current
}`

/** For language selector: which locales exist for a sector */
export const getSectorAvailableLocales = groq`{
  "availableLocales": array::unique(*[_type == "sectorPage" && sector == $sector].locale)
}`

export const getSectorPage = (locale: string) => {
  return groq`*[_type == "sectorPage" && sector == $sector && locale == $locale][0] {
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
  ctaLabel
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
