import HubSpotForm from '../HubSpotForm'
import HubSpotFormOverrides from '../HubSpotFormOverrides'
import { BRAND } from '../../lib/constants'

type ContactFormProps = {
  formId: string | null | undefined
  title?: string | null
  subtitle?: string | null
  eyebrow?: string | null
}

export default function ContactForm({
  formId,
  title,
  subtitle,
  eyebrow,
}: ContactFormProps) {
  const eyebrowText = eyebrow ?? 'Contact'
  const subtitleText = subtitle ?? 'Laat uw gegevens achter en we nemen binnen één werkdag contact op. Geen verplichtingen.'
  return (
    <section className="sector-cta-wrap" id="cta-form">
      <div className="sector-cta-grid">
        <div>
          <div className="sector-cta-eyebrow">{eyebrowText}</div>
          {title && <h2 className="sector-cta-title">{title}</h2>}
          <p className="sector-cta-sub">{subtitleText}</p>
        </div>
        <div className="sector-cta-form-box">
          <HubSpotFormOverrides />
          {formId ? (
            <HubSpotForm formId={formId} />
          ) : (
            <p style={{ color: BRAND.muted, fontSize: '0.95rem' }}>
              Configureer een HubSpot formulier in Sanity voor deze sector.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
