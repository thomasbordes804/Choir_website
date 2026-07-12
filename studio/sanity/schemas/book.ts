import { defineType, defineField } from 'sanity'

/**
 * A published (or upcoming) book. Promoted out of the old generic `page`
 * document, where books lived as an embedded array keyed by the slug "books".
 * Mirrors the rich shape in data/books-data.json.
 */
export default defineType({
  name: 'book',
  title: 'Livre',
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Sous-titre',
      type: 'string',
    }),
    defineField({
      name: 'status',
      title: 'Statut',
      type: 'string',
      initialValue: 'published',
      options: {
        list: [
          { title: 'Publié', value: 'published' },
          { title: 'À paraître', value: 'upcoming' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'coverImage',
      title: 'Couverture',
      type: 'captionedImage',
    }),
    defineField({
      name: 'authors',
      title: 'Auteurs',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'publisher',
      title: 'Éditeur',
      type: 'string',
    }),
    defineField({
      name: 'publicationDate',
      title: 'Date de parution',
      type: 'string',
      description: 'Ex. « Novembre 2016 ».',
    }),
    defineField({
      name: 'gallery',
      title: "Galerie d'images",
      type: 'array',
      of: [{ type: 'captionedImage' }],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'additionalContent',
      title: 'Contenu complémentaire',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Ex. « À propos des auteurs ».',
    }),
    defineField({
      name: 'purchaseLinks',
      title: "Liens d'achat",
      type: 'array',
      of: [{ type: 'purchaseLink' }],
    }),
    defineField({
      name: 'order',
      title: "Ordre d'affichage",
      type: 'number',
      description: 'Plus petit = affiché en premier.',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'subtitle', status: 'status', media: 'coverImage' },
    prepare({ title, subtitle, status, media }) {
      const statusLabel = status === 'upcoming' ? 'À paraître' : 'Publié'
      return {
        title: title || 'Sans titre',
        subtitle: subtitle ? `${subtitle} · ${statusLabel}` : statusLabel,
        media,
      }
    },
  },
})
