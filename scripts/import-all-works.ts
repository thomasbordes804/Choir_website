/**
 * Import ALL artwork categories from artsparadise.net into Sanity.
 *
 * Handles three content shapes:
 *   1. Image galleries WITH titles (paintings subcats, sculptures)
 *   2. Image galleries WITHOUT titles (drawings, harpsichord, table, etc.)
 *      → generates a title from the filename
 *   3. Poetry pages (text content, no images in the gallery)
 *      → creates poem documents with just title + slug
 *
 * Each category is mapped to its correct Sanity document type:
 *   painting   → harpsichord, table, juvenilia, portraits
 *   drawing    → drawings, colorings
 *   sculpture  → sculptures
 *   appliedArt → fabric, packages, perfume-bottles, posters
 *   poem       → poetry
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

// --- Category → document type mapping ---

type CatConfig = {
  docType: string;
  catId: string;
  support?: string;       // for paintings
  discipline?: string;    // for appliedArt
  technique?: string;     // for drawings
};

const categoryConfig: Record<string, CatConfig> = {
  // Paintings (on non-canvas supports + cross-cutting rubrics)
  harpsichord:      { docType: 'painting', catId: 'workCategory-harpsichord', support: 'clavecin' },
  table:            { docType: 'painting', catId: 'workCategory-table', support: 'table' },
  juvenilia:        { docType: 'painting', catId: 'workCategory-juvenilia', support: 'autre' },
  portraits:        { docType: 'painting', catId: 'workCategory-portraits', support: 'toile' },

  // Drawings
  drawings:         { docType: 'drawing', catId: 'workCategory-drawings' },
  colorings:        { docType: 'drawing', catId: 'workCategory-colorings', technique: 'coloriage' },

  // Sculpture
  sculptures:       { docType: 'sculpture', catId: 'workCategory-sculptures' },

  // Applied art & design
  fabric:           { docType: 'appliedArt', catId: 'workCategory-fabric', discipline: 'tissu' },
  packages:         { docType: 'appliedArt', catId: 'workCategory-packages', discipline: 'packaging' },
  'perfume-bottles': { docType: 'appliedArt', catId: 'workCategory-perfume-bottles', discipline: 'flacon' },
  posters:          { docType: 'appliedArt', catId: 'workCategory-posters', discipline: 'affiche' },

  // Poetry (handled separately — text pages, not image galleries)
  poetry:           { docType: 'poem', catId: 'workCategory-poetry' },
};

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function titleFromFilename(filename: string): string {
  return filename
    .replace(/\.(webp|jpg|png|jpeg)$/i, '')
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

async function fetchPage(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

async function downloadImage(url: string): Promise<Buffer> {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

type ScrapedItem = { src: string; title: string };

function scrapeGalleryItems(html: string): ScrapedItem[] {
  const re =
    /\{\\\"src\\\":\\\"(\/assets\/works\/[^\\\"]+)\\\".*?\\\"title\\\":\\\"([^\\\"]*)\\\".*?\\\"video\\\":(true|false)\}/g;
  const items: ScrapedItem[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const src = m[1];
    if (src.includes('.thumb.')) continue; // skip thumbnails
    const title = m[2] || titleFromFilename(src.split('/').pop()!);
    items.push({ src, title });
  }
  return items;
}

function scrapePoemSlugs(html: string): { slug: string; title: string }[] {
  const re = /\\\"href\\\":\\\"([a-z0-9-]+)\\\".*?\\\"children\\\":\\\"([^\\\"]+)\\\"/g;
  const skip = new Set(['index', 'blog', 'bio', 'works', 'books', 'useful-resources', 'video', 'about', 'radioparadise']);
  const poems: { slug: string; title: string }[] = [];
  const seen = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    if (skip.has(m[1]) || seen.has(m[1])) continue;
    seen.add(m[1]);
    poems.push({ slug: m[1], title: m[2] });
  }
  return poems;
}

async function docExists(id: string): Promise<boolean> {
  const count = await client.fetch('count(*[_id == $id || _id == $draftId])', {
    id,
    draftId: `drafts.${id}`,
  });
  return count > 0;
}

async function importImageGallery(catSlug: string, config: CatConfig) {
  const html = await fetchPage(`${BASE_URL}/works/${catSlug}/`);
  const items = scrapeGalleryItems(html);
  console.log(`   Found ${items.length} artworks`);

  let created = 0, skipped = 0, failed = 0;

  for (const [i, art] of items.entries()) {
    const slug = slugify(art.title);
    const docId = `${config.docType}-${catSlug}-${slug}`;

    if (await docExists(docId)) {
      console.log(`  ⏭  [${i + 1}/${items.length}] « ${art.title} » exists`);
      skipped++;
      continue;
    }

    try {
      console.log(`  ⬇  [${i + 1}/${items.length}] « ${art.title} »…`);
      const imageBuffer = await downloadImage(`${BASE_URL}${art.src}`);
      const filename = art.src.split('/').pop()!;
      const imageAsset = await client.assets.upload('image', imageBuffer, {
        filename,
        contentType: 'image/webp',
      });

      const doc: Record<string, unknown> & { _id: string; _type: string } = {
        _id: docId,
        _type: config.docType,
        title: art.title,
        slug: { _type: 'slug', current: slug },
        order: i + 1,
        categories: [
          { _type: 'reference', _ref: config.catId, _key: `cat-${catSlug}` },
        ],
        images: [
          {
            _type: 'captionedImage',
            _key: `img-${slug}`,
            alt: art.title,
            asset: { _ref: imageAsset._id },
          },
        ],
        legacySource: `/works/${catSlug}`,
      };

      if (config.support) doc.support = config.support;
      if (config.discipline) doc.discipline = config.discipline;
      if (config.technique) doc.technique = config.technique;

      await client.createIfNotExists(doc);
      console.log(`  ✅ [${i + 1}/${items.length}] « ${art.title} » created`);
      created++;
    } catch (err: any) {
      console.error(`  ❌ [${i + 1}/${items.length}] « ${art.title} » failed: ${err.message}`);
      failed++;
    }
  }

  return { created, skipped, failed };
}

async function importPoems(config: CatConfig) {
  const html = await fetchPage(`${BASE_URL}/works/poetry/`);
  const poems = scrapePoemSlugs(html);
  console.log(`   Found ${poems.length} poems`);

  let created = 0, skipped = 0, failed = 0;

  for (const [i, poem] of poems.entries()) {
    const docId = `poem-${poem.slug}`;

    if (await docExists(docId)) {
      console.log(`  ⏭  [${i + 1}/${poems.length}] « ${poem.title} » exists`);
      skipped++;
      continue;
    }

    try {
      // Fetch individual poem page for the body text
      let bodyBlocks: unknown[] = [];
      try {
        const poemHtml = await fetchPage(`${BASE_URL}/works/poetry/${poem.slug}`);
        // Extract poem text from <p> tags inside the poem page
        const textRe = /<p[^>]*>([\s\S]*?)<\/p>/g;
        let pm: RegExpExecArray | null;
        const paragraphs: string[] = [];
        while ((pm = textRe.exec(poemHtml))) {
          const text = pm[1]
            .replace(/<br\s*\/?>/g, '\n')
            .replace(/<[^>]+>/g, '')
            .replace(/&amp;/g, '&')
            .replace(/&#x27;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .trim();
          if (text && !text.includes('Poème de Michel Hilger')) {
            paragraphs.push(text);
          }
        }
        if (paragraphs.length > 0) {
          bodyBlocks = paragraphs.map((p, idx) => ({
            _type: 'block',
            _key: `block-${idx}`,
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: `span-${idx}`, text: p, marks: [] }],
          }));
        }
      } catch {
        // If poem page fails, create with empty body
      }

      const doc: Record<string, unknown> = {
        _id: docId,
        _type: 'poem',
        title: poem.title,
        slug: { _type: 'slug', current: poem.slug },
        order: i + 1,
        categories: [
          { _type: 'reference', _ref: config.catId, _key: 'cat-poetry' },
        ],
        legacySource: `/works/poetry/${poem.slug}`,
      };

      if (bodyBlocks.length > 0) {
        doc.body = bodyBlocks;
      }

      await client.createIfNotExists(doc);
      console.log(`  ✅ [${i + 1}/${poems.length}] « ${poem.title} » created`);
      created++;
    } catch (err: any) {
      console.error(`  ❌ [${i + 1}/${poems.length}] « ${poem.title} » failed: ${err.message}`);
      failed++;
    }
  }

  return { created, skipped, failed };
}

async function main() {
  console.log('🎨 Importing all artwork categories from artsparadise.net…\n');

  let totalCreated = 0, totalSkipped = 0, totalFailed = 0;

  for (const [catSlug, config] of Object.entries(categoryConfig)) {
    console.log(`\n📂 ${catSlug} (→ ${config.docType})`);

    let result: { created: number; skipped: number; failed: number };

    if (config.docType === 'poem') {
      result = await importPoems(config);
    } else {
      result = await importImageGallery(catSlug, config);
    }

    totalCreated += result.created;
    totalSkipped += result.skipped;
    totalFailed += result.failed;
  }

  console.log(`\n🎉 All done! ${totalCreated} created, ${totalSkipped} skipped, ${totalFailed} failed.`);
}

main().catch((err) => {
  console.error('❌ Import failed:', err.message || err);
  process.exit(1);
});
