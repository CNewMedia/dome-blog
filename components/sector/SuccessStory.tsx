type SuccessStoryProps = {
  quote?: string | null
  company?: string | null
  result?: string | null
}

export default function SuccessStory({ quote, company, result }: SuccessStoryProps) {
  if (!quote && !company) return null
  return (
    <section className="sector-success">
      <div className="sector-success-in">
        {quote && <blockquote className="sector-success-quote">"{quote}"</blockquote>}
        {company && <div className="sector-success-company">{company}</div>}
        {result && <div className="sector-success-result">{result}</div>}
      </div>
    </section>
  )
}
