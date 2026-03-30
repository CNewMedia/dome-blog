import localFont from 'next/font/local'

/**
 * Sitewide BL Melody (sans) — files live in src/fonts/ only; paths stay centralized here.
 *
 * Rollback appearance: NEXT_PUBLIC_BRAND_FONT_DISABLED=1 in app/[locale]/layout.tsx
 * (skips --font-brand on :root). Full removal = revert commit or drop this import.
 *
 * Mono (BLMelodyMono-Bold) is not loaded here — add a second localFont export when needed.
 */
export const brandFont = localFont({
  src: [
    {
      path: '../src/fonts/BLMelody-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../src/fonts/BLMelody-Book.otf',
      weight: '350',
      style: 'normal',
    },
    {
      path: '../src/fonts/BLMelody-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../src/fonts/BLMelody-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../src/fonts/BLMelody-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-brand',
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'system-ui',
    'Segoe UI',
    'sans-serif',
  ],
  adjustFontFallback: 'Arial',
})
