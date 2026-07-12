import { defineType, defineField } from 'sanity'
import { baseMetaFields, categoriesField, yearField, descriptionField } from './shared'

/**
 * A musical work composed or arranged by Michel Hilger (compositions, chants).
 * Distinct from `song`, which is the choir's working repertoire.
 */
export default defineType({
  name: 'musicalWork',
  title: 'Œuvre musicale',
  type: 'document',
  fields: [
    ...baseMetaFields,
    categoriesField,
    yearField,
    defineField({
      name: 'role',
      title: 'Rôle',
      type: 'string',
      options: {
        list: [
          { title: 'Compositeur', value: 'compositeur' },
          { title: 'Arrangeur', value: 'arrangeur' },
          { title: 'Interprète', value: 'interprete' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'audio',
      title: 'Enregistrement audio',
      type: 'file',
      options: { accept: 'audio/*' },
    }),
    defineField({
      name: 'score',
      title: 'Partition (PDF)',
      type: 'file',
      options: { accept: '.pdf' },
    }),
    defineField({
      name: 'video',
      title: 'Vidéo',
      type: 'videoEmbed',
    }),
    { ...descriptionField, title: 'Notes de programme' },
  ],
  preview: {
    select: { title: 'title', role: 'role', year: 'year' },
    prepare({ title, role, year }) {
      return {
        title: title || 'Sans titre',
        subtitle: [role, year].filter(Boolean).join(' · ') || 'Œuvre musicale',
      }
    },
  },
})
