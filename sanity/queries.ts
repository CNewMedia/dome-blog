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
