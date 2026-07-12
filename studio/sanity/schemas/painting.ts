import { defineType, defineField } from 'sanity'
import {
  baseMetaFields,
  categoriesField,
  yearField,
  dimensionsField,
  descriptionField,
  imagesField,
  featuredField,
} from './shared'

/** A painting — on canvas, table, harpsichord, etc. */
export default defineType({
  name: 'painting',
  title: 'Peinture',
  type: 'document',
  groups: [
    { name: 'meta', title: 'Informations' },
    { name: 'media', title: 'Images' },
  ],
  fields: [
    ...baseMetaFields.map((f) => ({ ...f, group: 'meta' })),
    { ...categoriesField, group: 'meta' },
    { ...yearField, group: 'meta' },
    defineField({
      name: 'support',
      title: 'Support',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          { title: 'Toile', value: 'toile' },
          { title: 'Table', value: 'table' },
          { title: 'Clavecin', value: 'clavecin' },
          { title: 'Autre', value: 'autre' },
        ],
      },
    }),
    defineField({
      name: 'technique',
      title: 'Technique',
      type: 'string',
      group: 'meta',
      description: 'Ex. « Huile », « Acrylique », « Technique mixte ».',
    }),
    { ...dimensionsField, group: 'meta' },
    { ...descriptionField, group: 'meta' },
    { ...imagesField, group: 'media' },
    { ...featuredField, group: 'meta' },
  ],
  preview: {
    select: { title: 'title', year: 'year', media: 'images.0.asset' },
    prepare({ title, year, media }) {
      return { title: title || 'Sans titre', subtitle: year || 'Peinture', media }
    },
  },
})
