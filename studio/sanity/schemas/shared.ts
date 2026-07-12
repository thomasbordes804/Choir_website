import { defineField } from 'sanity'

/**
 * Shared field definitions reused across the artwork document types
 * (painting, drawing, sculpture, appliedArt, poem, musicalWork).
 *
 * Keeping these in one place is what stops the schemas from drifting apart
 * the way `workSection` and `biographySection` did (they were byte-identical).
 */

/** Title + slug + display order — every artwork needs these. */
export const baseMetaFields = [
  defineField({
    name: 'title',
    title: 'Titre',
    type: 'string',
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'slug',
    title: 'Slug (URL)',
    type: 'slug',
    options: { source: 'title', maxLength: 96 },
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: 'order',
    title: "Ordre d'affichage",
    type: 'number',
    description: 'Plus petit = affiché en premier.',
  }),
  defineField({
    name: 'legacySource',
    title: 'Source (ancien site)',
    type: 'string',
    readOnly: true,
    description:
      "Chemin de l'œuvre sur l'ancien site artsparadise.net (ex. « /works/paintings/abstract »). Renseigné par la migration automatique — ne pas modifier.",
  }),
]

/**
 * Categories a piece belongs to. The first one is its main rubric (drives the
 * Œuvres navigation); extra ones handle cross-cutting groups like
 * « Portraits » or « Œuvres de jeunesse » without needing separate types.
 */
export const categoriesField = defineField({
  name: 'categories',
  title: 'Catégories',
  type: 'array',
  of: [{ type: 'reference', to: [{ type: 'workCategory' }] }],
  description:
    'La première catégorie sert de rubrique principale. Ajoutez-en d’autres pour les regroupements transverses (Portraits, Œuvres de jeunesse…).',
  validation: (rule) => rule.min(1),
})

export const yearField = defineField({
  name: 'year',
  title: 'Année',
  type: 'string',
  description: 'Année de création (ex. « 2019 » ou « v. 1985 »).',
})

export const dimensionsField = defineField({
  name: 'dimensions',
  title: 'Dimensions',
  type: 'string',
  description: 'Ex. « 80 × 60 cm ».',
})

export const descriptionField = defineField({
  name: 'description',
  title: 'Description',
  type: 'array',
  of: [{ type: 'block' }],
})

/** A gallery of captioned images — the visual heart of most artworks. */
export const imagesField = defineField({
  name: 'images',
  title: 'Images',
  type: 'array',
  of: [{ type: 'captionedImage' }],
})

export const featuredField = defineField({
  name: 'featured',
  title: 'Mettre en avant',
  type: 'boolean',
  description: 'Afficher cette œuvre en évidence (page d’accueil, têtes de rubrique).',
  initialValue: false,
})
