/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Import biography content from artsparadise.net into the existing
 * `biographyTopic` documents in Sanity.
 *
 * For each of the 15 chapters it:
 *   - fetches the chapter page, extracts rich text (Portable Text) + images
 *   - uploads inline images and photo galleries to Sanity
 *   - follows the chapter's sub-pages (CV → Études, Orchestres → Quintette…)
 *     and imports each as a `biographySubSection`
 *   - patches the chapter document (body, mediaGallery, subSections)
 *
 * Existing title/slug/order/legacyPath on the documents are preserved.
 *
 * Usage:
 *   npm run seed:biography -- --dry-run   # print what would be imported
 *   npm run seed:biography                # write to Sanity
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@sanity/client';
import {
  extractPage,
  findSubPageLinks,
  type Block,
  type ExtractedImage,
  type GalleryItem,
} from './lib/artsparadise-rsc';

loadEnv({ path: '.env.local' });
loadEnv();

const dryRun = process.argv.includes('--dry-run');

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

// Chapter doc id → base URL on the old site (used to resolve sub-pages).
const chapters: { docId: string; url: string }[] = [
  { docId: 'biographyTopic-grand-paris-en-choeurs', url: `${BASE_URL}/grand-paris-en-choeurs` },
  { docId: 'biographyTopic-organist', url: `${BASE_URL}/bio/organist` },
  { docId: 'biographyTopic-organ', url: `${BASE_URL}/bio/organ` },
  { docId: 'biographyTopic-retirement-home', url: `${BASE_URL}/bio/retirement-home` },
  { docId: 'biographyTopic-cv', url: `${BASE_URL}/bio/cv` },
  { docId: 'biographyTopic-interviews', url: `${BASE_URL}/bio/interviews` },
  { docId: 'biographyTopic-associations', url: `${BASE_URL}/bio/associations` },
  { docId: 'biographyTopic-choirs', url: `${BASE_URL}/bio/choirs` },
  { docId: 'biographyTopic-orchesters', url: `${BASE_URL}/bio/orchesters` },
  { docId: 'biographyTopic-festivals', url: `${BASE_URL}/bio/festivals` },
  { docId: 'biographyTopic-recordings', url: `${BASE_URL}/bio/recordings` },
  { docId: 'biographyTopic-movies', url: `${BASE_URL}/bio/movies` },
  { docId: 'biographyTopic-teaching', url: `${BASE_URL}/bio/teaching` },
  { docId: 'biographyTopic-childhood', url: `${BASE_URL}/bio/childhood` },
  { docId: 'biographyTopic-photobook', url: `${BASE_URL}/bio/photobook` },
];

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`fetch ${url} → ${res.status}`);
  return res.text();
}

// --- Image upload (deduped by source URL within a run) ---------------------
const uploadCache = new Map<string, string>(); // src → asset _id

function guessContentType(src: string): string {
  if (/\.png$/i.test(src)) return 'image/png';
  if (/\.webp$/i.test(src)) return 'image/webp';
  if (/\.svg$/i.test(src)) return 'image/svg+xml';
  return 'image/jpeg';
}

