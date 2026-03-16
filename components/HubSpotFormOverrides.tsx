'use client'

import { useEffect } from 'react'

const HUBSPOT_OVERRIDES_ID = 'hubspot-dome-form-overrides'

const OVERRIDE_CSS = `
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

  /* Submit button + actions wrapper: force brand styling over HubSpot defaults */
  .sector-cta-form-box .hs-form .actions,
  .sector-cta-form-box .hs-form .hs_submit,
  .sector-cta-form-box .hs-form .hs-submit {
    margin-top: 1.5rem !important;
    display: flex !important;
    align-items: center !important;
  }

  .sector-cta-form-box .hs-form .actions .hs-button,
  .sector-cta-form-box .hs-form .hs_submit .hs-button,
  .sector-cta-form-box .hs-form .hs-submit .hs-button,
  .sector-cta-form-box .hs-form .actions input[type="submit"],
  .sector-cta-form-box .hs-form .actions button[type="submit"],
  .sector-cta-form-box .hs-form .hs_submit input[type="submit"],
  .sector-cta-form-box .hs-form .hs_submit button[type="submit"],
  .sector-cta-form-box .hs-form .hs-submit input[type="submit"],
  .sector-cta-form-box .hs-form .hs-submit button[type="submit"],
  .sector-cta-form-box .hs-form input[type="submit"],
  .sector-cta-form-box .hs-form button[type="submit"],
  .sector-cta-form-box .hs-form .hs-button,
  .sector-cta-form-box .hs-form input[type="submit"].primary {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    white-space: nowrap !important;
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
    box-shadow: none !important;
    outline: none !important;
    -webkit-appearance: none !important;
    appearance: none !important;
    width: auto !important;
    min-width: 0 !important;
    max-width: 100% !important;
  }

  .sector-cta-form-box .hs-form .actions .hs-button:hover,
  .sector-cta-form-box .hs-form .hs_submit .hs-button:hover,
  .sector-cta-form-box .hs-form .hs-submit .hs-button:hover,
  .sector-cta-form-box .hs-form .actions input[type="submit"]:hover,
  .sector-cta-form-box .hs-form .actions button[type="submit"]:hover,
  .sector-cta-form-box .hs-form .hs-button:hover,
  .sector-cta-form-box .hs-form input[type="submit"]:hover,
  .sector-cta-form-box .hs-form button[type="submit"]:hover {
    background: #e6c200 !important;
    transform: translateY(-1px) !important;
  }

  .sector-cta-form-box .hs-form .legal-consent-container,
  .sector-cta-form-box .hs-form .hs-legal,
  .sector-cta-form-box .hs-form .hs-richtext.hs-legal {
    font-family: 'Melody', -apple-system, BlinkMacSystemFont, system-ui, sans-serif !important;
    font-size: 0.7rem !important;
    color: #6b6760 !important;
  }

  .sector-cta-form-box .hs-error-msg,
  .sector-cta-form-box .hs-form .hs-error-msgs {
    font-size: 0.8rem !important;
    color: #c0392b !important;
    margin-top: 0.25rem !important;
    font-family: 'Melody', -apple-system, BlinkMacSystemFont, system-ui, sans-serif !important;
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
