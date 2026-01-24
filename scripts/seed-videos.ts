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
const dataPath = path.join(process.cwd(), 'data', 'videos-data.json');
let videosData: any = null;
try {
  const data = fs.readFileSync(dataPath, 'utf-8');
  videosData = JSON.parse(data);
} catch (error) {
  console.warn('⚠️  Fichier de données non trouvé, utilisation des données par défaut');
  videosData = {
    title: "Vidéos",
    description: "Découvrez les vidéos de Michel Hilger.",
    content: []
  };
}

async function seedVideosPage() {
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ SANITY_API_TOKEN n\'est pas défini. Veuillez définir cette variable d\'environnement.');
    console.error('   Créez un token dans votre projet Sanity: https://www.sanity.io/manage');
    process.exit(1);
  }

  try {
    console.log('🌱 Création de la page Vidéos...\n');
    
    const pageData = {
      _type: 'page',
      slug: { current: 'videos' },
      title: videosData.title || 'Vidéos',
      description: videosData.description || undefined,
      content: videosData.content || [],
    };

    const existing = await client.fetch(
      `*[_type == "page" && slug.current == "videos"][0]`,
    );

    if (existing) {
      console.log(`✓ Page "Vidéos" existe déjà, mise à jour...`);
      await client
        .patch(existing._id)
        .set({
          title: pageData.title,
          description: pageData.description,
          content: pageData.content,
        })
        .commit();
    } else {
      console.log(`+ Création de la page "Vidéos"...`);
      await client.create(pageData);
    }

    console.log('\n✅ La page Vidéos a été créée/mise à jour !');
    console.log('\n📝 Notes importantes:');
    console.log('   - Les URLs des vidéos YouTube doivent être mises à jour dans data/videos-data.json');
    console.log('   - Vous pouvez également ajouter des vidéos directement via Sanity Studio');
  } catch (error) {
    console.error('❌ Erreur lors de la création de la page:', error);
    process.exit(1);
  }
}

seedVideosPage();