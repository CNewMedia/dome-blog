import { PROCESS_STEPS } from '../../lib/constants'
import type { ProcessSection } from './types'

type ProcessStepsProps = {
  processSection?: ProcessSection | null
}

export default function ProcessSteps({ processSection }: ProcessStepsProps) {
  const visible = processSection?.isVisible !== false
  const eyebrow = processSection?.eyebrow ?? 'Het proces'
  const title = processSection?.title ?? 'Van intake tot verkoop in 6 weken'
  const steps = processSection?.steps?.length ? processSection.steps : PROCESS_STEPS.map((s) => ({ title: s.title, description: s.description }))
  if (!visible || !steps?.length) return null
  return (
    <section className="sector-process-wrap">
      <div className="sector-process-in">
        {eyebrow && <div className="sector-eyebrow">{eyebrow}</div>}
        {title && <h2 className="sector-section-title">{title}</h2>}
        <div className="sector-process-grid">
          {steps.map((item, i) => (
            <div key={i} className="sector-process-step">
              <div className="sector-process-step-title">{item.title}</div>
              {item.description && <p className="sector-process-step-desc">{item.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
