'use client'

import { useEffect, useId } from 'react'

const PORTAL_ID = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || '147410570'

declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (options: {
          portalId: string
          formId: string
          target: string
          region: string
        }) => void
      }
    }
  }
}

export default function HubSpotForm({ formId }: { formId: string }) {
  const id = useId().replace(/:/g, '-')
  const targetId = `hubspot-form-${id}`

  useEffect(() => {
    if (!formId) return
    const script = document.createElement('script')
    script.src = '//js-eu1.hsforms.net/forms/embed/v2.js'
    script.async = true
    script.onload = () => {
      window.hbspt?.forms.create({
        portalId: PORTAL_ID,
        formId,
        target: `#${targetId}`,
        region: 'eu1',
      })
    }
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [formId, targetId])

  return <div id={targetId} className="hubspot-form-container" />
}
