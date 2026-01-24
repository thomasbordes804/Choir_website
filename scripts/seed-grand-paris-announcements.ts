import { createClient } from '@sanity/client';
import {sanityConfig } from "@/lib/sanity/config";

export const client = createClient({
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: sanityConfig.token,
})

// Actualités du Festival Grand Pari's en Chœur récupérées depuis le site officiel
const grandParisAnnouncements = [
  {
    _type: 'announcement',
    title: "Concert du Festival Grand Pari's en Chœurs - Valenton 2018",
    slug: { current: 'concert-valenton-2018' },
    publishedAt: '2018-01-14T19:00:00Z',
    highlight: true,
    body: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: "Premier concert précurseur du Festival Grand Pari's en Chœurs dans l'harmonie qui s'est tenu à Valenton le 14 janvier 2018. Cet événement a marqué le début d'une série de concerts visant à fédérer les chorales franciliennes autour de valeurs fraternelles.",
          },
        ],
      },
    ],
  },
  {
    _type: 'announcement',
    title: "Concert du Festival Grand Pari's en Chœurs - Rosny-sous-Bois 2018",
    slug: { current: 'concert-rosny-2018' },
    publishedAt: '2018-01-21T19:00:00Z',
    highlight: true,
    body: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: "Concert du Festival Grand Pari's en Chœurs à Rosny-sous-Bois le 21 janvier 2018. Un moment musical exceptionnel qui a rassemblé plusieurs chorales de la région parisienne.",
          },
        ],
      },
    ],
  },
  {
    _type: 'announcement',
    title: "Concours d'affiches et de logos - Festival Grand Pari's",
    slug: { current: 'concours-affiches-logos-grand-paris' },
    publishedAt: '2018-02-01T10:00:00Z',
    highlight: false,
    body: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: "Le Festival Grand Pari's en Chœurs a organisé un concours d'affiches et de logos pour promouvoir l'événement et impliquer la communauté dans la création de l'identité visuelle du festival.",
          },
        ],
      },
    ],
  },
  {
    _type: 'announcement',
    title: "Concert à Chennevières - Festival Grand Pari's en Chœurs",
    slug: { current: 'concert-chennevieres-grand-paris' },
    publishedAt: '2018-03-15T19:00:00Z',
    highlight: true,
    body: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: "Concert organisé à Chennevières dans le cadre du Festival Grand Pari's en Chœurs, rassemblant des chorales locales pour un moment de partage musical.",
          },
        ],
      },
    ],
  },
  {
    _type: 'announcement',
    title: "Concert à Sevran - Festival Grand Pari's en Chœurs",
    slug: { current: 'concert-sevran-grand-paris' },
    publishedAt: '2018-04-10T19:00:00Z',
    highlight: true,
    body: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: "Concert du Festival Grand Pari's en Chœurs à Sevran, continuant la série d'événements musicaux organisés à proximité des nouvelles gares du Grand Paris.",
          },
        ],
      },
    ],
  },
  {
    _type: 'announcement',
    title: "Concerts de mars 2024 - Versailles et Rambouillet",
    slug: { current: 'concerts-mars-2024-versailles-rambouillet' },
    publishedAt: '2024-03-01T10:00:00Z',
    highlight: true,
    body: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: "En mars 2024, le Festival Grand Pari's en Chœurs a organisé plusieurs concerts à Versailles et Rambouillet, poursuivant sa mission de promouvoir la musique chorale en Île-de-France.",
          },
        ],
      },
    ],
  },
  {
    _type: 'announcement',
    title: "Concerts de Noël 2024 - Sucy-en-Brie, Champigny-sur-Marne et Rosny-sous-Bois",
    slug: { current: 'concerts-noel-2024-grand-paris' },
    publishedAt: '2024-01-15T10:00:00Z',
    highlight: true,
    body: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: "Pour le temps de Noël 2024, le Festival Grand Pari's en Chœurs a organisé des concerts dans trois villes : Sucy-en-Brie, Champigny-sur-Marne et Rosny-sous-Bois. Ces événements ont permis de célébrer la période de Noël à travers la musique chorale.",
          },
        ],
      },
    ],
  },
  {
    _type: 'announcement',
    title: "Weekend des Associations - Festival Grand Pari's",
    slug: { current: 'weekend-associations-grand-paris' },
    publishedAt: '2020-09-15T10:00:00Z',
    highlight: false,
    body: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: "Participation du Festival Grand Pari's en Chœurs au Weekend des Associations, un événement qui permet de présenter les activités chorales et de recruter de nouveaux membres.",
          },
        ],
      },
    ],
  },
  {
    _type: 'announcement',
    title: "Nouvelle saison du Festival Grand Pari's en Chœurs 2024",
    slug: { current: 'nouvelle-saison-2024-grand-paris' },
    publishedAt: '2024-01-01T10:00:00Z',
    highlight: true,
    body: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: "Le Festival Grand Pari's en Chœurs entame une nouvelle saison riche en événements. Le festival continue de fédérer les chorales franciliennes et d'organiser des concerts dans des lieux emblématiques de la région parisienne.",
          },
        ],
      },
    ],
  },
  {
    _type: 'announcement',
    title: "Appel aux chorales - Rejoignez le Festival Grand Pari's en Chœurs",
    slug: { current: 'appel-chorales-grand-paris' },
    publishedAt: '2018-01-01T10:00:00Z',
    highlight: false,
    body: [
      {
        _type: 'block',
        style: 'normal',
        children: [
          {
            _type: 'span',
            text: "Le Festival Grand Pari's en Chœurs invite toutes les chorales franciliennes à rejoindre cette initiative fraternelle. L'objectif est de créer des moments musicaux partagés à proximité des nouvelles gares du Grand Paris.",
          },
        ],
      },
    ],
  },
];

async function seedGrandParisAnnouncements() {
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ SANITY_API_TOKEN n\'est pas défini. Veuillez définir cette variable d\'environnement.');
    console.error('   Créez un token dans votre projet Sanity: https://www.sanity.io/manage');
    process.exit(1);
  }

  try {
    console.log('🌱 Création des actualités du Festival Grand Pari\'s en Chœur...\n');
    
    for (const announcement of grandParisAnnouncements) {
      const existing = await client.fetch(
        `*[_type == "announcement" && slug.current == $slug][0]`,
        { slug: announcement.slug.current }
      );

      if (existing) {
        console.log(`✓ Actualité "${announcement.title}" existe déjà, mise à jour...`);
        await client
          .patch(existing._id)
          .set({
            title: announcement.title,
            publishedAt: announcement.publishedAt,
            highlight: announcement.highlight,
            body: announcement.body,
          })
          .commit();
      } else {
        console.log(`+ Création de "${announcement.title}"...`);
        await client.create(announcement);
      }
    }

    console.log('\n✅ Toutes les actualités du Festival Grand Pari\'s ont été créées/mises à jour !');
    console.log(`\n📊 Total: ${grandParisAnnouncements.length} actualités`);
  } catch (error) {
    console.error('❌ Erreur lors de la création des actualités:', error);
    process.exit(1);
  }
}

seedGrandParisAnnouncements();