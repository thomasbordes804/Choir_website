import { defineType, defineField } from 'sanity'

/**
 * Reusable image with alt text + caption.
 * Use this everywhere an image is uploaded so accessibility and captions are consistent.
 */
export default defineType({
  name: 'captionedImage',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  preview: {
    select: { title: 'alt', caption: 'caption', media: 'asset' },
    prepare({ title, caption, media }) {
      return {
        title: caption || title || 'Image',
        media,
      }
    },
  },
  fields: [
    defineField({
      name: 'alt',
      title: 'Texte alternatif',
      type: 'string',
      description: "Décrit l'image (lecteurs d'écran, référencement).",
    }),
    defineField({
      name: 'caption',
      title: 'Légende',
      type: 'string',
    }),
  ],
})
