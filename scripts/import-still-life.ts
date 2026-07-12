/**
 * Import the 5 "Natures mortes" paintings from artsparadise.net into Sanity.
 *
 * For each artwork it:
 *   1. Downloads the full-resolution image from the old site
 *   2. Uploads it as a Sanity image asset
 *   3. Creates a `painting` document with the correct category references
 *
 * Safe to re-run: uses createIfNotExists with deterministic ids.
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@sanity/client';

loadEnv({ path: '.env.local' });
loadEnv();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const BASE_URL = 'https://www.artsparadise.net';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const artworks = [
  { src: '/assets/works/paintings/still-life/bouquet_au_vase_rond.webp', title: 'Bouquet au vase rond' },
  { src: '/assets/works/paintings/still-life/bouquet_au_vase_vert.webp', title: 'Bouquet au vase vert' },
  { src: '/assets/works/paintings/still-life/gerbe_de_fleurs_des_champs.webp', title: 'Gerbe de fleurs des champs' },
  { src: '/assets/works/paintings/still-life/offrande-florale.webp', title: 'Offrande Florale' },
  { src: '/assets/works/paintings/still-life/valse_de_fleurs.webp', title: 'Valse de Fleurs' },
];

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function downloadImage(url: string): Promise<Buffer> {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  console.log(`🎨 Importing ${artworks.length} still-life paintings…\n`);

  for (const [i, art] of artworks.entries()) {
    const slug = slugify(art.title);
    const docId = `painting-still-life-${slug}`;

    const existing = await client.fetch('count(*[_id == $id || _id == $draftId])', {
      id: docId,
      draftId: `drafts.${docId}`,
    });
    if (existing > 0) {
      console.log(`  ⏭  [${i + 1}/${artworks.length}] « ${art.title} » already exists, skipping`);
      continue;
    }

    console.log(`  ⬇  [${i + 1}/${artworks.length}] Downloading « ${art.title} »…`);
    const imageBuffer = await downloadImage(`${BASE_URL}${art.src}`);
    const filename = art.src.split('/').pop()!;

    console.log(`  ⬆  [${i + 1}/${artworks.length}] Uploading image to Sanity…`);
    const imageAsset = await client.assets.upload('image', imageBuffer, {
      filename,
      contentType: 'image/webp',
    });

    const doc = {
      _id: docId,
      _type: 'painting',
      title: art.title,
      slug: { _type: 'slug', current: slug },
      order: i + 1,
      support: 'toile',
      categories: [
        { _type: 'reference', _ref: 'workCategory-paintings-still-life', _key: 'cat-still-life' },
        { _type: 'reference', _ref: 'workCategory-paintings', _key: 'cat-paintings' },
      ],
      images: [
        {
          _type: 'captionedImage',
          _key: `img-${slug}`,
          alt: art.title,
          asset: { _ref: imageAsset._id },
        },
      ],
      legacySource: '/works/paintings/still-life',
    };

    await client.createIfNotExists(doc);
    console.log(`  ✅ [${i + 1}/${artworks.length}] « ${art.title} » created`);
  }

  console.log('\n🎉 Import complete!');
}

main().catch((err) => {
  console.error('❌ Import failed:', err.message || err);
  process.exit(1);
});
