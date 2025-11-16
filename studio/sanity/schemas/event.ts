import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'event',
  title: 'Event',
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
      name: 'dateTime',
      title: 'Date & Time',
      type: 'datetime',
    }),
    defineField({
      name: 'endDateTime',
      title: 'End Date & Time',
      type: 'datetime',
    }),
    defineField({
      name: 'locationName',
      title: 'Location Name',
      type: 'string',
    }),
    defineField({
      name: 'locationAddress',
      title: 'Location Address',
      type: 'string',
    }),
    defineField({
      name: 'isPublic',
      title: 'Public event?',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Concert', value: 'concert' },
          { title: 'Mass', value: 'mass' },
          { title: 'Rehearsal', value: 'rehearsal' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'repertoire',
      title: 'Repertoire (Songs)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'song' }] }],
    }),
    defineField({
      name: 'choirs',
      title: 'Choirs',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'choirGroup' }] }],
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
    }),
  ],
})
