/**
 * One-off test: generate an AI narration for a single poem via OpenAI TTS
 * and upload it as that poem's `audio` asset in Sanity, so /works picks it
 * up automatically (recorded audio takes priority over browser speech synthesis).
 */
import { config as loadEnv } from 'dotenv';

// override: true because a stale OPENAI_API_KEY was already set in the shell
// environment, shadowing the correct value in .env.local. Must run before the
// sanity config module import below (its env reads happen at import time).
loadEnv({ path: '.env.local', override: true });

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createClient } = require('@sanity/client') as typeof import('@sanity/client');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { sanityConfig } = require('../lib/sanity/config') as typeof import('../lib/sanity/config');

const POEM_ID = 'poem-aigle-royal';

const client = createClient({
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: sanityConfig.token,
});

async function main() {
  const poem = await client.fetch<{ _id: string; title: string; bodyText: string }>(
    `*[_id == $id][0]{ _id, title, "bodyText": pt::text(body) }`,
    { id: POEM_ID }
  );
  if (!poem) throw new Error(`Poem ${POEM_ID} not found`);

  console.log(`Generating narration for "${poem.title}"...`);

  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini-tts',
      voice: 'onyx',
      input: poem.bodyText,
      instructions:
        'Speak as a calm, warm, smooth French narrator reading poetry aloud: gentle pacing, slight pauses at line breaks, expressive but understated, no rush.',
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI TTS failed: ${res.status} ${await res.text()}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  console.log(`Got ${buffer.length} bytes, uploading to Sanity...`);

  const asset = await client.assets.upload('file', buffer, {
    filename: `${poem._id}-narration.mp3`,
    contentType: 'audio/mpeg',
  });

  await client
    .patch(poem._id)
    .set({ audio: { _type: 'file', asset: { _type: 'reference', _ref: asset._id } } })
    .commit();

  console.log(`Done. Poem "${poem.title}" now has audio asset ${asset._id}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
