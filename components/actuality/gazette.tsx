'use client';

import { useMemo, useState } from 'react';

import { RichText } from '@/components/ui/rich-text';
import type { Announcement } from '@/lib/sanity/queries';

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' });

const issueFormatter = new Intl.DateTimeFormat('fr-FR', { month: 'long' });

/** Plain-text preview of a portable-text body (first blocks only). */
function bodyPreview(body: Announcement['body'], maxLen = 220): string {
  if (!Array.isArray(body)) return '';
  const text = (body as Array<Record<string, unknown>>)
    .filter((b) => b._type === 'block' && Array.isArray(b.children))
    .map((b) => (b.children as Array<{ text?: string }>).map((c) => c.text ?? '').join(''))
    .join(' ')
    .trim();
  return text.length > maxLen ? `${text.slice(0, maxLen).replace(/\s+\S*$/, '')}…` : text;
}

/** First inline image in the body, if the schema ever includes them. */
function bodyImage(body: Announcement['body']): { url: string; alt: string } | null {
  if (!Array.isArray(body)) return null;
  const img = (body as Array<Record<string, unknown>>).find(
    (b) => b._type === 'image' && typeof (b as { url?: string }).url === 'string'
  ) as { url: string; alt?: string } | undefined;
  return img ? { url: img.url, alt: img.alt ?? '' } : null;
}

/** True when the body contains a video embed. */
function bodyHasVideo(body: Announcement['body']): boolean {
  if (!Array.isArray(body)) return false;
  return (body as Array<Record<string, unknown>>).some((b) => b._type === 'videoEmbed');
}

const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 183;

interface GazetteProps {
  announcements: Announcement[];
}

/**
 * "La Gazette d'ArtsParadise" — the actuality feed presented as an atelier
 * newspaper: drawn masthead, typographic rules, a lead story ("À la une")
 * with its large image/video, briefs in the right column, and a quill-line
 * search over the last six months. Recent news leads by default.
 */
