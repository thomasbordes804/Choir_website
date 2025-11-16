import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'choirGroup',
  title: 'Choir Group',
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
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'leaders',
      title: 'Leaders',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'choirMember' }] }],
    }),
    defineField({
      name: 'members',
      title: 'Members',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'choirMember' }] }],
    }),
  ],
})
