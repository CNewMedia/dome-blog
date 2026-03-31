/** Maps Sanity `icon` string to a simple inline glyph — mockup reference, not asset pipeline. */
export default function StepIcon({ name }: { name: string }) {
  const n = name.trim().toLowerCase()
  const map: Record<string, string> = {
    bell: '🔔',
    mail: '✉',
    email: '✉',
    chart: '📊',
    search: '🔍',
    shield: '🛡',
    users: '👥',
    check: '✓',
    star: '★',
  }
  if (map[n]) return <span aria-hidden>{map[n]}</span>
  return <span aria-hidden>◆</span>
}
