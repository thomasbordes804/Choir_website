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
const dataPath = path.join(process.cwd(), 'data', 'biography-sections-data.json');
let detailedSections: any[] = [];
try {
  const data = fs.readFileSync(dataPath, 'utf-8');
  detailedSections = JSON.parse(data);
} catch (error) {
  console.warn('⚠️  Fichier de données non trouvé, utilisation des données par défaut');
}

// Données des sections de biographie récupérées depuis le site
const biographySections = [
    {
      _type: 'biographySection',
      title: "Festival Grand Pari's en Chœurs dans l'harmonie",
      slug: { current: 'grand-paris-en-choeurs' },
      description: "Chronique la participation de Michel Hilger à ce rendez-vous choral parisien, entre direction et arrangements inspirés.",
      order: 1,
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "Le Festival Grand Pari's en Chœurs dans l'harmonie est une initiative visant à fédérer des chorales franciliennes autour de valeurs fraternelles pour partager des moments musicaux. L'objectif est d'organiser des concerts à proximité des nouvelles gares créées par les travaux du Grand Paris.",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "Des concerts précurseurs ont déjà eu lieu dans plusieurs villes franciliennes, notamment à Rosny-sous-Bois, Chennevières, Valenton et Sevran. Par exemple, le 14 janvier 2018, un concert s'est tenu à Valenton, suivi d'un autre à Rosny-sous-Bois le 21 janvier 2018.",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "Le festival a également organisé des concours d'affiches et de logos pour promouvoir l'événement.",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "En 2024, plusieurs événements ont été organisés dans le cadre du festival, tels que des concerts à Versailles et Rambouillet en mars, ainsi que des concerts pour le temps de Noël à Sucy-en-Brie, Champigny-sur-Marne et Rosny-sous-Bois en janvier.",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "Le festival continue de promouvoir la musique chorale en Île-de-France, en rassemblant des chorales locales et en offrant des performances dans des lieux emblématiques de la région.",
            },
          ],
        },
        // Add YouTube videos - Replace with actual video URLs from the website
        {
          _type: 'videoEmbed',
          url: 'https://www.youtube.com/watch?v=VIDEO_ID_1', // Replace with actual YouTube URL
          platform: 'youtube',
          title: 'Concert du Festival Grand Pari\'s en Chœurs - Valenton 2018',
          description: 'Premier concert précurseur du Festival Grand Pari\'s en Chœurs à Valenton le 14 janvier 2018',
        },
        {
          _type: 'videoEmbed',
          url: 'https://www.youtube.com/watch?v=VIDEO_ID_2', // Replace with actual YouTube URL
          platform: 'youtube',
          title: 'Concert du Festival Grand Pari\'s en Chœurs - Rosny-sous-Bois 2018',
          description: 'Concert du Festival Grand Pari\'s en Chœurs à Rosny-sous-Bois le 21 janvier 2018',
        },
        {
          _type: 'videoEmbed',
          url: 'https://www.youtube.com/watch?v=VIDEO_ID_3', // Replace with actual YouTube URL
          platform: 'youtube',
          title: 'Concert de Noël 2024 - Festival Grand Pari\'s en Chœurs',
          description: 'Concerts pour le temps de Noël à Sucy-en-Brie, Champigny-sur-Marne et Rosny-sous-Bois',
        },
        // Add more videos as needed
      ],
    },
    {
      _type: 'biographySection',
      title: 'Curriculum Vitæ',
      slug: { current: 'cv' },
      description: "Détaille un parcours jalonné d'études, de rencontres et de créations marquantes.",
      order: 5,
      content: [], // Will be loaded from JSON file
    },
];

// Fonction pour convertir les URLs YouTube en objets videoEmbed
function createVideoEmbed(video: { url: string; title?: string }) {
  const match = video.url.match(/[?&]v=([^&]+)/);
  if (!match) return null;
  
  return {
    _type: 'videoEmbed',
    url: video.url,
    platform: 'youtube',
    title: video.title || 'Vidéo YouTube',
  };
}

async function seedBiographySections() {
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ SANITY_API_TOKEN n\'est pas défini. Veuillez définir cette variable d\'environnement.');
    console.error('   Créez un token dans votre projet Sanity: https://www.sanity.io/manage');
    process.exit(1);
  }

  try {
    console.log('🌱 Création des sections de biographie...\n');
    
    // Fusionner les données détaillées avec les données de base
    const allSections = biographySections.map(baseSection => {
      const detailed = detailedSections.find(d => d.slug === baseSection.slug.current);
      if (detailed) {
        // Ajouter les vidéos au contenu si elles existent
        const contentWithVideos = [...(detailed.content || baseSection.content || [])];
        if (detailed.videos && detailed.videos.length > 0) {
          detailed.videos.forEach((video: any) => {
            const videoEmbed = createVideoEmbed(video);
            if (videoEmbed) {
              contentWithVideos.push(videoEmbed);
            }
          });
        }
        
        return {
          ...baseSection,
          content: contentWithVideos.length > 0 ? contentWithVideos : baseSection.content,
          subsections: detailed.subsections?.map((sub: any) => ({
            title: sub.title,
            slug: { current: sub.slug },
            content: [],
          })),
        };
      }
      return baseSection;
    });

    // Also process sections that only exist in the JSON file (like organist, organ)
    for (const detailed of detailedSections) {
      const existsInBase = biographySections.find(bs => bs.slug.current === detailed.slug);
      if (!existsInBase) {
        // Add sections that are only in JSON file
        const sectionToAdd = {
          _type: 'biographySection',
          title: detailed.title,
          slug: { current: detailed.slug },
          description: detailed.description,
          order: detailed.order || 999,
          content: detailed.content || [],
          subsections: detailed.subsections?.map((sub: any) => ({
            title: sub.title,
            slug: { current: sub.slug },
            content: [],
          })),
        };
        
        // Add videos if they exist
        if (detailed.videos && detailed.videos.length > 0) {
          detailed.videos.forEach((video: any) => {
            const videoEmbed = createVideoEmbed(video);
            if (videoEmbed) {
              sectionToAdd.content.push(videoEmbed);
            }
          });
        }
        
        allSections.push(sectionToAdd);
      }
    }
    
    for (const section of allSections) {
      const existing = await client.fetch(
        `*[_type == "biographySection" && slug.current == $slug][0]`,
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

    console.log('\n✅ Toutes les sections ont été créées/mises à jour !');
    console.log('\n📝 Notes importantes:');
    console.log('   - Les images doivent être ajoutées manuellement via Sanity Studio');
    console.log('   - Les URLs d\'images sont disponibles dans data/biography-sections-data.json');
    console.log('   - Vous pouvez télécharger les images depuis les URLs et les uploader dans Sanity');
  } catch (error) {
    console.error('❌ Erreur lors de la création des sections:', error);
    process.exit(1);
  }
}

seedBiographySections();