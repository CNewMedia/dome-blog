'use client'

import { useEffect } from 'react'

const HUBSPOT_EMBED_SCRIPT_ID = 'hs-form-147410570-script'

export default function HubSpotForm({ formId }: { formId: string }) {
  useEffect(() => {
    if (typeof document === 'undefined') return
    if (document.getElementById(HUBSPOT_EMBED_SCRIPT_ID)) return

    const script = document.createElement('script')
    script.id = HUBSPOT_EMBED_SCRIPT_ID
    script.src = 'https://js-eu1.hsforms.net/forms/embed/developer/147410570.js'
    script.defer = true
    document.body.appendChild(script)
  }, [])

  return (
    <div className="hubspot-dome-form">
      <div
        className="hs-form-html"
        data-region="eu1"
        data-form-id={formId}
        data-portal-id="147410570"
      />
    </div>
  )
}

