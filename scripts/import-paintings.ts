/**
 * Import all paintings from artsparadise.net into Sanity.
 * Reads artwork data scraped from the old site (src paths + titles),
 * downloads each image, uploads it as a Sanity asset, and creates
 * a `painting` document with the correct category references.
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

const catIdMap: Record<string, string> = {
  'still-life': 'workCategory-paintings-still-life',
  people: 'workCategory-paintings-people',
  landscapes: 'workCategory-paintings-landscapes',
  marines: 'workCategory-paintings-marines',
  heavens: 'workCategory-paintings-heavens',
  music: 'workCategory-paintings-music',
  abstract: 'workCategory-paintings-abstract',
};

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

async function scrapeCategory(catSlug: string): Promise<{ src: string; title: string }[]> {
  const url = `${BASE_URL}/works/paintings/${catSlug}/`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const html = await res.text();

  const re =
    /\{\\"src\\":\\"(\/assets\/works\/[^"\\]+)\\",\\"thumbSrc\\":\\"([^"\\]+)\\",\\"size\\":\[([0-9,]+)\],\\"thumbSize\\":\[([0-9,]+)\],\\"title\\":\\"([^"\\]+)\\",\\"video\\":(true|false)\}/g;
  const items: { src: string; title: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    items.push({ src: m[1], title: m[5] });
  }
  return items;
}

async function main() {
  const categoriesToImport = Object.keys(catIdMap);
  console.log(`🎨 Scraping ${categoriesToImport.length} painting subcategories from artsparadise.net…\n`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const catSlug of categoriesToImport) {
    console.log(`\n📂 Scraping ${catSlug}…`);
    const artworks = await scrapeCategory(catSlug);
    console.log(`   Found ${artworks.length} artworks`);

    for (const [i, art] of artworks.entries()) {
      const slug = slugify(art.title);
      const docId = `painting-${catSlug}-${slug}`;

      const existing = await client.fetch('count(*[_id == $id || _id == $draftId])', {
        id: docId,
        draftId: `drafts.${docId}`,
      });
      if (existing > 0) {
        console.log(`  ⏭  [${i + 1}/${artworks.length}] « ${art.title} » exists`);
        skipped++;
        continue;
      }

      try {
        console.log(`  ⬇  [${i + 1}/${artworks.length}] « ${art.title} »…`);
        const imageBuffer = await downloadImage(`${BASE_URL}${art.src}`);
        const filename = art.src.split('/').pop()!;

        const imageAsset = await client.assets.upload('image', imageBuffer, {
          filename,
          contentType: 'image/webp',
        });

        await client.createIfNotExists({
          _id: docId,
          _type: 'painting',
          title: art.title,
          slug: { _type: 'slug', current: slug },
          order: i + 1,
          support: 'toile',
          categories: [
            { _type: 'reference', _ref: catIdMap[catSlug], _key: `cat-${catSlug}` },
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
          legacySource: `/works/paintings/${catSlug}`,
        });

        console.log(`  ✅ [${i + 1}/${artworks.length}] « ${art.title} » created`);
        created++;
      } catch (err: any) {
        console.error(`  ❌ [${i + 1}/${artworks.length}] « ${art.title} » failed: ${err.message}`);
        failed++;
      }
    }
  }

  console.log(`\n🎉 Done! ${created} created, ${skipped} skipped, ${failed} failed.`);
}

main().catch((err) => {
  console.error('❌ Import failed:', err.message || err);
  process.exit(1);
});
