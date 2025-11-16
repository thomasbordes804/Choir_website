import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'rehearsal',
  title: 'Rehearsal',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'dateTime',
      title: 'Date & Time',
      type: 'datetime',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'songs',
      title: 'Songs',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'song' }] }],
    }),
  ],
})
