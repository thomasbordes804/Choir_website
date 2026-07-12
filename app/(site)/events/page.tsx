import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { getEvents } from "@/lib/sanity/queries";

const eventDateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "long",
  timeStyle: "short",
});

const formatEventDate = (value: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return eventDateFormatter.format(date);
};

export const metadata: Metadata = {
  title: "Events",
  description: "Stay up to date with upcoming masses, rehearsals, and choir performances.",
};

export default async function EventsPage() {
  const events = await getEvents();

  if (events.length === 0) {
    return (
      <PageShell
        eyebrow="Schedule"
        title="Events"
        description="Once new liturgies or gatherings are scheduled they will appear here."
      >
        <EmptyState
          title="No events scheduled"
          description="Publish forthcoming masses, rehearsals, or concerts from the Sanity Studio."
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Schedule"
      title="Events"
      description="Keep track of the choir’s commitments across the liturgical calendar."
    >
      <ul className="space-y-4">
        {events.map((event) => {
          const formattedDate = formatEventDate(event.date);

          return (
            <li
              key={event._id}
              className="relative overflow-hidden rounded-3xl border border-white/50 bg-white/80 p-6 shadow-md shadow-indigo-500/10 transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[rgba(15,23,42,0.6)]"
            >
              <div
                className="absolute inset-0 -z-10 bg-gradient-to-br from-white/40 via-transparent to-indigo-200/30 dark:from-indigo-500/20 dark:via-transparent dark:to-slate-900/30"
                aria-hidden
              />
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  {event.title ?? "Untitled event"}
                </h2>
                {formattedDate ? (
                  <time
                    dateTime={event.date ?? undefined}
                    className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    {formattedDate}
                  </time>
                ) : null}
                {event.location ? (
                  <address className="not-italic text-sm text-zinc-600 dark:text-zinc-300">
                    {event.location}
                  </address>
                ) : null}
                {event.description ? (
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                    {event.description}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </PageShell>
  );
}