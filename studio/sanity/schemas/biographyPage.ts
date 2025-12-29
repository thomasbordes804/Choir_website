import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'biographyTopic',
  title: 'Chapitre de la biographie',
  type: 'document',
  groups: [
    { name: 'meta', title: 'Métadonnées' },
    { name: 'hero', title: 'En-tête' },
    { name: 'content', title: 'Contenus' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titre du chapitre',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'meta',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
      group: 'meta',
    }),
    defineField({
      name: 'order',
      title: 'Ordre d’affichage',
      type: 'number',
      description: 'Permet de trier l’ordre sur la page biographie (plus petit = affiché en premier).',
      group: 'meta',
    }),
    defineField({
      name: 'eyebrow',
      title: 'Sur-titre',
      type: 'string',
      description: 'Court libellé au-dessus du titre.',
      group: 'hero',
    }),
    defineField({
      name: 'summary',
      title: 'Résumé',
      type: 'text',
      rows: 3,
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Image principale',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Texte alternatif', type: 'string' }),
        defineField({ name: 'caption', title: 'Légende', type: 'string' }),
      ],
    }),
    defineField({
      name: 'heroVideo',
      title: 'Vidéo principale',
      type: 'videoEmbed',
      group: 'hero',
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({ type: 'block' }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Texte alternatif', type: 'string' }),
            defineField({ name: 'caption', title: 'Légende', type: 'string' }),
          ],
        }),
        defineArrayMember({ type: 'videoEmbed' }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Contenu principal',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({ type: 'block' }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Texte alternatif', type: 'string' }),
            defineField({ name: 'caption', title: 'Légende', type: 'string' }),
          ],
        }),
        defineArrayMember({ type: 'videoEmbed' }),
      ],
    }),
    defineField({
      name: 'mediaGallery',
      title: 'Galerie médias',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Texte alternatif', type: 'string' }),
            defineField({ name: 'caption', title: 'Légende', type: 'string' }),
          ],
        }),
        defineArrayMember({ type: 'videoEmbed' }),
      ],
    }),
    defineField({
      name: 'relatedNews',
      title: 'Actualités associées',
      type: 'array',
      group: 'meta',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'announcement' }],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'summary',
      media: 'heroImage',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title ?? 'Chapitre de biographie',
        subtitle: subtitle ? subtitle.slice(0, 80) : undefined,
        media,
      }
    },
  },
})
