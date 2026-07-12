import { defineType, defineField } from 'sanity'

/**
 * A press / media mention (Communication → Médias → Parution presse).
 * Replaces the hardcoded communication content with editable entries.
 */
export default defineType({
  name: 'pressItem',
  title: 'Parution presse',
  type: 'document',
  fields: [
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
    }),
    defineField({
      name: 'outlet',
      title: 'Média',
      type: 'string',
      description: 'Nom du journal, de la chaîne ou du site.',
    }),
    defineField({
      name: 'mediaType',
      title: 'Type de média',
      type: 'string',
      options: {
        list: [
          { title: 'Presse écrite', value: 'presse' },
          { title: 'Télévision', value: 'tv' },
          { title: 'Radio', value: 'radio' },
          { title: 'Web', value: 'web' },
        ],
      },
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
    }),
    defineField({
      name: 'url',
      title: 'Lien externe',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'excerpt',
      title: 'Extrait',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Image / capture',
      type: 'captionedImage',
    }),
    defineField({
      name: 'pdf',
      title: 'Document (PDF)',
      type: 'file',
      options: { accept: '.pdf' },
      description: 'Scan de l’article (facultatif).',
    }),
  ],
  preview: {
    select: { title: 'title', outlet: 'outlet', date: 'date', media: 'image' },
    prepare({ title, outlet, date, media }) {
      const year = date ? new Date(date).getFullYear() : null
      return {
        title: title || 'Sans titre',
        subtitle: [outlet, year].filter(Boolean).join(' · ') || 'Parution presse',
        media,
      }
    },
  },
})
