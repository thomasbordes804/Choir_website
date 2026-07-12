import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * A sub-section of a biography chapter — mirrors the sub-pages the old site
 * nested under a chapter (e.g. « Curriculum Vitæ » → Études, Expériences
 * professionnelles… ; « Orchestres » → Quintette de France, Polyphanie…).
 *
 * Embedded as an array on `biographyTopic.subSections` so editors manage the
 * whole chapter (intro + sub-sections) in one place.
 */
export default defineType({
  name: 'biographySubSection',
  title: 'Sous-section',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'legacySlug',
      title: 'Slug (ancien site)',
      type: 'string',
      readOnly: true,
      description: "Chemin d'origine sur artsparadise.net. Renseigné par la migration — ne pas modifier.",
    }),
    defineField({
      name: 'body',
      title: 'Contenu',
      type: 'array',
      of: [
        defineArrayMember({ type: 'block' }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Texte alternatif', type: 'string' }),
            defineField({ name: 'caption', title: 'Légende', type: 'string' }),
          ],
        }),
        defineArrayMember({ type: 'videoEmbed' }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Texte alternatif', type: 'string' }),
            defineField({ name: 'caption', title: 'Légende', type: 'string' }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', media: 'gallery.0', bodyImg: 'body.0' },
    prepare({ title, media, bodyImg }) {
      return { title: title || 'Sous-section', media: media || bodyImg }
    },
  },
})
