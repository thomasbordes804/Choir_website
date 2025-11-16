import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'song',
  title: 'Song',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({
      name: 'composer',
      title: 'Composer',
      type: 'string',
    }),
    defineField({
      name: 'arranger',
      title: 'Arranger',
      type: 'string',
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
    }),
    defineField({
      name: 'liturgicalSeason',
      title: 'Liturgical Season',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'songCategory' }],
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'sheetMusic',
      title: 'Sheet Music (PDF)',
      type: 'file',
    }),
    defineField({
      name: 'audioDemo',
      title: 'Audio Demo',
      type: 'file',
    }),
    defineField({
      name: 'lyrics',
      title: 'Lyrics',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
})
