'use client'

import React, { useEffect, useState } from 'react'
import { useClient, useFormValue } from 'sanity'
import { useRouter } from 'sanity/router'

const INSIGHT_LOCALES = ['nl-be', 'fr-be', 'en-be'] as const

type InsightDoc = {
  _id: string
  locale?: string
}

export function InsightsTranslationPanel() {
  const client = useClient({ apiVersion: '2023-01-01' })
  const router = useRouter()
  const locale = useFormValue(['locale']) as string | undefined
  const translationKey = useFormValue(['translationKey']) as string | undefined
  const [docsByLocale, setDocsByLocale] = useState<Record<string, InsightDoc>>({})

  useEffect(() => {
    if (!translationKey) {
      setDocsByLocale({})
      return
    }

    client
      .fetch<InsightDoc[]>(
        `*[_type == "post" && translationKey == $translationKey]{_id, locale}`,
        { translationKey }
      )
      .then((docs) => {
        const map: Record<string, InsightDoc> = {}
        docs.forEach((doc) => {
          if (doc.locale) {
            map[doc.locale] = doc
          }
        })
        setDocsByLocale(map)
      })
      .catch(() => {
        setDocsByLocale({})
      })
  }, [client, translationKey])

  if (!translationKey) {
    return (
      <div style={{ padding: '0.75rem 1rem', borderRadius: 6, background: '#f7f5f0', fontSize: '0.8rem' }}>
        Set a translation group ID to link this insight to its other language versions.
      </div>
    )
  }

  const handleOpen = (targetLocale: string) => {
    const doc = docsByLocale[targetLocale]
    if (!doc) return
    router.navigateIntent('edit', { id: doc._id, type: 'post' })
  }

  const handleCreate = async (targetLocale: string) => {
    const existing = docsByLocale[targetLocale]
    if (existing) {
      router.navigateIntent('edit', { id: existing._id, type: 'post' })
      return
    }

    const newDoc = await client.create({
      _type: 'post',
      locale: targetLocale,
      translationKey,
    })

    router.navigateIntent('edit', { id: newDoc._id, type: 'post' })
  }

  return (
    <div
      style={{
        padding: '0.75rem 1rem',
        borderRadius: 6,
        background: '#0c0c0b',
        color: '#f7f5f0',
        fontSize: '0.8rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <div style={{ fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.7rem', opacity: 0.8 }}>
        Translation group
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {INSIGHT_LOCALES.map((code) => {
          const exists = Boolean(docsByLocale[code])
          const isCurrent = locale === code

          return (
            <button
              key={code}
              type="button"
              onClick={() => (exists ? handleOpen(code) : handleCreate(code))}
              style={{
                padding: '0.35rem 0.7rem',
                borderRadius: 999,
                border: '1px solid rgba(232,184,75,.6)',
                background: exists ? (isCurrent ? '#e8b84b' : 'transparent') : 'rgba(255,255,255,0.04)',
                color: exists ? (isCurrent ? '#0c0c0b' : '#f7f5f0') : 'rgba(247,245,240,0.7)',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              {code.toUpperCase()}{' '}
              {exists ? (isCurrent ? '· current' : '· open') : '· create'}
            </button>
          )
        })}
      </div>
      <div style={{ opacity: 0.7 }}>
        Use these chips to jump to existing translations or create missing ones for this group.
      </div>
    </div>
  )
}

