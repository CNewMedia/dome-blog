'use client'

import { useRouter } from 'next/navigation'

type Tag = { _id: string; title: string; slug: string }

type Props = {
  baseUrl: string
  tags: Tag[]
  currentTagSlug: string | undefined
  postCount: number
}

export default function InsightsFilterTabs({ baseUrl, tags, currentTagSlug, postCount }: Props) {
  const router = useRouter()

  function goTo(href: string) {
    router.push(href, { scroll: false })
  }

  return (
    <div className="filters">
      <div className="filters-in">
        <button
          type="button"
          onClick={() => goTo(baseUrl)}
          className={`ftab${!currentTagSlug ? ' on' : ''}`}
        >
          All
        </button>
        {tags.map((t) => (
          <button
            key={t._id}
            type="button"
            onClick={() => goTo(`${baseUrl}?tag=${encodeURIComponent(t.slug)}`)}
            className={`ftab${currentTagSlug === t.slug ? ' on' : ''}`}
          >
            {t.title}
          </button>
        ))}
        <span className="fcount">
          {postCount} article{postCount === 1 ? '' : 's'}
        </span>
      </div>
    </div>
  )
}
