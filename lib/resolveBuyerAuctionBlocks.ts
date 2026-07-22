export type BuyerAuctionBlockItem = {
  title?: string | null
  subtitle?: string | null
  href?: string | null
  frameStyle?: 'none' | 'black' | 'yellow' | string | null
  image?: { asset?: { _ref?: string; _id?: string; url?: string }; alt?: string } | null
}

export type BuyerRelevantAuctionItem = {
  title?: string | null
  href?: string | null
  image?: { asset?: { _ref?: string; _id?: string; url?: string }; alt?: string } | null
}

export type BuyerAuctionBlocksRaw = {
  current?: BuyerAuctionBlockItem | null
  future?: BuyerAuctionBlockItem | null
  relevantHeading?: string | null
  relevant?: BuyerRelevantAuctionItem[] | null
  /** @deprecated legacy — removed after migration */
  past?: BuyerAuctionBlockItem | null
  /** @deprecated legacy */
  running?: BuyerAuctionBlockItem | null
}

export type ResolvedMainAuctionBlock = {
  key: 'current' | 'future'
  block: BuyerAuctionBlockItem
}

function hasTitle(block: BuyerAuctionBlockItem | null | undefined): block is BuyerAuctionBlockItem {
  return Boolean(block?.title && block.title.trim().length > 0)
}

function pickBlock(
  primary: BuyerAuctionBlockItem | null | undefined,
  legacy: BuyerAuctionBlockItem | null | undefined
): BuyerAuctionBlockItem | null {
  if (hasTitle(primary)) return primary
  if (hasTitle(legacy)) return legacy
  return null
}

export function resolveMainAuctionBlocks(
  auctionBlocks: BuyerAuctionBlocksRaw | null | undefined
): ResolvedMainAuctionBlock[] {
  if (!auctionBlocks) return []

  const items: ResolvedMainAuctionBlock[] = []
  const current = pickBlock(auctionBlocks.current, auctionBlocks.running)
  const future = pickBlock(auctionBlocks.future, null)

  if (current) items.push({ key: 'current', block: current })
  if (future) items.push({ key: 'future', block: future })

  return items
}

export function resolveRelevantAuctions(
  auctionBlocks: BuyerAuctionBlocksRaw | null | undefined
): BuyerRelevantAuctionItem[] {
  if (!auctionBlocks) return []

  const fromArray = (auctionBlocks.relevant ?? []).filter(
    (item): item is BuyerRelevantAuctionItem =>
      Boolean(item?.title && item.title.trim().length > 0)
  )

  if (fromArray.length > 0) return fromArray.slice(0, 2)

  if (hasTitle(auctionBlocks.past)) {
    return [
      {
        title: auctionBlocks.past.title,
        href: auctionBlocks.past.href,
        image: auctionBlocks.past.image,
      },
    ]
  }

  return []
}

export function resolveRelevantHeading(
  auctionBlocks: BuyerAuctionBlocksRaw | null | undefined,
  fallback: string
): string {
  const heading = auctionBlocks?.relevantHeading?.trim()
  return heading || fallback
}
