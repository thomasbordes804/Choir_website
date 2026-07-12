import { defineType, defineField } from 'sanity'
import { baseMetaFields, categoriesField, yearField, imagesField } from './shared'

/** A poem — text is the content, so it gets a rich body instead of a gallery. */
export default defineType({
  name: 'poem',
  title: 'Poésie',
  type: 'document',
  fields: [
    ...baseMetaFields,
    categoriesField,
    yearField,
    defineField({
      name: 'dedication',
      title: 'Dédicace',
      type: 'string',
      description: 'Ex. « À ma mère » (facultatif).',
    }),
    defineField({
      name: 'body',
      title: 'Texte du poème',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Le poème lui-même. Utilisez les retours à la ligne pour les vers.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'audio',
      title: 'Lecture audio',
      type: 'file',
      options: { accept: 'audio/*' },
      description: 'Enregistrement de la lecture du poème (facultatif).',
    }),
    {
      ...imagesField,
      title: 'Illustrations',
      description: 'Images accompagnant le poème (facultatif).',
    },
  ],
  preview: {
    select: { title: 'title', year: 'year' },
    prepare({ title, year }) {
      return { title: title || 'Sans titre', subtitle: year ? `Poésie · ${year}` : 'Poésie' }
    },
  },
})
