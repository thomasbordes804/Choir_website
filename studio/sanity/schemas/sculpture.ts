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

/** A sculpture. */
export default defineType({
  name: 'sculpture',
  title: 'Sculpture',
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
      name: 'materials',
      title: 'Matériaux',
      type: 'string',
      group: 'meta',
      description: 'Ex. « Bronze », « Bois », « Terre cuite ».',
    }),
    { ...dimensionsField, group: 'meta' },
    { ...descriptionField, group: 'meta' },
    { ...imagesField, group: 'media' },
    { ...featuredField, group: 'meta' },
  ],
  preview: {
    select: { title: 'title', year: 'year', media: 'images.0.asset' },
    prepare({ title, year, media }) {
      return { title: title || 'Sans titre', subtitle: year || 'Sculpture', media }
    },
  },
})