export function Gazette({ announcements }: GazetteProps) {
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const now = Date.now();

  // Default view: everything from the last 6 months, newest first (the query
  // already sorts desc). Falls back to the full (still newest-first) list when
  // nothing was published that recently, so the page is never empty just
  // because the last post predates the window. Search filters by title + body text.
  const withinSixMonths = useMemo(
    () =>
      announcements.filter((a) => {
        const t = a.publishedAt ? new Date(a.publishedAt).getTime() : now;
        return now - t <= SIX_MONTHS_MS;
      }),
    [announcements, now]
  );
  const isFallback = withinSixMonths.length === 0 && announcements.length > 0;

  const visible = useMemo(() => {
    const recent = isFallback ? announcements : withinSixMonths;
    const q = query.trim().toLowerCase();
    if (!q) return recent;
    return recent.filter((a) => {
      const haystack = `${a.title ?? ''} ${bodyPreview(a.body, 100000)}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [announcements, withinSixMonths, isFallback, query]);

  // The lead: first highlighted item, else the most recent.
  const lead = useMemo(() => {
    if (visible.length === 0) return null;
    return visible.find((a) => a.highlight) ?? visible[0];
  }, [visible]);

  const briefs = useMemo(() => visible.filter((a) => a._id !== lead?._id), [visible, lead]);

  const issueDate = new Date();
  const issueMonth = issueFormatter.format(issueDate);
  const issueYear = issueDate.getFullYear();

  const leadImage = lead ? bodyImage(lead.body) : null;
  const leadHasVideo = lead ? bodyHasVideo(lead.body) : false;

  return (
    <section className="relative px-4 py-16 sm:px-6 lg:px-8">
      <div
        className="mx-auto max-w-5xl overflow-hidden rounded-md border border-[#e4ddd0] bg-[#f3efe8]"
        style={{ boxShadow: '0 30px 60px -30px rgba(0,0,0,.4)' }}
      >
        {/* ============ MASTHEAD ============ */}
        <div className="mx-6 border-b-2 border-zinc-900 px-4 pb-5 pt-9 text-center sm:mx-9">
          <div className="text-[9.5px] uppercase tracking-[0.34em] text-[#8d1e11]">
            Bulletin des arts — publié depuis l&apos;atelier
          </div>
          <div className="mt-1.5 font-[family-name:var(--font-playfair)] text-3xl font-semibold text-zinc-900 sm:text-[42px]">
            La Gazette d&apos;ArtsParadise
          </div>
          <div className="mt-2.5 flex items-center justify-center gap-6 text-[10.5px] uppercase tracking-[0.12em] text-zinc-500">
            <span className="whitespace-nowrap capitalize">{issueMonth} {issueYear}</span>
            <span>·</span>
            <span className="whitespace-nowrap">Sucy-en-Brie</span>
          </div>
        </div>

        {/* ============ SEARCH RIBBON ============ */}
        <div className="mx-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-b border-[#e4ddd0] px-4 py-3.5 sm:mx-9">
          <span className="font-[family-name:var(--font-playfair)] text-[13px] italic text-zinc-500">
            Feuilleter les six derniers mois —
          </span>
          <label className="flex min-w-[230px] items-center gap-2 border-b border-[#b7ac99] px-1 py-0.5">
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
              <circle cx="7" cy="7" r="5" fill="none" stroke="#78716c" strokeWidth="1.4" />
              <line x1="11" y1="11" x2="15" y2="15" stroke="#78716c" strokeWidth="1.4" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="concert, exposition, chorale…"
              aria-label="Rechercher dans les actualités"
              className="w-full bg-transparent text-xs text-zinc-700 outline-none placeholder:text-zinc-400"
            />
          </label>
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="rounded-full border border-[#d6cdbc] px-3 py-1 text-[10px] uppercase tracking-[0.08em] text-zinc-500 transition-colors hover:border-zinc-900 hover:text-zinc-900"
            >
              Effacer
            </button>
          )}
        </div>

        {/* ============ FRONT PAGE ============ */}
        {visible.length === 0 ? (
          <div className="px-9 py-16 text-center">
            <div className="font-[family-name:var(--font-playfair)] text-lg italic text-zinc-500">
              Aucune nouvelle ne correspond à « {query} » ces six derniers mois.
            </div>
          </div>
        ) : (
          <div className="grid gap-0 px-6 pb-10 pt-8 sm:px-9 md:grid-cols-[1.45fr_1fr]">
            {/* -------- LEAD STORY -------- */}
            {lead && (
              <article className="md:border-r md:border-[#e4ddd0] md:pr-8">
                <div className="mb-3 flex items-center gap-2.5">
                  {lead.highlight && (
                    <span className="whitespace-nowrap border border-[#8d1e11] px-2.5 py-0.5 text-[9.5px] uppercase tracking-[0.2em] text-[#8d1e11]">
                      À la une
                    </span>
                  )}
                  <time
                    dateTime={lead.publishedAt ?? undefined}
                    className="whitespace-nowrap text-[10.5px] uppercase tracking-[0.1em] text-zinc-400"
                  >
                    {lead.publishedAt ? dateFormatter.format(new Date(lead.publishedAt)) : 'Récemment'}
                  </time>
                </div>
                <h3 className="mb-3.5 font-[family-name:var(--font-playfair)] text-2xl font-semibold leading-[1.15] text-zinc-900 sm:text-3xl">
                  {lead.title ?? 'Mise à jour'}
                </h3>

                {leadImage && (
                  <figure className="relative mb-1.5 aspect-video w-full overflow-hidden">
                    {/* body images come with absolute URLs from Sanity */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={leadImage.url}
                      alt={leadImage.alt}
                      className="h-full w-full object-cover"
                      style={{ filter: 'saturate(.9)' }}
                    />
                    {leadHasVideo && (
                      <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[rgba(24,20,17,.78)] py-1.5 pl-2 pr-3.5 text-[10.5px] tracking-[0.08em] text-[#f3efe8]">
                        <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#e8c99b]">
                          <svg viewBox="0 0 10 10" width="8" height="8">
                            <path d="M3 1.5 L8 5 L3 8.5 Z" fill="#18181b" />
                          </svg>
                        </span>
                        Vidéo
                      </span>
                    )}
                  </figure>
                )}

                <div className="font-[family-name:var(--font-playfair)] text-[15px] leading-[1.65] text-zinc-700">
                  {expandedId === lead._id ? (
                    <RichText value={lead.body} />
                  ) : (
                    <p className="m-0">{bodyPreview(lead.body)}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setExpandedId(expandedId === lead._id ? null : lead._id)}
                  className="mt-3.5 border-b border-[#8d1e11] pb-0.5 text-[11px] uppercase tracking-[0.14em] text-[#8d1e11] transition-opacity hover:opacity-70"
                >
                  {expandedId === lead._id ? 'Replier' : 'Lire la suite'}
                </button>
              </article>
            )}

            {/* -------- BRIEFS COLUMN -------- */}
            <div className="mt-8 flex flex-col md:mt-0 md:pl-8">
              {briefs.length === 0 && (
                <div className="py-6 text-center font-[family-name:var(--font-playfair)] text-sm italic text-zinc-400">
                  — pas d&apos;autres nouvelles ce mois-ci —
                </div>
              )}
              {briefs.map((a, i) => {
                const img = bodyImage(a.body);
                const isExpanded = expandedId === a._id;
                return (
                  <article
                    key={a._id}
                    className={`py-4 ${i < briefs.length - 1 ? 'border-b border-[#e4ddd0]' : ''} ${i === 0 ? 'pt-0' : ''}`}
                  >
                    <time
                      dateTime={a.publishedAt ?? undefined}
                      className="whitespace-nowrap text-[10px] uppercase tracking-[0.1em] text-zinc-400"
                    >
                      {a.publishedAt ? dateFormatter.format(new Date(a.publishedAt)) : 'Récemment'}
                    </time>
                    <div className={img ? 'mt-1.5 flex gap-3' : 'mt-1.5'}>
                      {img && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={img.url}
                          alt={img.alt}
                          className="h-[74px] w-[74px] flex-shrink-0 object-cover"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : a._id)}
                        className="text-left"
                      >
                        <h4 className="font-[family-name:var(--font-playfair)] text-[17px] font-medium leading-[1.3] text-zinc-900 transition-colors hover:text-[#8d1e11]">
                          {a.title ?? 'Mise à jour'}
                        </h4>
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="mt-3 text-[13px] leading-relaxed text-zinc-600">
                        <RichText value={a.body} />
                      </div>
                    )}
                    {!isExpanded && bodyPreview(a.body, 90) && (
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-zinc-500">
                        {bodyPreview(a.body, 90)}
                      </p>
                    )}
                  </article>
                );
              })}

              <div className="mt-auto pt-4 text-center">
                <span className="font-[family-name:var(--font-playfair)] text-[12.5px] italic text-zinc-500">
                  — {visible.length} nouvelle{visible.length > 1 ? 's' : ''}
                  {isFallback ? '' : ' ces six derniers mois'} —
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
