import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import {sanityConfig } from "@/lib/sanity/config";

export const client = createClient({
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: sanityConfig.token,
})

// Charger les données depuis le fichier JSON
const dataPath = path.join(process.cwd(), 'data', 'works-sections-data.json');
let detailedSections: any[] = [];
try {
  const data = fs.readFileSync(dataPath, 'utf-8');
  detailedSections = JSON.parse(data);
} catch (error) {
  console.warn('⚠️  Fichier de données non trouvé, utilisation des données par défaut');
}

// Données de base des sections d'œuvres - toutes les sections
const worksSections = [
  {
    _type: 'workSection',
    title: 'Peintures sur toiles',
    slug: { current: 'peintures-sur-toiles' },
    description: 'Découvrez les peintures sur toiles de Michel Hilger.',
    order: 1,
    content: [],
  },
  {
    _type: 'workSection',
    title: 'Dessins, pastels et techniques mixtes',
    slug: { current: 'dessins-pastels-techniques-mixtes' },
    description: 'Explorez les dessins, pastels et œuvres en techniques mixtes de Michel Hilger.',
    order: 2,
    content: [],
  },
  {
    _type: 'workSection',
    title: 'Peintures sur clavecin',
    slug: { current: 'peintures-sur-clavecin' },
    description: 'Découvrez les peintures réalisées sur clavecins par Michel Hilger.',
    order: 3,
    content: [],
  },
  {
    _type: 'workSection',
    title: 'Peintures sur table',
    slug: { current: 'peintures-sur-table' },
    description: 'Explorez les peintures réalisées sur tables par Michel Hilger.',
    order: 4,
    content: [],
  },
  {
    _type: 'workSection',
    title: 'Impression sur tissu',
    slug: { current: 'impression-sur-tissu' },
    description: 'Découvrez les impressions sur tissu créées par Michel Hilger.',
    order: 5,
    content: [],
  },
  {
    _type: 'workSection',
    title: 'Sculptures',
    slug: { current: 'sculptures' },
    description: 'Explorez les sculptures de Michel Hilger.',
    order: 6,
    content: [],
  },
  {
    _type: 'workSection',
    title: 'Coloriages pédagogiques et thérapeutiques',
    slug: { current: 'coloriages-pedagogiques-therapeutiques' },
    description: 'Découvrez les coloriages pédagogiques et thérapeutiques créés par Michel Hilger.',
    order: 7,
    content: [],
  },
  {
    _type: 'workSection',
    title: 'Design de packagings',
    slug: { current: 'design-packagings' },
    description: 'Explorez les designs de packagings créés par Michel Hilger.',
    order: 8,
    content: [],
  },
  {
    _type: 'workSection',
    title: 'Flacon de parfum',
    slug: { current: 'flacon-parfum' },
    description: 'Découvrez les flacons de parfum conçus par Michel Hilger.',
    order: 9,
    content: [],
  },
  {
    _type: 'workSection',
    title: 'Affiches événementielles',
    slug: { current: 'affiches-evenementielles' },
    description: 'Explorez les affiches événementielles créées par Michel Hilger.',
    order: 10,
    content: [],
  },
  {
    _type: 'workSection',
    title: 'Poésies',
    slug: { current: 'poesies' },
    description: 'Découvrez les poésies de Michel Hilger.',
    order: 11,
    content: [],
  },
  {
    _type: 'workSection',
    title: 'Oeuvres de jeunesse',
    slug: { current: 'oeuvres-de-jeunesse' },
    description: 'Explorez les œuvres de jeunesse de Michel Hilger.',
    order: 12,
    content: [],
  },
  {
    _type: 'workSection',
    title: 'Portraits',
    slug: { current: 'portraits' },
    description: 'Découvrez les portraits réalisés par Michel Hilger.',
    order: 13,
    content: [],
  },
];

async function seedWorksSections() {
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ SANITY_API_TOKEN n\'est pas défini. Veuillez définir cette variable d\'environnement.');
    console.error('   Créez un token dans votre projet Sanity: https://www.sanity.io/manage');
    process.exit(1);
  }

  try {
    console.log('🌱 Création des sections d\'œuvres...\n');
    
    // Fusionner les données détaillées avec les données de base
    const allSections = worksSections.map(baseSection => {
      const detailed = detailedSections.find(d => d.slug === baseSection.slug.current);
      if (detailed) {
        return {
          ...baseSection,
          content: detailed.content || baseSection.content,
          subsections: detailed.subsections?.map((sub: any) => ({
            title: sub.title,
            slug: { current: sub.slug },
            content: sub.content || [],
          })),
        };
      }
      return baseSection;
    });

    // Also process sections that only exist in the JSON file
    for (const detailed of detailedSections) {
      const existsInBase = worksSections.find(bs => bs.slug.current === detailed.slug);
      if (!existsInBase) {
        const sectionToAdd = {
          _type: 'workSection',
          title: detailed.title,
          slug: { current: detailed.slug },
          description: detailed.description,
          order: detailed.order || 999,
          content: detailed.content || [],
          subsections: detailed.subsections?.map((sub: any) => ({
            title: sub.title,
            slug: { current: sub.slug },
            content: sub.content || [],
          })),
        };
        allSections.push(sectionToAdd);
      }
    }
    
    for (const section of allSections) {
      const existing = await client.fetch(
        `*[_type == "workSection" && slug.current == $slug][0]`,
        { slug: section.slug.current }
      );

      if (existing) {
        console.log(`✓ Section "${section.title}" existe déjà, mise à jour...`);
        await client
          .patch(existing._id)
          .set({
            title: section.title,
            description: section.description,
            order: section.order,
            ...(section.content && { content: section.content }),
            ...(section.subsections && { subsections: section.subsections }),
          })
          .commit();
      } else {
        console.log(`+ Création de "${section.title}"...`);
        await client.create(section);
      }
    }

    console.log('\n✅ Toutes les sections d\'œuvres ont été créées/mises à jour !');
    console.log(`📊 Total: ${allSections.length} section(s)`);
  } catch (error) {
    console.error('❌ Erreur lors de la création des sections:', error);
    process.exit(1);
  }
}

seedWorksSections();