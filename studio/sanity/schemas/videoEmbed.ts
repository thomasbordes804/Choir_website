import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'videoEmbed',
  title: 'Video',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
    }),
    defineField({
      name: 'platform',
      title: 'Plateforme',
      type: 'string',
      options: {
        list: [
          { title: 'YouTube', value: 'youtube' },
          { title: 'Vimeo', value: 'vimeo' },
          { title: 'Autre', value: 'other' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'url',
      title: 'URL de la vidéo',
      type: 'url',
      validation: (rule) =>
        rule
          .required()
          .uri({
            allowRelative: false,
            scheme: ['http', 'https'],
          }),
    }),
    defineField({
      name: 'poster',
      title: 'Miniature (facultatif)',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description courte',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'platform',
      media: 'poster',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Vidéo',
        subtitle: subtitle ? subtitle.toUpperCase() : 'Lien externe',
        media,
      }
    },
  },
})
