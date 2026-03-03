import Image from 'next/image'
import PortableText from '../PortableText'
import { urlFor } from '../../sanity/client'

type ContentBlockProps = {
  content: unknown[]
  image?: { asset?: { _ref?: string }; alt?: string } | null
}

export default function ContentBlock({ content, image }: ContentBlockProps) {
  const hasContent = Array.isArray(content) && content.length > 0
  if (!hasContent && !image) return null

  return (
    <section className="sector-content-wrap">
      <div
        className={`sector-content-inner${image && hasContent ? ' sector-content-with-image' : ''}`}
      >
        {hasContent && (
          <div className="sector-content">
            <PortableText value={content} />
          </div>
        )}
        {image && (
          <div className="sector-content-image-wrap">
            <Image
              src={urlFor(image).width(560).height(400).fit('crop').url()}
              alt={image.alt || ''}
              width={560}
              height={400}
              className="sector-content-image"
            />
          </div>
        )}
      </div>
    </section>
  )
}
