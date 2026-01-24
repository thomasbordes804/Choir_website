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
const dataPath = path.join(process.cwd(), 'data', 'books-data.json');
let booksData: any = null;
try {
  const data = fs.readFileSync(dataPath, 'utf-8');
  booksData = JSON.parse(data);
} catch (error) {
  console.warn('⚠️  Fichier de données non trouvé, utilisation des données par défaut');
  booksData = {
    title: "Livres",
    description: "Découvrez les ouvrages de Michel Hilger.",
    content: [],
    books: []
  };
}

async function seedBooksPage() {
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ SANITY_API_TOKEN n\'est pas défini. Veuillez définir cette variable d\'environnement.');
    console.error('   Créez un token dans votre projet Sanity: https://www.sanity.io/manage');
    process.exit(1);
  }

  try {
    console.log('🌱 Création de la page Livres...\n');
    
    const pageData = {
      _type: 'page',
      slug: { current: 'books' },
      title: booksData.title || 'Livres',
      description: booksData.description || undefined,
      content: booksData.content || [],
      books: booksData.books || [],
    };

    const existing = await client.fetch(
      `*[_type == "page" && slug.current == "books"][0]`,
    );

    if (existing) {
      console.log(`✓ Page "Livres" existe déjà, mise à jour...`);
      await client
        .patch(existing._id)
        .set({
          title: pageData.title,
          description: pageData.description,
          content: pageData.content,
          books: pageData.books,
        })
        .commit();
    } else {
      console.log(`+ Création de la page "Livres"...`);
      await client.create(pageData);
    }

    console.log('\n✅ La page Livres a été créée/mise à jour !');
    console.log(`📚 ${booksData.books?.length || 0} livre(s) ajouté(s)`);
  } catch (error) {
    console.error('❌ Erreur lors de la création de la page:', error);
    process.exit(1);
  }
}

seedBooksPage();