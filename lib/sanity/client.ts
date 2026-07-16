import "server-only";

import { createClient, type QueryParams } from "next-sanity";
import {sanityConfig } from "@/lib/sanity/config";

export const sanityClient = createClient({
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: sanityConfig.token,
})

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
