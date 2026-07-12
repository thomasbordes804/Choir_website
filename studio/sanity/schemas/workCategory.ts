import { defineType, defineField } from 'sanity'

/**
 * The Œuvres taxonomy AND the landing content for each rubric.
 * Replaces the old `workSection` (which mixed a freeform content blob with a
 * flat images array and had no notion of individual pieces).
 *
 * A self-reference (`parent`) gives the two-level hierarchy the navigation
 * needs, e.g. « Peintures » → « Peintures sur toiles ». Individual artworks
 * reference the category they belong to.
 */
export default defineType({
  name: 'workCategory',
  title: "Catégorie d'œuvres",
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
      name: 'parent',
      title: 'Rubrique parente',
      type: 'reference',
      to: [{ type: 'workCategory' }],
      description:
        'Laisser vide pour une rubrique de premier niveau (Peintures, Musiques…). Renseigner pour une sous-rubrique (Peintures sur toiles…).',
    }),
    defineField({
      name: 'order',
      title: "Ordre d'affichage",
      type: 'number',
      description: 'Plus petit = affiché en premier.',
    }),
    defineField({
      name: 'legacyPath',
      title: 'Chemin sur l’ancien site',
      type: 'string',
      readOnly: true,
      description:
        'Chemin de la rubrique sur artsparadise.net (ex. « /works/paintings »). Sert à la migration automatique — ne pas modifier.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Image de couverture',
      type: 'captionedImage',
      description: 'Vignette utilisée dans la grille des œuvres et le menu.',
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Texte affiché en tête de la rubrique.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      parentTitle: 'parent.title',
      order: 'order',
      media: 'coverImage',
    },
    prepare({ title, parentTitle, order, media }) {
      return {
        title: title || 'Sans titre',
        subtitle: [parentTitle && `↳ ${parentTitle}`, order != null && `Ordre : ${order}`]
          .filter(Boolean)
          .join('  ·  '),
        media,
      }
    },
  },
})
