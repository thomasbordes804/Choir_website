import { defineType, defineField } from 'sanity'

/** A single "buy this" link (Amazon, Fnac, etc.) used by books. */
export default defineType({
  name: 'purchaseLink',
  title: "Lien d'achat",
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Libellé',
      type: 'string',
      description: 'Ex. « Amazon (version papier) ».',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (rule) => rule.required().uri({ scheme: ['http', 'https'] }),
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'url' },
  },
})
