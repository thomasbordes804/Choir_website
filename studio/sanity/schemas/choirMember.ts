import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'choirMember',
  title: 'Choir Member',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
    }),
    defineField({
      name: 'voicePart',
      title: 'Voice Part',
      type: 'string',
      options: {
        list: [
          { title: 'Soprano', value: 'soprano' },
          { title: 'Alto', value: 'alto' },
          { title: 'Tenor', value: 'tenor' },
          { title: 'Bass', value: 'bass' },
          { title: 'Other', value: 'other' },
        ],
      },
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'showOnWebsite',
      title: 'Show on Website',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})
