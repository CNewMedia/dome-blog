import { COMPANY } from '../../lib/constants'

export default function Footer() {
  return (
    <footer className="sector-footer">
      <div className="sector-footer-in">
        <div className="sector-footer-logo">{COMPANY.name}</div>
        <p className="sector-footer-tagline">{COMPANY.tagline}</p>
        <p className="sector-footer-location">{COMPANY.location}</p>
      </div>
    </footer>
  )
}
