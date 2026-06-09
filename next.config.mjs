import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Inlines SANITY_STUDIO_* into client bundles (embedded Studio) at build time.
  env: {
    SANITY_STUDIO_PREVIEW_SECRET: process.env.SANITY_STUDIO_PREVIEW_SECRET,
  },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'cdn.dome-auctions.com' },
    ],
  },

}

export default withNextIntl(nextConfig)
