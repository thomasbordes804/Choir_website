import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import {
  getEvents,
  getHighlightedAnnouncements,
  getSiteSettings,
  getSummaryCounts,
} from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Home",
};

const announcementDateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "long",
});

const eventDateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "long",
  timeStyle: "short",
});

function truncate(value: string | null, limit = 140) {
  if (!value) return null;
  return value.length > limit ? `${value.slice(0, limit)}…` : value;
}

export default async function Home() {
  const [counts, siteSettings, highlights, upcomingEvents] = await Promise.all([
    getSummaryCounts(),
    getSiteSettings(),
    getHighlightedAnnouncements(3),
    getEvents(3),
  ]);

  const heroTitle = siteSettings?.homepageHeroTitle ?? "Voices that lift the spirit";
  const heroSubtitle =
    siteSettings?.homepageHeroSubtitle ??
    "Experience the warmth of a community united in worship and song.";
  const heroTagline = siteSettings?.tagline ?? "Sacred harmonies every Sunday";

  const navigationBoard = [
    {
      title: "Actuality",
      href: "/actuality",
      description: "Catch up on highlights, announcements, and choir life moments.",
      accent: "from-purple-500/80 via-violet-500/80 to-indigo-500/80",
      count: highlights.length,
      label: highlights.length === 1 ? "update" : "updates",
    },
    {
      title: "Biography",
      href: "/biography",
      description: "Discover the story and mission that guide our ensemble.",
      accent: "from-cyan-400/80 via-sky-400/80 to-blue-500/80",
    },
    {
      title: "Songs",
      href: "/songs",
      description: "Browse psalms, hymns, and anthems from our repertoire.",
      accent: "from-amber-400/80 via-orange-400/80 to-pink-500/80",
      count: counts.songCount,
      label: counts.songCount === 1 ? "song" : "songs",
    },
    {
      title: "Events",
      href: "/events",
      description: "Keep track of liturgies, concerts, and rehearsals ahead.",
      accent: "from-emerald-400/80 via-teal-400/80 to-cyan-500/80",
      count: counts.eventCount,
      label: counts.eventCount === 1 ? "event" : "events",
    },
    {
      title: "Choir Members",
      href: "/choir",
      description: "Get to know the voices who bring colour to every hymn.",
      accent: "from-rose-400/80 via-purple-400/80 to-indigo-500/80",
      count: counts.choirCount,
      label: counts.choirCount === 1 ? "member" : "members",
    },
    {
      title: "Studio",
      href: "/studio",
      description: "Manage content, repertoire, and announcements in Sanity Studio.",
      accent: "from-slate-400/80 via-slate-500/80 to-slate-600/80",
    },
  ];

  const featuredEvent = siteSettings?.featuredEvent ?? upcomingEvents[0] ?? null;
  const secondaryEvents = featuredEvent
    ? upcomingEvents.filter((event) => event._id !== featuredEvent._id)
    : upcomingEvents.slice(1);

  return (
    <div className="relative">
      <section className="relative mx-auto max-w-6xl px-6 pt-24 lg:px-8">
        <div className="relative overflow-hidden rounded-[34px] border border-white/40 bg-white/75 px-8 py-14 shadow-2xl shadow-indigo-500/20 backdrop-blur-md dark:border-white/10 dark:bg-[rgba(15,23,42,0.72)]">
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-200/60 via-transparent to-purple-300/50 opacity-80 dark:from-indigo-500/30 dark:to-sky-500/20"
            aria-hidden
          />
          <div className="grid gap-12 lg:grid-cols-[1fr,0.85fr] lg:items-center">
            <div className="space-y-8 text-zinc-900 dark:text-zinc-100">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-700 shadow-sm shadow-indigo-200/60 dark:bg-indigo-500/20 dark:text-indigo-200">
                {heroTagline}
              </span>
              <div className="space-y-5">
                <h1 className="text-4xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-5xl dark:text-white">
                  {heroTitle}
                </h1>
                <p className="max-w-2xl text-lg text-zinc-700 dark:text-zinc-200">
                  {heroSubtitle}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/actuality"
                  className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-6 py-2.5 text-sm font-semibold text-[color:var(--accent-foreground)] shadow-lg shadow-[color:var(--accent)]/30 transition hover:scale-[1.02]"
                >
                  Stay informed
                  <span aria-hidden>&rarr;</span>
                </Link>
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/30 px-6 py-2.5 text-sm font-semibold text-[color:var(--accent)] transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent)]/10"
                >
                  Upcoming events
                </Link>
              </div>
              <dl className="grid gap-6 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-5 text-center shadow-sm dark:border-white/10 dark:bg-white/5">
                  <dt className="text-xs font-medium uppercase tracking-[0.25em] text-indigo-500">Voices</dt>
                  <dd className="mt-3 text-3xl font-semibold text-zinc-900 dark:text-white">{counts.choirCount}</dd>
                </div>
                <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-5 text-center shadow-sm dark:border-white/10 dark:bg-white/5">
                  <dt className="text-xs font-medium uppercase tracking-[0.25em] text-indigo-500">Repertoire</dt>
                  <dd className="mt-3 text-3xl font-semibold text-zinc-900 dark:text-white">{counts.songCount}</dd>
                </div>
                <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-5 text-center shadow-sm dark:border-white/10 dark:bg-white/5">
                  <dt className="text-xs font-medium uppercase tracking-[0.25em] text-indigo-500">Engagements</dt>
                  <dd className="mt-3 text-3xl font-semibold text-zinc-900 dark:text-white">{counts.eventCount}</dd>
                </div>
              </dl>
            </div>
            <div className="relative flex h-80 items-center justify-center">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-400/30 via-purple-400/20 to-sky-400/40 blur-3xl" aria-hidden />
              {siteSettings?.homepageHeroImage ? (
                <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/50 shadow-xl shadow-indigo-500/20">
                  <Image
                    src={siteSettings.homepageHeroImage.url}
                    alt={siteSettings?.churchName ?? "Choir rehearsal"}
                    fill
                    sizes="(min-width: 1024px) 420px, 100vw"
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="relative flex h-full w-full items-center justify-center rounded-3xl border border-white/40 bg-gradient-to-br from-indigo-400/70 via-purple-400/70 to-sky-500/70 shadow-xl shadow-indigo-500/30">
                  <div className="text-center text-white">
                    <p className="text-sm uppercase tracking-[0.35em] text-white/70">Resonance</p>
                    <p className="mt-4 text-3xl font-semibold">Where voices meet</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12 pt-10 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {navigationBoard.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative overflow-hidden rounded-3xl border border-white/50 bg-white/70 p-6 shadow-lg shadow-indigo-500/10 transition duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-white/10 dark:bg-[rgba(15,23,42,0.65)]"
            >
              <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${item.accent} opacity-60 transition duration-300 group-hover:opacity-80`} aria-hidden />
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{item.title}</h2>
                  <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-200">{item.description}</p>
                </div>
                {item.count !== undefined ? (
                  <span className="rounded-full bg-white/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.26em] text-indigo-700 shadow-sm dark:bg-white/10 dark:text-indigo-200">
                    {item.count} {item.label}
                  </span>
                ) : null}
              </div>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 transition group-hover:translate-x-1 dark:text-zinc-100">
                Enter {item.title.toLowerCase()}
                <span aria-hidden>&rarr;</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <PageShell
        eyebrow="Community"
        title="What&apos;s resonating this week"
        description="Catch the latest updates from the choir loft and mark the performances ahead."
      >
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.7fr),minmax(0,1fr)]">
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Latest actuality</h2>
              <Link
                href="/actuality"
                className="text-sm font-semibold text-[color:var(--accent)] hover:underline"
              >
                View all
              </Link>
            </div>
            {highlights.length > 0 ? (
              <div className="space-y-4">
                {highlights.map((announcement) => (
                  <article
                    key={announcement._id}
                    className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/75 p-6 shadow-md shadow-indigo-500/10 transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[rgba(15,23,42,0.6)]"
                  >
                    <div
                      className="absolute inset-0 -z-10 bg-gradient-to-br from-white/40 via-transparent to-indigo-200/30 dark:from-indigo-500/20 dark:via-transparent dark:to-slate-900/30"
                      aria-hidden
                    />
                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-200">
                      <time dateTime={announcement.publishedAt ?? undefined}>
                        {announcement.publishedAt
                          ? announcementDateFormatter.format(new Date(announcement.publishedAt))
                          : "Recently"}
                      </time>
                      {announcement.highlight ? (
                        <span className="rounded-full bg-[color:var(--accent)]/10 px-3 py-1 text-[color:var(--accent)]">
                          Highlight
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                      {announcement.title ?? "Choir update"}
                    </h3>
                    {truncate(announcement.excerpt) ? (
                      <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-200">
                        {truncate(announcement.excerpt)}
                      </p>
                    ) : null}
                    <Link
                      href="/actuality"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--accent)] hover:translate-x-1"
                    >
                      Continue in Actuality
                      <span aria-hidden>&rarr;</span>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No announcements yet"
                description="We’ll publish highlights from rehearsals and services as soon as they’re available."
                action={(
                  <Link
                    href="/studio"
                    className="inline-flex items-center rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-[color:var(--accent-foreground)]"
                  >
                    Add an update
                  </Link>
                )}
              />
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Upcoming gatherings</h2>
              <Link href="/events" className="text-sm font-semibold text-[color:var(--accent)] hover:underline">
                All events
              </Link>
            </div>
            {featuredEvent ? (
              <div className="space-y-6">
                <article className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/80 p-6 shadow-lg shadow-indigo-500/10 dark:border-white/10 dark:bg-[rgba(15,23,42,0.6)]">
                  <div
                    className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-200/40 via-transparent to-purple-200/40 dark:from-indigo-500/20 dark:via-transparent dark:to-slate-900/40"
                    aria-hidden
                  />
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-200">
                    Featured event
                  </p>
                  <h3 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                    {featuredEvent.title ?? "Upcoming celebration"}
                  </h3>
                  {featuredEvent.date ? (
                    <time
                      dateTime={featuredEvent.date}
                      className="mt-3 flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-200"
                    >
                      {eventDateFormatter.format(new Date(featuredEvent.date))}
                    </time>
                  ) : null}
                  {featuredEvent.location ? (
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                      {featuredEvent.location}
                    </p>
                  ) : null}
                  {featuredEvent.description ? (
                    <p className="mt-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
                      {featuredEvent.description}
                    </p>
                  ) : null}
                  <Link
                    href="/events"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--accent)] hover:translate-x-1"
                  >
                    View full schedule
                    <span aria-hidden>&rarr;</span>
                  </Link>
                </article>

                {secondaryEvents.length > 0 ? (
                  <ul className="space-y-4">
                    {secondaryEvents.map((event) => (
                      <li
                        key={event._id}
                        className="flex items-start justify-between gap-4 rounded-2xl border border-white/40 bg-white/70 px-4 py-4 text-sm shadow-sm shadow-indigo-500/10 dark:border-white/10 dark:bg-[rgba(15,23,42,0.5)]"
                      >
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {event.title ?? "Upcoming gathering"}
                          </p>
                          {event.date ? (
                            <time className="text-xs text-zinc-600 dark:text-zinc-300" dateTime={event.date}>
                              {eventDateFormatter.format(new Date(event.date))}
                            </time>
                          ) : null}
                        </div>
                        {event.location ? (
                          <p className="text-xs text-zinc-500 dark:text-zinc-300">{event.location}</p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : (
              <EmptyState
                title="No events planned yet"
                description="Once services or rehearsals are scheduled they’ll appear here automatically."
                action={(
                  <Link
                    href="/studio"
                    className="inline-flex items-center rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-[color:var(--accent-foreground)]"
                  >
                    Schedule an event
                  </Link>
                )}
              />
            )}
          </div>
        </div>
      </PageShell>
    </div>
  );
}
