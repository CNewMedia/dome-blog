# Cloudinary setup voor Sanity Studio

Dit project gebruikt **sanity-plugin-cloudinary** om afbeeldingen (en video’s) via Cloudinary te beheren en in content te gebruiken. Afbeeldingen worden opgeslagen in Cloudinary en afgeleverd via het Cloudinary CDN.

---

## 1. Cloudinary-account aanmaken

1. Ga naar **[cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)**.
2. Registreer met e-mail of via Google/GitHub.
3. Bevestig je e-mail indien nodig.
4. Je komt op het **Dashboard** van je Cloudinary-account.

---

## 2. Credentials vinden

1. Log in op **[cloudinary.com/console](https://cloudinary.com/console)**.
2. Op het **Dashboard** zie je direct je **Cloud name** (bijv. `dxxxxxx`).
3. Ga naar **Settings** (tandwiel) → **Product environment** → **API Keys** (of via het menu **API Keys**).
4. Noteer:
   - **Cloud name** – o.a. voor URLs en de Media Library.
   - **API Key** – mag in client-side code gebruikt worden.
   - **API Secret** – alleen voor server-side; **niet** in frontend of in git zetten.

Op dezelfde plek kun je later ook **Allowed fetch domains** en andere opties instellen als je dat nodig hebt.

---

## 3. Cloudinary koppelen in Sanity Studio

De plugin slaat je Cloudinary-gegevens **veilig in je Sanity-dataset** op (o.a. via `@sanity/studio-secrets` voor het API secret).

1. Start je project lokaal en open Sanity Studio (bijv. `http://localhost:3000/studio`).
2. Open een document dat een **Cloudinary-veld** heeft (type `cloudinary.asset`), of maak er een aan (zie hieronder).
3. Bij het eerste gebruik van een Cloudinary-veld:
   - Er wordt gevraagd om **Cloudinary te configureren**.
   - Vul je **Cloud name** en **API Key** in (en waar gevraagd het **API Secret**).
   - Bevestig; de plugin slaat dit op voor je project/dataset.
4. Daarna opent de **Cloudinary Media Library**-widget: je kunt daar bladeren, zoeken, uploaden en een asset kiezen. Die wordt dan in het Sanity-veld opgeslagen.

Er is geen aparte “Cloudinary”-pagina in de sidebar: de koppeling gebeurt via het invullen van de credentials wanneer je voor het eerst een Cloudinary-veld gebruikt.

---

## 4. Cloudinary-veld in een schema gebruiken

Er is een herbruikbare helper in `sanity/schemas/cloudinaryImage.ts`:

```ts
import { cloudinaryImageField } from './cloudinaryImage'

// In je schema fields:
cloudinaryImageField('coverImage', 'Cover image'),
cloudinaryImageField('logo', 'Logo', { required: true }),
cloudinaryImageField('heroImage', 'Hero', { description: 'Gebruik 16:9 voor hero.' }),
```

Of handmatig het type `cloudinary.asset` gebruiken:

```ts
defineField({
  name: 'myImage',
  title: 'My image',
  type: 'cloudinary.asset',
})
```

Na opslaan en herladen van Studio zie je in dat document het Cloudinary-veld; daar kun je de account koppelen (stap 3) en daarna assets kiezen.

---

## 5. Afbeeldingen tonen op de site (Next.js)

Data van een `cloudinary.asset`-veld ziet er ongeveer zo uit:

- `public_id`, `secure_url`, `url`, `resource_type`, `derived`, enz.

Voor een eenvoudige afbeelding gebruik je bijv. `secure_url` of de eerste `derived[].secure_url` (als je transformaties gebruikt). Voorbeeld:

```ts
// Voorbeeld: sectorPage met optioneel cloudinaryHeroImage
const imageUrl = data.cloudinaryHeroImage?.derived?.[0]?.secure_url
  ?? data.cloudinaryHeroImage?.secure_url
  ?? null
```

Voor transformaties (resize, crop, format) kun je Cloudinary URL-API gebruiken met `public_id` en je **cloud name** (bijv. via `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` als je die in de frontend nodig hebt).

---

## 6. Handige links

- [Cloudinary Dashboard](https://cloudinary.com/console)
- [Waar vind ik API key en secret?](https://cloudinary.com/documentation/developer_onboarding_faq_find_credentials)
- [Sanity-plugin Cloudinary (npm)](https://www.npmjs.com/package/sanity-plugin-cloudinary)
