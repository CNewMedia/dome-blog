/**
 * Dome Auctions — design tokens and fixed content for sector landing pages.
 * One source of truth: change here, all 5 sector pages update.
 */

export const BRAND = {
  /** Primary black */
  black: '#0f0f0f',
  /** Primary gold / yellow */
  gold: '#FFD600',
  /** Gold accent (darker) */
  goldAccent: '#c8a84b',
  white: '#ffffff',
  /** Background off-white */
  offWhite: '#f7f6f4',
  /** Dark sections */
  charcoal: '#1a1918',
  muted: '#6b6760',
  border: '#e0dbd0',
  /** Form input borders (Dome native look) */
  formBorder: '#e8e6e2',
  error: '#c53030',
} as const

export const FONTS = {
  sans: "'Melody', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
  serif: "'Melody', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
} as const

export const SPACING = {
  section: '5rem',
  sectionSm: '4rem',
  block: '2.5rem',
  blockSm: '1.5rem',
  inline: '1rem',
  inlineSm: '0.5rem',
} as const

export const CONTAINER = {
  maxWidth: '1400px',
  padding: '2.5rem',
  paddingSm: '1.25rem',
} as const

export const RADIUS = {
  card: '14px',
  cardSm: '12px',
  input: '8px',
  pill: '999px',
} as const

/** HubSpot Forms */
export const HUBSPOT = {
  portalId: '147410570',
  region: 'eu1',
} as const

/** Team Belgium — drie vaste teamleden voor sectorpagina's (foto = initialen in cirkel) */
export const TEAM = [
  {
    name: 'Peter Lechat',
    initials: 'PL',
    role: 'Key Account & Commercieel Directeur',
    description:
      "Peter stuurt alle commerciële dossiers aan en is uw eerste contactpersoon voor grotere projecten en bedrijfssluitingen. Met meer dan 20 jaar ervaring kent hij de markt beter dan wie ook.",
  },
  {
    name: 'Wim Miserez',
    initials: 'WM',
    role: 'Account Manager',
    description:
      'Wim begeleidt verkopers van het eerste gesprek tot de uitbetaling. Zijn diepgaande sectorkennis en zijn netwerk van Europese kopers zorgen voor de juiste match tussen machine en koper.',
  },
  {
    name: 'Wouter Vanrysselberghe',
    initials: 'WV',
    role: 'Account Manager',
    description:
      'Wouter is actief in de Belgische markt en legt dagelijks de eerste contacten met industriële ondernemers. Zijn persoonlijke aanpak is de basis van een vlotte samenwerking.',
  },
] as const

/** Stats voor statsbar — 20+ jaar, 1000+ veilingen, 18 landen, 2400+ veilingen/jaar */
export const STATS = [
  { value: '2400+', label: 'Veilingen per jaar' },
  { value: '18', label: 'Landen' },
  { value: '20+', label: 'Jaar ervaring' },
  { value: '1000+', label: 'Verkopers begeleid' },
] as const

/** Processtappen — 6 weken van intake tot verkoop */
export const PROCESS_STEPS = [
  { step: 1, title: 'Intake', description: 'Eerste gesprek en beoordeling van uw machines.' },
  { step: 2, title: 'Beoordeling', description: 'Waardebepaling en voorstel op maat.' },
  { step: 3, title: 'Veiling', description: 'Online veiling in ons Europese netwerk.' },
  { step: 4, title: 'Afhandeling', description: 'Oplevering en betaling. Gemiddeld 6 weken totaal.' },
] as const

export const COMPANY = {
  name: 'Dome Auctions',
  tagline: 'Simplify Industrial Auctions',
  location: 'Esplanade 1 PB48, BE-1020 Brussel. Warehouse in Deinze.',
  promise: 'Wij veilen uw machines alsof het de onze zijn. Geen massa, wel klasse.',
} as const
