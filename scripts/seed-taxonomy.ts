/**
 * Seed the Œuvres taxonomy (workCategory) and the biography chapters
 * (biographyTopic) with the exact rubrics of the old site, artsparadise.net.
 *
 * Names, slugs and display order were extracted from the live old site
 * (2026-07-03): /works/ for the 13 rubrics d'œuvres + the 7 sous-rubriques de
 * peintures, /bio/ for the 15 chapitres de biographie. Each document keeps its
 * old-site path in `legacyPath` so the future content-migration script can
 * match pieces to their rubric automatically.
 *
 * Safe to re-run: documents are created with deterministic ids via
 * createIfNotExists, so existing documents (and any edits made in the Studio)
 * are never overwritten.
 *
 * Usage:
 *   npm run seed:taxonomy                      # writes to Sanity (requires a token with write access)
 *   npm run seed:taxonomy -- --dry-run         # prints what would be created
 *   npm run seed:taxonomy -- --ndjson out.ndjson   # writes an NDJSON file for `sanity dataset import`
 */
import { config as loadEnv } from 'dotenv';
import fs from 'fs';
import { createClient } from '@sanity/client';

// Imports are hoisted, so env loading happens here rather than in
// lib/sanity/config (whose module-level reads would run too early).
loadEnv({ path: '.env.local' });
loadEnv();

const dryRun = process.argv.includes('--dry-run');
const ndjsonFlagIndex = process.argv.indexOf('--ndjson');
const ndjsonPath =
  ndjsonFlagIndex !== -1 ? process.argv[ndjsonFlagIndex + 1] || 'taxonomy.ndjson' : null;

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// --- Œuvres : rubriques de premier niveau (ordre de la page /works/) ---
// Le type de document conseillé pour les œuvres de chaque rubrique :
//   painting   → paintings, harpsichord, table, juvenilia, portraits
//   drawing    → drawings, colorings
//   sculpture  → sculptures
//   appliedArt → fabric, packages, perfume-bottles, posters
//   poem       → poetry
const topCategories = [
  { slug: 'paintings', title: 'Peintures sur toiles' },
  { slug: 'drawings', title: 'Dessins, pastels et techniques mixtes' },
  { slug: 'harpsichord', title: 'Peintures sur clavecin' },
  { slug: 'table', title: 'Peintures sur table' },
  { slug: 'fabric', title: 'Impression sur tissu' },
  { slug: 'sculptures', title: 'Sculptures' },
  { slug: 'colorings', title: 'Coloriages pédagogiques et thérapeutiques' },
  { slug: 'packages', title: 'Design de packagings' },
  { slug: 'perfume-bottles', title: 'Flacons de parfum' },
  { slug: 'posters', title: 'Affiches événementielles' },
  { slug: 'poetry', title: 'Poésies' },
  { slug: 'juvenilia', title: 'Œuvres de jeunesse' },
  { slug: 'portraits', title: 'Portraits' },
];

// --- Œuvres : sous-rubriques de « Peintures sur toiles » (ordre de /works/paintings/) ---
const paintingSubCategories = [
  { slug: 'still-life', title: 'Natures mortes' },
  { slug: 'people', title: 'Personnages' },
  { slug: 'landscapes', title: 'Paysages' },
  { slug: 'marines', title: 'Marines' },
  { slug: 'heavens', title: 'Cieux' },
  { slug: 'music', title: 'Musique et danse' },
  { slug: 'abstract', title: 'Abstrait' },
];

