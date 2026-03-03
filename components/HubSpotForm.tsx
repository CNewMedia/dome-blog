'use client'

import { useState, useCallback } from 'react'
import { BRAND, FONTS } from '../lib/constants'

const PORTAL_ID = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || '147410570'
const SUBMIT_URL = (formId: string) =>
  `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${formId}`

type FormState = 'idle' | 'submitting' | 'success' | 'error'

const DEFAULT_FIELDS = [
  { name: 'firstname', label: 'Voornaam', type: 'text', required: false },
  { name: 'lastname', label: 'Achternaam', type: 'text', required: false },
  { name: 'email', label: 'E-mail', type: 'email', required: true },
  { name: 'phone', label: 'Telefoon', type: 'tel', required: false },
  { name: 'company', label: 'Bedrijf', type: 'text', required: false },
  { name: 'message', label: 'Bericht', type: 'textarea', required: false },
] as const

export default function HubSpotForm({ formId }: { formId: string }) {
  const [state, setState] = useState<FormState>('idle')
  const [values, setValues] = useState<Record<string, string>>({})
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleChange = useCallback((name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    if (state === 'error') {
      setState('idle')
      setErrorMessage('')
    }
  }, [state])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!formId) return

      const email = values.email?.trim()
      if (!email) {
        setState('error')
        setErrorMessage('Vul uw e-mailadres in.')
        return
      }

      setState('submitting')
      setErrorMessage('')

      const fields = Object.entries(values)
        .filter(([, v]) => v != null && String(v).trim() !== '')
        .map(([name, value]) => ({ name, value: String(value).trim() }))

      try {
        const res = await fetch(SUBMIT_URL(formId), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields,
            context: {
              pageUri: typeof window !== 'undefined' ? window.location.href : '',
              pageName: typeof document !== 'undefined' ? document.title : 'Sector page',
            },
          }),
        })

        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || `HTTP ${res.status}`)
        }
        setState('success')
        setValues({})
      } catch (err) {
        setState('error')
        setErrorMessage(err instanceof Error ? err.message : 'Verzenden mislukt. Probeer later opnieuw.')
      }
    },
    [formId, values]
  )

  if (state === 'success') {
    return (
      <div className="hubspot-dome-form">
        <style>{domeFormStyles}</style>
        <div className="hubspot-success">
          <div className="hubspot-success-icon" aria-hidden>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h3 className="hubspot-success-title">Bedankt</h3>
          <p className="hubspot-success-text">
            We hebben uw bericht ontvangen en nemen binnen één werkdag contact met u op.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="hubspot-dome-form" style={{ fontFamily: FONTS.sans }}>
      <style>{domeFormStyles}</style>
      <form onSubmit={handleSubmit} className="hubspot-custom-form">
        <div className="hubspot-fields">
          {DEFAULT_FIELDS.map((field) => (
            <div key={field.name} className="hubspot-field">
              <label htmlFor={`hubspot-${field.name}`} className="hubspot-label">
                {field.label}
                {field.required && <span className="hubspot-required"> *</span>}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  id={`hubspot-${field.name}`}
                  name={field.name}
                  value={values[field.name] ?? ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="hubspot-input hubspot-textarea"
                  rows={4}
                  required={field.required}
                  disabled={state === 'submitting'}
                />
              ) : (
                <input
                  id={`hubspot-${field.name}`}
                  name={field.name}
                  type={field.type}
                  value={values[field.name] ?? ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="hubspot-input"
                  required={field.required}
                  disabled={state === 'submitting'}
                />
              )}
            </div>
          ))}
        </div>
        {state === 'error' && errorMessage && (
          <p className="hubspot-error" role="alert">
            {errorMessage}
          </p>
        )}
        <button type="submit" className="hubspot-submit" disabled={state === 'submitting'}>
          {state === 'submitting' ? 'Versturen…' : 'Versturen'}
        </button>
        <p className="hubspot-legal">
          Door te versturen gaat u akkoord met ons{' '}
          <a href="https://dome-auctions.com/privacy/" target="_blank" rel="noopener noreferrer">privacybeleid</a>.
          We gebruiken uw gegevens alleen om contact op te nemen.
        </p>
      </form>
    </div>
  )
}

