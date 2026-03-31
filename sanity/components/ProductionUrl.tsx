import { useMemo } from 'react'
import { Card, Stack, Text, Button, Inline, Code } from '@sanity/ui'
import { LaunchIcon, CopyIcon } from '@sanity/icons'
import { resolvePreviewUrl, resolveProductionUrl } from '../resolveProductionUrl'

type DocumentLike = {
  _id?: string
  _type?: string
  locale?: string
  slug?: { current?: string }
  sector?: string
}

type ProductionUrlProps = {
  document?: { displayed?: DocumentLike }
}

export function ProductionUrl(props: ProductionUrlProps) {
  const doc = props.document?.displayed
  const url = useMemo(() => resolveProductionUrl(doc), [doc])
  const previewUrl = useMemo(() => resolvePreviewUrl(doc), [doc])

  if (!doc?._type) {
    return (
      <Card padding={4}>
        <Text size={1}>Document not loaded yet.</Text>
      </Card>
    )
  }

  const supportedTypes = ['sectorPage', 'buyerPage', 'post']
  if (!supportedTypes.includes(doc._type)) {
    return (
      <Card padding={4}>
        <Text size={1}>Production URL is only defined for sectorPage, buyerPage and post documents.</Text>
      </Card>
    )
  }

  if (!url) {
    return (
      <Card padding={4}>
        <Stack space={3}>
          <Text size={1} weight="semibold">
            Final URL
          </Text>
          <Text size={1}>
            Fill in <Code>locale</Code> and <Code>slug</Code> (and for legacy sector pages optionally <Code>sector</Code>)
            to see the final frontend URL.
          </Text>
        </Stack>
      </Card>
    )
  }

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url).catch(() => {
        // ignore clipboard errors; editor can still select manually
      })
    }
  }

  return (
    <Card padding={4}>
      <Stack space={3}>
        <Text size={1} weight="semibold">
          Final frontend URL
        </Text>
        <Code style={{ wordBreak: 'break-all' }}>{url}</Code>
        <Inline space={2}>
          <Button
            as="a"
            href={url}
            target="_blank"
            rel="noreferrer"
            icon={LaunchIcon}
            text="Open live page"
            mode="bleed"
          />
          <Button icon={CopyIcon} text="Copy URL" mode="bleed" onClick={handleCopy} />
          {previewUrl ? (
            <Button
              as="a"
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              icon={LaunchIcon}
              text="Open preview"
              mode="bleed"
              tone="primary"
            />
          ) : (
            <Text size={0} muted>
              Set <Code>SANITY_STUDIO_PREVIEW_SECRET</Code> to enable Open preview.
            </Text>
          )}
        </Inline>
        <Text size={0} muted>
          URL is derived from document type, locale and slug, using the current Next.js routing.
        </Text>
      </Stack>
    </Card>
  )
}

