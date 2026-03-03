import PortableText from '../PortableText'

type ContentBlockProps = {
  content: unknown[]
}

export default function ContentBlock({ content }: ContentBlockProps) {
  if (!content?.length) return null
  return (
    <section className="sector-content-wrap">
      <div className="sector-content">
        <PortableText value={content} />
      </div>
    </section>
  )
}
