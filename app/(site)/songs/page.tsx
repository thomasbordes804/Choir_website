import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { getSongs } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Songs",
  description: "Browse the hymns, psalms, and repertoire curated for the choir.",
};

export default async function SongsPage() {
  const songs = await getSongs();

  if (songs.length === 0) {
    return (
      <PageShell
        eyebrow="Repertoire"
        title="Songs"
        description="Once music has been catalogued in the Sanity Studio it will be listed here with composer information."
      >
        <EmptyState
          title="No songs recorded"
          description="Add hymns, psalms, and arrangements in the Sanity Studio to build out the choir’s library."
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Repertoire"
      title="Songs"
      description="Revisit the choir’s repertoire with composer details and thematic categories."
    >
      <ul className="space-y-3">
        {songs.map((song) => (
          <li
            key={song._id}
            className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/80 p-6 shadow-md shadow-indigo-500/10 transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[rgba(15,23,42,0.6)]"
          >
            <div
              className="absolute inset-0 -z-10 bg-gradient-to-br from-white/40 via-transparent to-indigo-200/30 dark:from-indigo-500/20 dark:via-transparent dark:to-slate-900/30"
              aria-hidden
            />
            <div className="relative space-y-2">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {song.title ?? "Untitled piece"}
                </h2>
                {song.categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {song.categories.map((category) => (
                      <span
                        key={`${song._id}-${category}`}
                        className="inline-flex items-center rounded-full bg-white/50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700 shadow-sm dark:bg-white/10 dark:text-indigo-200"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                {song.composer ?? "Composer information forthcoming"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