// --- Biographie : chapitres (ordre de la page /bio/) ---
const biographyTopics = [
  {
    slug: 'grand-paris-en-choeurs',
    title: "Festival Grand Pari's en Chœurs dans l'harmonie",
    legacyPath: '/grand-paris-en-choeurs',
  },
  { slug: 'organist', title: "Michel Hilger à l'orgue", legacyPath: '/bio/organist' },
  {
    slug: 'organ',
    title: "Restauration d'orgues avec Art au Pluriel",
    legacyPath: '/bio/organ',
  },
  {
    slug: 'retirement-home',
    title: 'Animations en maisons de retraite',
    legacyPath: '/bio/retirement-home',
  },
  { slug: 'cv', title: 'Curriculum Vitae', legacyPath: '/bio/cv' },
  { slug: 'interviews', title: 'Entretiens', legacyPath: '/bio/interviews' },
  { slug: 'associations', title: 'Associations', legacyPath: '/bio/associations' },
  { slug: 'choirs', title: 'Chorales', legacyPath: '/bio/choirs' },
  { slug: 'orchesters', title: 'Orchestres', legacyPath: '/bio/orchesters' },
  { slug: 'festivals', title: 'Festivals', legacyPath: '/bio/festivals' },
  { slug: 'recordings', title: 'Enregistrements musicaux', legacyPath: '/bio/recordings' },
  { slug: 'movies', title: 'Filmographie', legacyPath: '/bio/movies' },
  { slug: 'teaching', title: 'Enseignements', legacyPath: '/bio/teaching' },
  { slug: 'childhood', title: 'Enfance', legacyPath: '/bio/childhood' },
  {
    slug: 'photobook',
    title: 'Album photo de Michel Hilger',
    legacyPath: '/bio/photobook',
  },
];

type SeedDoc = {
  _id: string;
  _type: string;
  title: string;
  slug: { _type: 'slug'; current: string };
  order: number;
  [key: string]: unknown;
};

function buildDocs(): SeedDoc[] {
  const docs: SeedDoc[] = [];

  topCategories.forEach((cat, i) => {
    docs.push({
      _id: `workCategory-${cat.slug}`,
      _type: 'workCategory',
      title: cat.title,
      slug: { _type: 'slug', current: cat.slug },
      order: i + 1,
      legacyPath: `/works/${cat.slug}`,
    });
  });

  paintingSubCategories.forEach((cat, i) => {
    docs.push({
      _id: `workCategory-paintings-${cat.slug}`,
      _type: 'workCategory',
      title: cat.title,
      slug: { _type: 'slug', current: cat.slug },
      order: i + 1,
      legacyPath: `/works/paintings/${cat.slug}`,
      parent: { _type: 'reference', _ref: 'workCategory-paintings' },
    });
  });

  biographyTopics.forEach((topic, i) => {
    docs.push({
      _id: `biographyTopic-${topic.slug}`,
      _type: 'biographyTopic',
      title: topic.title,
      slug: { _type: 'slug', current: topic.slug },
      order: i + 1,
      legacyPath: topic.legacyPath,
    });
  });

  return docs;
}

async function main() {
  const docs = buildDocs();

  // Documents with the same slug may already exist under a different _id
  // (created by hand in the Studio, or by an earlier seed). Skip those to
  // avoid duplicates in the navigation.
  const existing: { _id: string; _type: string; slug: string }[] = dryRun
    ? []
    : await client.fetch(
        `*[_type in ["workCategory", "biographyTopic"]]{ _id, _type, "slug": slug.current }`
      );

  const toCreate = docs.filter(
    (doc) =>
      !existing.some(
        (e) =>
          e._type === doc._type &&
          (e._id === doc._id || e._id === `drafts.${doc._id}` || e.slug === doc.slug.current)
      )
  );
  const skipped = docs.length - toCreate.length;

  if (dryRun) {
    console.log(`🔍 Dry run — ${docs.length} documents seraient créés (si absents) :\n`);
    docs.forEach((d) => console.log(`  ${d._type}  ${d._id}  « ${d.title} »`));
    return;
  }

  if (toCreate.length === 0) {
    console.log(`✅ Rien à créer : les ${docs.length} rubriques existent déjà.`);
    return;
  }

  if (ndjsonPath) {
    fs.writeFileSync(ndjsonPath, toCreate.map((d) => JSON.stringify(d)).join('\n') + '\n');
    console.log(`📄 ${toCreate.length} documents écrits dans ${ndjsonPath}`);
    console.log(
      `   Importez-les avec :  cd studio && npx sanity dataset import ../${ndjsonPath} production`
    );
    return;
  }

  const tx = client.transaction();
  toCreate.forEach((doc) => tx.createIfNotExists(doc));
  await tx.commit();

  console.log(`✅ ${toCreate.length} documents créés${skipped ? `, ${skipped} déjà présents (ignorés)` : ''} :`);
  toCreate.forEach((d) => console.log(`  ${d._type}  « ${d.title} »`));
}

main().catch((err) => {
  console.error('❌ Échec du seed :', err.message || err);
  process.exit(1);
});
