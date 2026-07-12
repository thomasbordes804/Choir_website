import { defineType, defineField } from 'sanity'

const TIER_COLORS = [
  { title: 'Ocre (Esquisse)', value: '#e8c99b' },
  { title: 'Bordeaux (Pigment)', value: '#8d1e11' },
  { title: 'Indigo', value: '#636098' },
  { title: 'Vert atelier', value: '#7d9468' },
  { title: 'Terracotta', value: '#a8433a' },
  { title: 'Lavande', value: '#a8a7d4' },
  { title: 'Or vieilli', value: '#b39244' },
]

/**
 * A single donation/brushstroke on "la fresque des mécènes" (/don page). Each
 * document becomes one stroke in the fresco — see components/don/mecene-panel.tsx.
 */
export default defineType({
  name: 'donation',
  title: 'Don (fresque des mécènes)',
  type: 'document',
  fields: [
    defineField({
      name: 'donorName',
      title: 'Nom du donateur',
      type: 'string',
      description: 'Facultatif si le don est anonyme.',
    }),
    defineField({
      name: 'amount',
      title: 'Montant (€)',
      type: 'number',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'tier',
      title: 'Palier',
      type: 'string',
      options: {
        list: [
          { title: "L'esquisse (10 €)", value: 'esquisse' },
          { title: 'Le pigment (30 €)', value: 'pigment' },
          { title: 'La fresque (libre)', value: 'fresque' },
        ],
      },
    }),
    defineField({
      name: 'color',
      title: 'Couleur du trait',
      type: 'string',
      options: { list: TIER_COLORS },
      initialValue: '#8d1e11',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'donatedAt',
      title: 'Date du don',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: { title: 'donorName', amount: 'amount', tier: 'tier' },
    prepare({ title, amount, tier }) {
      return {
        title: title || 'Don anonyme',
        subtitle: [amount ? `${amount} €` : null, tier].filter(Boolean).join(' · '),
      }
    },
  },
})