/* Dome brand: native look — fonts (DM Sans), borders #e8e6e2, button #FFD600 black text, no HubSpot header */
const domeFormStyles = `
  .hubspot-dome-form { font-family: ${FONTS.sans}; }
  .hubspot-dome-form * { box-sizing: border-box; }
  .hubspot-custom-form { max-width: 100%; }
  .hubspot-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem 1.5rem; margin-bottom: 1.5rem; }
  .hubspot-field:first-of-type { grid-column: 1; }
  .hubspot-field:nth-of-type(2) { grid-column: 2; }
  .hubspot-field:nth-of-type(3),
  .hubspot-field:nth-of-type(4),
  .hubspot-field:nth-of-type(5) { grid-column: span 1; }
  .hubspot-field:nth-of-type(6) { grid-column: 1 / -1; }
  .hubspot-label { display: block; font-size: 0.8rem; font-weight: 600; color: ${BRAND.black}; margin-bottom: 0.4rem; letter-spacing: 0.02em; font-family: ${FONTS.sans}; }
  .hubspot-required { color: ${BRAND.goldAccent}; }
  .hubspot-input, .hubspot-textarea { width: 100%; padding: 0.75rem 1rem; font-size: 0.9375rem; color: ${BRAND.black}; background: ${BRAND.white}; border: 1.5px solid ${BRAND.formBorder}; border-radius: 8px; font-family: ${FONTS.sans}; transition: border-color 0.2s, box-shadow 0.2s; }
  .hubspot-input:focus, .hubspot-textarea:focus { outline: none; border-color: ${BRAND.goldAccent}; box-shadow: 0 0 0 3px rgba(200,168,75,0.2); }
  .hubspot-input::placeholder, .hubspot-textarea::placeholder { color: ${BRAND.muted}; }
  .hubspot-input:disabled, .hubspot-textarea:disabled { opacity: 0.7; cursor: not-allowed; }
  .hubspot-textarea { resize: vertical; min-height: 100px; }
  .hubspot-error { font-size: 0.875rem; color: ${BRAND.error}; margin-bottom: 1rem; font-family: ${FONTS.sans}; }
  .hubspot-submit { display: inline-flex; align-items: center; justify-content: center; padding: 0.875rem 2rem; font-size: 0.875rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: ${BRAND.black}; background: #FFD600; border: none; border-radius: 999px; cursor: pointer; font-family: ${FONTS.sans}; transition: background 0.2s, transform 0.2s; }
  .hubspot-submit:hover:not(:disabled) { background: #e6c200; transform: translateY(-1px); }
  .hubspot-submit:disabled { opacity: 0.8; cursor: not-allowed; transform: none; }
  .hubspot-legal { font-size: 0.7rem; color: ${BRAND.muted}; line-height: 1.45; margin-top: 1rem; opacity: 0.9; }
  .hubspot-legal a { color: ${BRAND.goldAccent}; text-decoration: underline; text-underline-offset: 2px; }
  .hubspot-legal a:hover { color: ${BRAND.gold}; }
  .hubspot-success { text-align: center; padding: 2.5rem 1.5rem; background: ${BRAND.offWhite}; border: 1.5px solid ${BRAND.formBorder}; border-radius: 12px; }
  .hubspot-success-icon { width: 64px; height: 64px; margin: 0 auto 1.25rem; display: flex; align-items: center; justify-content: center; background: #FFD600; color: ${BRAND.black}; border-radius: 50%; }
  .hubspot-success-title { font-family: ${FONTS.serif}; font-size: 1.75rem; font-weight: 400; color: ${BRAND.black}; margin-bottom: 0.5rem; }
  .hubspot-success-text { font-size: 0.9375rem; color: ${BRAND.muted}; line-height: 1.6; margin: 0; font-family: ${FONTS.sans}; }
  .hubspot-dome-form .hubspot-recaptcha-wrap { margin-top: 0.75rem; }
  .hubspot-dome-form .grecaptcha-badge { opacity: 0.85; transform: scale(0.9); }
  @media (max-width: 600px) { .hubspot-fields { grid-template-columns: 1fr; } .hubspot-field:nth-of-type(2) { grid-column: 1; } }
`
