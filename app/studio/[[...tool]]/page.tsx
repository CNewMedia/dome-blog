export const dynamic = 'force-dynamic'

export default function StudioPage() {
  if (typeof window === 'undefined') return null
  const { NextStudio } = require('next-sanity/studio')
  const config = require('../../../sanity.config').default
  return <NextStudio config={config} />
}