async function uploadImage(src: string): Promise<string | null> {
  if (uploadCache.has(src)) return uploadCache.get(src)!;
  try {
    const res = await fetch(`${BASE_URL}${src}`, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const filename = src.split('/').pop()!.split('?')[0];
    const asset = await client.assets.upload('image', buf, {
      filename,
      contentType: guessContentType(src),
    });
    uploadCache.set(src, asset._id);
    return asset._id;
  } catch (err: any) {
    console.error(`      ⚠ image failed ${src}: ${err.message}`);
    return null;
  }
}

let bodyKey = 0;
const imgObj = (assetId: string, alt: string, caption?: string) => ({
  _type: 'image',
  _key: `bimg-${(bodyKey++).toString(36)}`,
  alt: alt || undefined,
  caption: caption || undefined,
  asset: { _type: 'reference', _ref: assetId },
});

/** Interleave uploaded inline images into the blocks, dropping title h1 + nav links. */
async function buildBody(
  blocks: Block[],
  images: ExtractedImage[],
  navKeys?: Set<string>,
): Promise<any[]> {
  // Pre-upload all inline images.
  const uploaded = new Map<string, string>();
  for (const img of images) {
    const id = await uploadImage(img.src);
    if (id) uploaded.set(img.src + '@' + img.position, id);
  }

  const byPos = new Map<number, ExtractedImage[]>();
  for (const img of images) {
    if (!byPos.has(img.position)) byPos.set(img.position, []);
    byPos.get(img.position)!.push(img);
  }

  const result: any[] = [];
  let droppedTitle = false;
  for (let i = 0; i <= blocks.length; i++) {
    for (const img of byPos.get(i) || []) {
      const id = uploaded.get(img.src + '@' + img.position);
      if (id) result.push(imgObj(id, img.alt));
    }
    if (i < blocks.length) {
      const b = blocks[i];
      if (b.style === 'h1' && !droppedTitle) { droppedTitle = true; continue; }
      if (navKeys && navKeys.has(b._key)) continue;
      result.push(b);
    }
  }
  return result;
}

async function buildGallery(gallery: GalleryItem[]): Promise<any[]> {
  const out: any[] = [];
  for (const g of gallery) {
    if (g.video) continue; // skip video entries (handled elsewhere)
    const id = await uploadImage(g.src);
    if (id) out.push(imgObj(id, g.title));
  }
  return out;
}

async function importChapter(chapter: { docId: string; url: string }) {
  const html = await fetchHtml(chapter.url);
  const page = extractPage(html);
  const { links, navBlockKeys } = findSubPageLinks(page.blocks);

  console.log(`\n📖 ${chapter.docId}`);
  console.log(`   title: ${page.title}`);
  console.log(`   body blocks: ${page.blocks.length}  inline images: ${page.images.length}  gallery: ${page.gallery.length}  sub-pages: ${links.length}`);
  if (links.length) console.log(`   sub-pages: ${links.map((l) => l.href).join(', ')}`);

  if (dryRun) return;

  const body = await buildBody(page.blocks, page.images, navBlockKeys);
  const mediaGallery = await buildGallery(page.gallery);

  // Sub-sections
  const subSections: any[] = [];
  for (const link of links) {
    try {
      const subHtml = await fetchHtml(`${chapter.url}/${link.href}`);
      const subPage = extractPage(subHtml);
      const subBody = await buildBody(subPage.blocks, subPage.images);
      const subGallery = await buildGallery(subPage.gallery);
      subSections.push({
        _type: 'biographySubSection',
        _key: `sub-${link.href}`.replace(/[^a-z0-9-]/gi, '-'),
        title: subPage.title || link.title,
        legacySlug: link.href,
        body: subBody.length ? subBody : undefined,
        gallery: subGallery.length ? subGallery : undefined,
      });
      console.log(`     ↳ ${link.href}: ${subBody.length} blocks, ${subGallery.length} gallery`);
    } catch (err: any) {
      console.error(`     ⚠ sub-page ${link.href} failed: ${err.message}`);
    }
  }

  const patch: any = {};
  if (body.length) patch.body = body;
  if (mediaGallery.length) patch.mediaGallery = mediaGallery;
  if (subSections.length) patch.subSections = subSections;

  if (Object.keys(patch).length === 0) {
    console.log('   (nothing to set)');
    return;
  }

  await client.patch(chapter.docId).set(patch).commit();
  console.log(`   ✅ patched (${Object.keys(patch).join(', ')})`);
}

async function main() {
  console.log(`🎬 Importing biography content${dryRun ? ' (dry run)' : ''}…`);
  for (const chapter of chapters) {
    try {
      await importChapter(chapter);
    } catch (err: any) {
      console.error(`❌ ${chapter.docId} failed: ${err.message}`);
    }
  }
  console.log('\n🎉 Biography import complete!');
}

main().catch((err) => {
  console.error('❌ Import failed:', err.message || err);
  process.exit(1);
});
