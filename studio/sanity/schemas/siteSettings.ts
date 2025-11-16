import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'churchName',
      title: 'Church Name',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'homepageHeroTitle',
      title: 'Homepage Hero Title',
      type: 'string',
    }),
    defineField({
      name: 'homepageHeroSubtitle',
      title: 'Homepage Hero Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'homepageHeroImage',
      title: 'Homepage Hero Image',
      type: 'image',
    }),
    defineField({
      name: 'featuredEvent',
      title: 'Featured Event',
      type: 'reference',
      to: [{ type: 'event' }],
    }),
  ],
})
