# Dome Auctions Blog

Next.js 14 + Sanity v3 blog platform met meertalige ondersteuning.

## Talen
- `nl-be` — Nederlands (België)
- `fr-be` — Frans (België)
- `en` — Engels
- `de` — Duits

## Lokaal starten

```bash
npm install
npm run dev
```

- Blog: http://localhost:3000/en/blog
- Sanity Studio: http://localhost:3000/studio

## Deploy op Vercel

1. Push naar GitHub
2. Importeer project op vercel.com
3. Voeg environment variables toe:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` = `r1yazroc`
   - `NEXT_PUBLIC_SANITY_DATASET` = `production`
4. Deploy

## Sanity Studio CORS instellen

Ga naar https://sanity.io/manage → Dome-Auctions → API → CORS Origins
Voeg toe: `https://jouw-domein.vercel.app`

## Subdomain instellen (na deploy)

In Vercel: Settings → Domains → voeg `blog.dome-auctions.com` toe
Bij DNS-provider van dome-auctions.com: CNAME `blog` → `cname.vercel-dns.com`
