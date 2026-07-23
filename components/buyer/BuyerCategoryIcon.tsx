export type BuyerCategoryIconName = 'tractor' | 'excavator' | 'forklift' | 'agriculture' | 'truck'

const ICON_ORDER: BuyerCategoryIconName[] = ['excavator', 'tractor', 'forklift', 'truck', 'agriculture']

function normalizeLabel(label: string): string {
  return label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function resolveCategoryIconName(label: string, index = 0): BuyerCategoryIconName {
  const n = normalizeLabel(label)

  if (
    /excav|graaf|digger|pelleteuse|bagger|kopark|ekskavat|rypadl|bager|kopac|ekskavator/.test(n)
  ) {
    return 'excavator'
  }
  if (/fork|hef|lift|chariot|gabelstapler|wozek|vill|emel|stacker|platform/.test(n)) {
    return 'forklift'
  }
  if (/tract|landbouw|agric|farm|tracteur|traktor|rolnic|mezőgazd|agricol/.test(n)) {
    return 'tractor'
  }
  if (/truck|vracht|transport|trailer|trekker|lkw|camion|tir|kamion|ciężar|teheraut|lkv/.test(n)) {
    return 'truck'
  }
  if (/bulldoz|compactor|wiellader|loader|kraan|crane|grader|shovel/.test(n)) {
    return 'excavator'
  }

  return ICON_ORDER[index % ICON_ORDER.length]
}

function IconPaths({ name }: { name: BuyerCategoryIconName }) {
  switch (name) {
    case 'tractor':
      return (
        <>
          <circle cx="7" cy="17" r="2.25" />
          <circle cx="17" cy="17" r="2.25" />
          <path d="M5 17h14M9 17V11h4l2 3h2M9 11V8h3l2 2" />
          <path d="M6 8h3v3" />
        </>
      )
    case 'excavator':
      return (
        <>
          <circle cx="7" cy="18" r="2" />
          <circle cx="16" cy="18" r="2" />
          <path d="M5 18h11M8 18V12h2l5-4 2 2-3 3h2v5" />
          <path d="M17 7l2-2" />
        </>
      )
    case 'forklift':
      return (
        <>
          <circle cx="8" cy="18" r="2" />
          <circle cx="15" cy="18" r="2" />
          <path d="M6 18h9M10 18V10h2v8M12 10V5M12 5h4M12 8h3" />
        </>
      )
    case 'agriculture':
      return (
        <>
          <path d="M4 18h16M7 18V10l5-4 5 4v8" />
          <path d="M9 10h6M12 6V4" />
          <path d="M6 14h12" />
        </>
      )
    case 'truck':
      return (
        <>
          <circle cx="8" cy="17" r="2" />
          <circle cx="17" cy="17" r="2" />
          <path d="M3 17h14M6 17V11h6l3 3v3M12 11V8h3l2 3" />
        </>
      )
  }
}

export default function BuyerCategoryIcon({
  label,
  index = 0,
  className,
}: {
  label: string
  index?: number
  className?: string
}) {
  const name = resolveCategoryIconName(label, index)

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <IconPaths name={name} />
    </svg>
  )
}
