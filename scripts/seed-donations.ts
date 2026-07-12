/**
 * Seeds 3 example donations for the "fresque des mécènes" on /don, so the
 * fresco has real data to render instead of the old fake placeholder count.
 */
import { config as loadEnv } from 'dotenv';

loadEnv({ path: '.env.local' });
loadEnv();

const donations = [
  {
    _id: 'donation-example-1',
    _type: 'donation',
    donorName: 'Jeanne Moreau',
    amount: 10,
    tier: 'esquisse',
    color: '#e8c99b',
    donatedAt: '2026-05-12T10:00:00Z',
  },
  {
    _id: 'donation-example-2',
    _type: 'donation',
    donorName: 'Antoine Rousseau',
    amount: 30,
    tier: 'pigment',
    color: '#8d1e11',
    donatedAt: '2026-06-03T14:30:00Z',
  },
  {
    _id: 'donation-example-3',
    _type: 'donation',
    donorName: 'Camille Fabre',
    amount: 75,
    tier: 'fresque',
    color: '#636098',
    donatedAt: '2026-06-28T09:15:00Z',
  },
];

async function main() {
  const { createClient } = await import('@sanity/client');
  const { sanityConfig } = await import('../lib/sanity/config');

  const client = createClient({
    projectId: sanityConfig.projectId,
    dataset: sanityConfig.dataset,
    apiVersion: '2024-01-01',
    useCdn: false,
    token: sanityConfig.token,
  });

  for (const donation of donations) {
    await client.createOrReplace(donation);
    console.log(`Seeded ${donation._id} (${donation.donorName}, ${donation.amount} €)`);
  }
  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
