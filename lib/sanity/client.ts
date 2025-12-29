import "server-only";

import { createClient, type QueryParams } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "3j1hq2pe";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01";

const copyrightNotice = process.env.NODE_ENV === "development"
  ? "Using Sanity preview CDN is disabled in development to ensure fresh data."
  : undefined;

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
});

if (copyrightNotice) {
  console.debug(copyrightNotice);
}

export type SanityFetchOptions = {
  /**
   * Configure Next.js caching behaviour. Defaults to 60 seconds.
   */
  revalidate?: number | false;
  /**
   * Provide cache tags so ISR revalidation can be triggered by tag.
   */
  tags?: string[];
  /**
   * Override the cache mode passed to fetch. Defaults to `force-cache`.
   */
  cache?: RequestCache;
};

export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {},
  options: SanityFetchOptions = {},
): Promise<T> {
  const { revalidate = 60, tags, cache } = options;

  const nextOptions: Record<string, unknown> = {};

  if (typeof revalidate === "number") {
    nextOptions.revalidate = revalidate;
  }

  if (Array.isArray(tags) && tags.length > 0) {
    nextOptions.tags = tags;
  }

  return sanityClient.fetch<T>(query, params, {
    cache: cache ?? "force-cache",
    ...(Object.keys(nextOptions).length > 0 ? { next: nextOptions } : {}),
  });
}
