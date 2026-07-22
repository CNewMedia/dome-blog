'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { BuyerAuctionBlockItem } from '../../lib/resolveBuyerAuctionBlocks'
import { sanityImageUrl } from '../../lib/buyerSanityImage'

export type MainAuctionBlockKey = 'current' | 'future'

type Props = {
  blockKey: MainAuctionBlockKey
  block: BuyerAuctionBlockItem
  statusLabel: string
  viewLabel: string
}

export default function BuyerMainAuctionCard({ blockKey, block, statusLabel, viewLabel }: Props) {
  const title = block.title?.trim() || ''
  const subtitle = block.subtitle?.trim()
  const blockHref = block.href?.trim()
  const frameStyle = block.frameStyle === 'black' || block.frameStyle === 'yellow' ? block.frameStyle : blockKey
  const imageSrc = sanityImageUrl(block.image, 960)
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(imageSrc && !imageFailed)

  const cardClass = [
    'buyer-main-auction-card',
    `buyer-main-auction-card--${blockKey}`,
    `buyer-main-auction-card--frame-${frameStyle}`,
    blockHref ? 'buyer-main-auction-card--link' : '',
    showImage ? 'buyer-main-auction-card--has-image' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const cardBody = (
    <>
      {showImage && (
        <div className="buyer-main-auction-card-media">
          <Image
            src={imageSrc!}
            alt={block.image?.alt || title}
            fill
            sizes="(max-width: 960px) 100vw, 50vw"
            className="buyer-main-auction-card-image"
            onError={() => setImageFailed(true)}
          />
        </div>
      )}
      <div className="buyer-main-auction-card-content">
        <div className={`buyer-main-auction-card-status buyer-main-auction-card-status--${blockKey}`}>
          <span className="buyer-main-auction-card-status-label">{statusLabel}</span>
        </div>
        <h3 className="buyer-main-auction-card-title">{title}</h3>
        {subtitle && <p className="buyer-main-auction-card-sub">{subtitle}</p>}
        {blockHref && (
          <span className="buyer-main-auction-card-view">
            {viewLabel}
            <span aria-hidden="true"> →</span>
          </span>
        )}
      </div>
    </>
  )

  if (blockHref) {
    return (
      <a href={blockHref} className={cardClass} target="_blank" rel="noopener noreferrer">
        {cardBody}
      </a>
    )
  }

  return <article className={cardClass}>{cardBody}</article>
}
