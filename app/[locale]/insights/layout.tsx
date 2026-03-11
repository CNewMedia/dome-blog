import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

type Props = { children: React.ReactNode }

export default function InsightsLayout({ children }: Props) {
  return (
    <div className={`${inter.className} insights-root`} style={{ fontStyle: 'normal' }}>
      <style>{`
        .insights-root, .insights-root * { font-family: inherit !important; }
        .insights-root i, .insights-root em, .insights-root cite, .insights-root blockquote { font-style: normal !important; }
      `}</style>
      {children}
    </div>
  )
}
