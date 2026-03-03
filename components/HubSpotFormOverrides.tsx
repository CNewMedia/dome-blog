'use client'

import { useEffect } from 'react'

const HUBSPOT_OVERRIDES_ID = 'hubspot-dome-form-overrides'

/**
 * Injects CSS after mount so HubSpot embed header ("We'd love to hear from you")
 * is hidden and form uses Dome fonts. Runs once; use with sector-cta-form-box.
 */
export default function HubSpotFormOverrides() {
  useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById(HUBSPOT_OVERRIDES_ID)) return

    const style = document.createElement('style')
    style.id = HUBSPOT_OVERRIDES_ID
    style.textContent = `
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
      .sector-cta-form-box .hs-form label,
      .sector-cta-form-box .hs-form .hs-label,
      .sector-cta-form-box .hs-form .hs-field-desc {
        font-family: var(--sector-font-sans), "DM Sans", sans-serif !important;
      }
      .sector-cta-form-box .hs-form input:not([type="submit"]):not([type="checkbox"]):not([type="radio"]),
      .sector-cta-form-box .hs-form textarea,
      .sector-cta-form-box .hs-form select {
        font-family: var(--sector-font-sans), "DM Sans", sans-serif !important;
        font-size: 0.9375rem !important;
        color: var(--sector-black) !important;
        background: var(--sector-white) !important;
        border: 1.5px solid #e8e6e2 !important;
        border-radius: 8px !important;
        padding: 0.75rem 1rem !important;
      }
      .sector-cta-form-box .hs-form input[type="submit"],
      .sector-cta-form-box .hs-form .hs-button,
      .sector-cta-form-box .hs-form input[type="submit"].primary {
        font-family: var(--sector-font-sans), "DM Sans", sans-serif !important;
        font-size: 0.875rem !important;
        font-weight: 700 !important;
        background: #FFD600 !important;
        color: var(--sector-black) !important;
        border: none !important;
        border-radius: 999px !important;
        padding: 0.875rem 2rem !important;
        letter-spacing: 0.05em !important;
        text-transform: uppercase !important;
      }
      .sector-cta-form-box .hs-form .legal-consent-container,
      .sector-cta-form-box .hs-form .hs-legal,
      .sector-cta-form-box .hs-form .hs-richtext.hs-legal {
        font-family: var(--sector-font-sans), "DM Sans", sans-serif !important;
        font-size: 0.7rem !important;
        color: var(--sector-muted) !important;
      }
    `
    document.head.appendChild(style)
    return () => {
      const el = document.getElementById(HUBSPOT_OVERRIDES_ID)
      if (el) el.remove()
    }
  }, [])
  return null
}
