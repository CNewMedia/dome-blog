'use client'

import { useEffect } from 'react'

const HUBSPOT_OVERRIDES_ID = 'hubspot-dome-form-overrides'

const OVERRIDE_CSS = `
  .sector-cta-form-box .hs-form-header,
  .sector-cta-form-box .hs-form .hs-richtext,
  .sector-cta-form-box [class*="hs-form-header"],
  .sector-cta-form-box .hs-form > .hs-form-header,
  .sector-cta-form-box .hs-form > div.hs-richtext,
  .sector-cta-form-box .hs-form .hs-form-header,
  .sector-cta-form-box .hs-form .hs-richtext:first-of-type,
  .sector-cta-form-box .hs-form p:first-of-type:not(.hubspot-legal),
  .sector-cta-form-box .hs-form h3 {
    display: none !important;
    visibility: hidden !important;
    height: 0 !important;
    overflow: hidden !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  .sector-cta-form-box .hs-form,
  .sector-cta-form-box .hs-form *,
  .sector-cta-form-box .hs-form label,
  .sector-cta-form-box .hs-form .hs-label,
  .sector-cta-form-box .hs-form .hs-field-desc,
  .sector-cta-form-box .hs-form input,
  .sector-cta-form-box .hs-form textarea,
  .sector-cta-form-box .hs-form select,
  .sector-cta-form-box .hs-form button {
    font-family: 'Melody', -apple-system, BlinkMacSystemFont, system-ui, sans-serif !important;
  }
  .sector-cta-form-box .hs-form input:not([type="submit"]):not([type="checkbox"]):not([type="radio"]),
  .sector-cta-form-box .hs-form textarea,
  .sector-cta-form-box .hs-form select {
    font-size: 0.9375rem !important;
    color: #0f0f0f !important;
    background: #ffffff !important;
    border: 1.5px solid #e0dbd0 !important;
    border-radius: 8px !important;
    padding: 0.75rem 1rem !important;
  }
  .sector-cta-form-box .hs-form input[type="submit"],
  .sector-cta-form-box .hs-form .hs-button,
  .sector-cta-form-box .hs-form input[type="submit"].primary,
  .sector-cta-form-box .hs-form button[type="submit"] {
    font-family: 'Melody', -apple-system, BlinkMacSystemFont, system-ui, sans-serif !important;
    font-size: 0.875rem !important;
    font-weight: 700 !important;
    background: #FFD600 !important;
    color: #0f0f0f !important;
    border: none !important;
    border-radius: 999px !important;
    padding: 0.875rem 2rem !important;
    letter-spacing: 0.05em !important;
    text-transform: uppercase !important;
  }
  .sector-cta-form-box .hs-form .legal-consent-container,
  .sector-cta-form-box .hs-form .hs-legal,
  .sector-cta-form-box .hs-form .hs-richtext.hs-legal {
    font-family: 'Melody', -apple-system, BlinkMacSystemFont, system-ui, sans-serif !important;
    font-size: 0.7rem !important;
    color: #6b6760 !important;
  }
`

function injectOverrides() {
  let style = document.getElementById(HUBSPOT_OVERRIDES_ID) as HTMLStyleElement | null
  if (!style) {
    style = document.createElement('style')
    style.id = HUBSPOT_OVERRIDES_ID
    style.textContent = OVERRIDE_CSS
    document.head.appendChild(style)
  } else {
    style.textContent = OVERRIDE_CSS
    document.head.appendChild(style)
  }
}

/**
 * Uses MutationObserver to inject Dome styling after HubSpot injects its form
 * and styles, so our !important rules win. Hides default header, sets DM Sans,
 * #FFD600 submit button, #e0dbd0 input borders.
 */
export default function HubSpotFormOverrides() {
  useEffect(() => {
    if (typeof document === 'undefined') return

    const formBox = document.querySelector('.sector-cta-form-box')
    if (!formBox) return

    function maybeInject() {
      if (!formBox) return
      const hasHsForm = formBox.querySelector('.hs-form')
      if (hasHsForm) {
        injectOverrides()
      }
    }

    maybeInject()

    const observer = new MutationObserver(() => {
      maybeInject()
    })

    observer.observe(formBox, { childList: true, subtree: true })

    const t = setTimeout(maybeInject, 500)
    const t2 = setTimeout(maybeInject, 2000)

    return () => {
      clearTimeout(t)
      clearTimeout(t2)
      observer.disconnect()
      const el = document.getElementById(HUBSPOT_OVERRIDES_ID)
      if (el) el.remove()
    }
  }, [])

  return null
}
