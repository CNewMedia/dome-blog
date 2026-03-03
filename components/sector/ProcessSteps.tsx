import { PROCESS_STEPS } from '../../lib/constants'

export default function ProcessSteps() {
  return (
    <section className="sector-process-wrap">
      <div className="sector-process-in">
        <div className="sector-eyebrow">Het proces</div>
        <h2 className="sector-section-title">Van intake tot verkoop in 6 weken</h2>
        <div className="sector-process-grid">
          {PROCESS_STEPS.map((item) => (
            <div key={item.step} className="sector-process-step">
              <div className="sector-process-step-title">{item.title}</div>
              <p className="sector-process-step-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
