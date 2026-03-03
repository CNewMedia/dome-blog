import { defineField } from 'sanity'

/**
 * Reusable Cloudinary image field for use in any schema.
 * Requires sanity-plugin-cloudinary (cloudinarySchemaPlugin) in sanity.config.ts.
 *
 * Usage:
 *   import { cloudinaryImageField } from './cloudinaryImage'
 *   cloudinaryImageField('heroImage', 'Hero image'),
 *   cloudinaryImageField('cover', 'Cover image', { required: true }),
 *
 * Configure your Cloudinary account in Studio first — see CLOUDINARY_SETUP.md.
 */
export function cloudinaryImageField(
  name: string,
  title: string,
  options?: { required?: boolean; description?: string }
) {
  return defineField({
    name,
    title,
    type: 'cloudinary.asset',
    description: options?.description,
    validation: options?.required ? (Rule) => Rule.required() : undefined,
  })
}
