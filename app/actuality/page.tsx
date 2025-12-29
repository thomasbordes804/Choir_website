import type { Metadata } from "next";
import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { RichText } from "@/components/ui/rich-text";
import { getAnnouncements } from "@/lib/sanity/queries";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "long",
});

export const metadata: Metadata = {
  title: "Actuality",
  description: "Latest news, highlights, and announcements from the church choir.",
};

export default async function ActualityPage() {
  const announcements = await getAnnouncements();

  if (announcements.length === 0) {
    return (
      <PageShell
        eyebrow="Actuality"
        title="News & highlights"
        description="Updates from the choir community appear here the moment they are published in the studio."
      >
        <EmptyState
          title="Nothing to share yet"
          description="Post your first announcement in the Sanity Studio to let the community know what’s happening."
          action={(
            <Link
              href="/studio"
              className="inline-flex items-center rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-[color:var(--accent-foreground)]"
            >
              Open Studio
            </Link>
          )}
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Actuality"
      title="News & highlights"
      description="Stories from rehearsals, services, and the choir community."
    >
      <div className="space-y-10">
        {announcements.map((announcement) => (
          <article
            key={announcement._id}
            className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/75 p-8 shadow-lg shadow-indigo-500/10 backdrop-blur-md dark:border-white/10 dark:bg-[rgba(15,23,42,0.6)]"
          >
            <div
              className="absolute inset-0 -z-10 bg-gradient-to-br from-white/50 via-transparent to-indigo-200/40 dark:from-indigo-500/20 dark:to-slate-900/40"
              aria-hidden
            />
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-200">
              <time dateTime={announcement.publishedAt ?? undefined}>
                {announcement.publishedAt
                  ? dateFormatter.format(new Date(announcement.publishedAt))
                  : "Recently"}
              </time>
              {announcement.highlight ? (
                <span className="rounded-full bg-[color:var(--accent)]/10 px-3 py-1 text-[color:var(--accent)]">
                  Highlight
                </span>
              ) : null}
            </div>

            <h2 className="mt-5 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              {announcement.title ?? "Choir update"}
            </h2>

            <div className="mt-6 space-y-4">
              <RichText value={announcement.body} />
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
