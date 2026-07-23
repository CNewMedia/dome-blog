'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { BuyerRelevantAuctionItem } from '../../lib/resolveBuyerAuctionBlocks'
import { sanityImageUrl } from '../../lib/buyerSanityImage'

type Props = {
  item: BuyerRelevantAuctionItem
  viewLabel: string
}

export default function BuyerRelevantAuctionCard({ item, viewLabel }: Props) {
  const title = item.title?.trim() || ''
  const href = item.href?.trim()
  const imageSrc = sanityImageUrl(item.image, 640)
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(imageSrc && !imageFailed)

  const cardClass = `buyer-relevant-auction-card${href ? ' buyer-relevant-auction-card--link' : ''}${
    showImage ? ' buyer-relevant-auction-card--has-image' : ''
  }`

  const cardBody = (
    <>
      {showImage && (
        <div className="buyer-relevant-auction-card-media">
          <Image
            src={imageSrc!}
            alt={item.image?.alt || title}
            fill
            sizes="(max-width: 960px) 100vw, 50vw"
            className="buyer-relevant-auction-card-image"
            onError={() => setImageFailed(true)}
          />
        </div>
      )}
      <div className="buyer-relevant-auction-card-body">
        <h3 className="buyer-relevant-auction-card-title">{title}</h3>
        {href && (
          <span className="buyer-relevant-auction-card-view">
            {viewLabel}
            <span aria-hidden="true"> →</span>
          </span>
        )}
      </div>
    </>
  )

  if (href) {
    return (
      <a href={href} className={cardClass} target="_blank" rel="noopener noreferrer">
        {cardBody}
      </a>
    )
  }

  return <article className={cardClass}>{cardBody}</article>
}
