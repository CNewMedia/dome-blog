import { client } from './sanity'

export async function getAllPosts(locale: string) {
  return client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      "slug": slug_${locale}.current,
      "title": title_${locale},
      "excerpt": excerpt_${locale},
      "category": category->{ "title": title_${locale} },
      publishedAt,
      mainImage,
      author->{ name, image },
      "readTime": readTime
    }
  `)
}

export async function getPostBySlug(slug: string, locale: string) {
  return client.fetch(`
    *[_type == "post" && slug_${locale}.current == $slug][0] {
      _id,
      "slug": slug_${locale}.current,
      "title": title_${locale},
      "excerpt": excerpt_${locale},
      "body": body_${locale},
      "category": category->{ "title": title_${locale} },
      publishedAt,
      mainImage,
      author->{ name, image, bio },
      "readTime": readTime,
      "allSlugs": {
        "nl_be": slug_nl_be.current,
        "fr_be": slug_fr_be.current,
        "en": slug_en.current,
        "de": slug_de.current,
      }
    }
  `, { slug })
}

export async function getAllCategories(locale: string) {
  return client.fetch(`
    *[_type == "category"] | order(title_${locale} asc) {
      _id,
      "title": title_${locale},
      "slug": slug.current
    }
  `)
}

export async function getPostsByCategory(categorySlug: string, locale: string) {
  return client.fetch(`
    *[_type == "post" && category->slug.current == $categorySlug] | order(publishedAt desc) {
      _id,
      "slug": slug_${locale}.current,
      "title": title_${locale},
      "excerpt": excerpt_${locale},
      "category": category->{ "title": title_${locale} },
      publishedAt,
      mainImage,
      author->{ name, image },
      "readTime": readTime
    }
  `, { categorySlug })
}

export async function getRecentPosts(locale: string, limit = 4) {
  return client.fetch(`
    *[_type == "post"] | order(publishedAt desc)[0...$limit] {
      _id,
      "slug": slug_${locale}.current,
      "title": title_${locale},
      publishedAt,
      mainImage,
    }
  `, { limit })
}

export async function getAllPostSlugs(locale: string) {
  const localeKey = locale.replace('-', '_')
  return client.fetch(`
    *[_type == "post" && defined(slug_${localeKey})] {
      "slug": slug_${localeKey}.current
    }
  `)
}
