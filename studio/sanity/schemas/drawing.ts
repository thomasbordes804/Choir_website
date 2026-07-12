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

/** A drawing — pencil, pastel, mixed media, or a teaching/therapy colouring. */
export default defineType({
  name: 'drawing',
  title: 'Dessin',
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
      name: 'technique',
      title: 'Technique',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          { title: 'Crayon', value: 'crayon' },
          { title: 'Pastel', value: 'pastel' },
          { title: 'Encre', value: 'encre' },
          { title: 'Technique mixte', value: 'mixte' },
          { title: 'Coloriage', value: 'coloriage' },
          { title: 'Autre', value: 'autre' },
        ],
      },
    }),
    { ...dimensionsField, group: 'meta' },
    { ...descriptionField, group: 'meta' },
    { ...imagesField, group: 'media' },
    { ...featuredField, group: 'meta' },
  ],
  preview: {
    select: { title: 'title', year: 'year', media: 'images.0.asset' },
    prepare({ title, year, media }) {
      return { title: title || 'Sans titre', subtitle: year || 'Dessin', media }
    },
  },
})
