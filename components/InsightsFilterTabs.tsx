'use client'

import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'

type Tag = { _id: string; title: string; slug: string }

const DESKTOP_VISIBLE_TAGS = 6

type Props = {
  baseUrl: string
  tags: Tag[]
  currentTagSlug: string | undefined
  postCount: number
  filterAllLabel?: string
  filterMoreLabel?: string
  filterFiltersLabel?: string
  filterAllTopicsLabel?: string
}

export default function InsightsFilterTabs({
  baseUrl,
  tags,
  currentTagSlug,
  postCount,
  filterAllLabel = 'All',
  filterMoreLabel = 'More',
  filterFiltersLabel = 'Filters',
  filterAllTopicsLabel = 'All topics',
}: Props) {
  const router = useRouter()
  const [moreOpen, setMoreOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)

  function goTo(href: string) {
    router.push(href, { scroll: false })
    setMoreOpen(false)
    setSheetOpen(false)
  }

  const currentTag = currentTagSlug ? tags.find((t) => t.slug === currentTagSlug) : null
  const primaryTags = tags.slice(0, DESKTOP_VISIBLE_TAGS)
  const visibleTags: Tag[] =
    tags.length <= DESKTOP_VISIBLE_TAGS
      ? tags
      : currentTag && !primaryTags.some((t) => t.slug === currentTagSlug)
        ? [currentTag, ...primaryTags.filter((t) => t.slug !== currentTagSlug)].slice(0, DESKTOP_VISIBLE_TAGS)
        : primaryTags
  const overflowTags = tags.filter((t) => !visibleTags.some((v) => v.slug === t.slug))
  const hasMore = overflowTags.length > 0

  useEffect(() => {
    if (!moreOpen) return
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [moreOpen])

  return (
    <div className="filters">
      <div className="filters-in">
        {/* Desktop: chips + More popover */}
        <div className="filters-desktop">
          <div className="filter-chips">
            <button
              type="button"
              onClick={() => goTo(baseUrl)}
              className={`filter-chip${!currentTagSlug ? ' on' : ''}`}
            >
              {filterAllLabel}
            </button>
            {visibleTags.map((t) => (
              <button
                key={t._id}
                type="button"
                onClick={() => goTo(`${baseUrl}?tag=${encodeURIComponent(t.slug)}`)}
                className={`filter-chip${currentTagSlug === t.slug ? ' on' : ''}`}
              >
                {t.title}
              </button>
            ))}
            {hasMore && (
              <div className="filter-more-wrap" ref={moreRef}>
                <button
                  type="button"
                  onClick={() => setMoreOpen(!moreOpen)}
                  className={`filter-more-btn${moreOpen ? ' on' : ''}`}
                  aria-expanded={moreOpen}
                >
                  {filterMoreLabel}
                  <span className="filter-more-chevron" aria-hidden>▼</span>
                </button>
                {moreOpen && (
                  <div className="filter-more-popover">
                    {overflowTags.map((t) => (
                      <button
                        key={t._id}
                        type="button"
                        onClick={() => goTo(`${baseUrl}?tag=${encodeURIComponent(t.slug)}`)}
                        className={`filter-more-item${currentTagSlug === t.slug ? ' on' : ''}`}
                      >
                        {t.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <span className="fcount">
            {postCount} article{postCount === 1 ? '' : 's'}
          </span>
        </div>

        {/* Mobile: All | current | Filters button + bottom sheet */}
        <div className="filters-mobile">
          <button
            type="button"
            onClick={() => goTo(baseUrl)}
            className={`filter-mobile-chip${!currentTagSlug ? ' on' : ''}`}
          >
            {filterAllLabel}
          </button>
          <span className="filter-mobile-current">
            {currentTag ? currentTag.title : filterAllTopicsLabel}
          </span>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="filter-mobile-filters-btn"
            aria-label={filterFiltersLabel}
          >
            {filterFiltersLabel}
            <span className="filter-mobile-chevron" aria-hidden>›</span>
          </button>
          <span className="fcount fcount-mobile">
            {postCount} article{postCount === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Mobile bottom sheet */}
      {sheetOpen && (
        <>
          <div
            className="filters-sheet-overlay"
            onClick={() => setSheetOpen(false)}
            aria-hidden
          />
          <div className="filters-sheet-panel" role="dialog" aria-label={filterFiltersLabel}>
            <div className="filters-sheet-header">
              <span className="filters-sheet-title">{filterFiltersLabel}</span>
              <button type="button" onClick={() => setSheetOpen(false)} className="filters-sheet-close" aria-label="Close">×</button>
            </div>
            <div className="filters-sheet-list">
              <button
                type="button"
                onClick={() => goTo(baseUrl)}
                className={`filters-sheet-item${!currentTagSlug ? ' on' : ''}`}
              >
                {filterAllLabel}
              </button>
              {tags.map((t) => (
                <button
                  key={t._id}
                  type="button"
                  onClick={() => goTo(`${baseUrl}?tag=${encodeURIComponent(t.slug)}`)}
                  className={`filters-sheet-item${currentTagSlug === t.slug ? ' on' : ''}`}
                >
                  {t.title}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
