import { defineType, defineField } from 'sanity'
import {
  baseMetaFields,
  categoriesField,
  yearField,
  descriptionField,
  imagesField,
  featuredField,
} from './shared'

/**
 * Applied / design work: packaging design, perfume bottles, fabric printing,
 * event posters, and other commissioned or functional pieces.
 */
export default defineType({
  name: 'appliedArt',
  title: 'Art appliqué & design',
  type: 'document',
  groups: [
    { name: 'meta', title: 'Informations' },
    { name: 'media', title: 'Images' },
  ],
  fields: [
    ...baseMetaFields.map((f) => ({ ...f, group: 'meta' })),
    { ...categoriesField, group: 'meta' },
    defineField({
      name: 'discipline',
      title: 'Discipline',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          { title: 'Design de packaging', value: 'packaging' },
          { title: 'Flacon de parfum', value: 'flacon' },
          { title: 'Impression sur tissu', value: 'tissu' },
          { title: 'Affiche événementielle', value: 'affiche' },
          { title: 'Autre', value: 'autre' },
        ],
      },
    }),
    { ...yearField, group: 'meta' },
    defineField({
      name: 'context',
      title: 'Contexte / commanditaire',
      type: 'string',
      group: 'meta',
      description: 'Client, événement ou projet associé (facultatif).',
    }),
    { ...descriptionField, group: 'meta' },
    { ...imagesField, group: 'media' },
    { ...featuredField, group: 'meta' },
  ],
  preview: {
    select: { title: 'title', discipline: 'discipline', media: 'images.0.asset' },
    prepare({ title, discipline, media }) {
      return { title: title || 'Sans titre', subtitle: discipline || 'Art appliqué', media }
    },
  },
})
