'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useMusicPlayer } from '@/components/layout/music-player-context';

export interface GalleryCategory {
  slug: string;
  title: string;
  images: string[];
}

export interface PoemVM {
  id: string;
  title: string;
  dedication: string | null;
  lines: string[];
  audioUrl: string | null;
}

interface WorksGalleryProps {
  categories: GalleryCategory[];
  poems: PoemVM[];
}

const ASPECTS = ['3/4', '4/5', '1/1', '4/3', '2/3', '5/4'];

function hexToRgb(hex: string) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return '168,167,212';
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)].join(',');
}

// Deterministic "scatter to center" starting point for the entrance animation.
function scatterFor(i: number) {
  const angle = (i * 137.508) % 360;
  const radius = 520 + ((i * 53) % 420);
  const rad = (angle * Math.PI) / 180;
  const sx = Math.round(Math.cos(rad) * radius);
  const sy = Math.round(Math.sin(rad) * radius);
  const sr = (i % 2 === 0 ? -1 : 1) * (18 + ((i * 11) % 34));
  const delay = Math.min(i * 0.024, 1.1);
  return { sx, sy, sr, delay };
}

// Round-robin across categories so the mosaic mixes disciplines instead of
// rendering one category as a solid block.
function interleave(categories: GalleryCategory[]) {
  const queues = categories.map((c) => ({ title: c.title, slug: c.slug, imgs: [...c.images] }));
  const flat: { src: string; title: string; slug: string }[] = [];
  let more = true;
  while (more) {
    more = false;
    for (const q of queues) {
      if (q.imgs.length) {
        flat.push({ src: q.imgs.shift() as string, title: q.title, slug: q.slug });
        more = true;
      }
    }
  }
  return flat;
}

export function WorksGallery({ categories: rawCategories, poems }: WorksGalleryProps) {
  const { currentTrack, duckVolume } = useMusicPlayer();

  // Guard against duplicate slugs in the incoming data — otherwise the sidebar
  // and tiles get colliding React keys, which floods the console with errors
  // and forces wasteful re-reconciliation.
  const categories = useMemo(() => {
    const seen = new Set<string>();
    return rawCategories.filter((c) => (seen.has(c.slug) ? false : (seen.add(c.slug), true)));
  }, [rawCategories]);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const allSelected = selected.size === 0;
  const [isSwitching, setIsSwitching] = useState(false);

  const toggleCategory = (slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const visible = useMemo(
    () => (allSelected ? categories : categories.filter((c) => selected.has(c.slug))),
    [categories, selected, allSelected]
  );

  useEffect(() => {
    setIsSwitching(true);
    const t = setTimeout(() => setIsSwitching(false), 60);
    return () => clearTimeout(t);
  }, [visible]);

  const tiles = useMemo(() => {
    const flat = interleave(visible);
    const rgb = hexToRgb(currentTrack.color);
    return flat.map((it, i) => {
      const { sx, sy, sr, delay } = scatterFor(i);
      return {
        key: `${it.slug}-${i}`,
        src: it.src,
        pieceTitle: 'Sans titre',
        typeLabel: it.title,
        aspect: ASPECTS[i % ASPECTS.length],
        idleDuration: 6 + (i % 5),
        idleDelay: (i % 7) * 0.35,
        // Static glow — must NOT reference a per-frame CSS variable, or all
        // ~140 blurred box-shadows repaint every animation frame (huge jank).
        glowShadow: `0 0 22px rgba(${rgb}, 0.14)`,
        entranceStyle: {
          ['--sx' as string]: `${sx}px`,
          ['--sy' as string]: `${sy}px`,
          ['--sr' as string]: `${sr}deg`,
          animation: 'frameConverge 1s cubic-bezier(.16,.84,.44,1) both',
          animationDelay: `${delay}s`,
        } as React.CSSProperties,
      };
    });
  }, [visible, currentTrack.color]);

  const totalCount = tiles.length;

  // ---------------------------------------------------------------------
  // Poetry: read a poem aloud (recorded audio if the Studio has one,
  // otherwise the browser's speech synthesis), with line-by-line
  // highlighting for the synthesized case. Ducks the background music
  // while reading, and restores it afterwards.
  // ---------------------------------------------------------------------
  const [poemOverlayOpen, setPoemOverlayOpen] = useState(false);
  const [currentPoemIndex, setCurrentPoemIndex] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [autoMode, setAutoMode] = useState(false);
  const [poemSearch, setPoemSearch] = useState('');
  const poemAudioRef = useRef<HTMLAudioElement | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Voice list loads asynchronously in most browsers — populate it up front
  // (and again on 'voiceschanged') so the first read already picks a good voice.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const load = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
  }, []);

  // Picks the smoothest-sounding French voice available instead of whatever
  // the browser defaults to (often a robotic legacy voice). Priority: online
  // "Natural"/neural voices (Edge/Windows) > Google's voices (Chrome) > any
  // other French voice.
  const pickFrenchVoice = () => {
    const voices = voicesRef.current.length ? voicesRef.current : window.speechSynthesis.getVoices();
    const fr = voices.filter((v) => v.lang?.toLowerCase().startsWith('fr'));
    if (fr.length === 0) return null;
    const byScore = (v: SpeechSynthesisVoice) => {
      const name = v.name.toLowerCase();
      if (/natural|neural/.test(name)) return 3;
      if (/google/.test(name)) return 2;
      return 1;
    };
    return [...fr].sort((a, b) => byScore(b) - byScore(a))[0];
  };

  const currentPoem = poems[currentPoemIndex] || poems[0];

  // Filtered list for the searchable index (159 poems is too many to scroll flat).
  const filteredPoems = useMemo(() => {
    const q = poemSearch.trim().toLowerCase();
    const withIndex = poems.map((p, i) => ({ poem: p, index: i }));
    if (!q) return withIndex;
    return withIndex.filter(({ poem }) => poem.title.toLowerCase().includes(q));
  }, [poems, poemSearch]);

  const stopReading = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
    if (poemAudioRef.current) {
      poemAudioRef.current.pause();
      poemAudioRef.current.currentTime = 0;
    }
    setIsReading(false);
    setCurrentLineIndex(-1);
    duckVolume(false);
  };

  const speak = (index: number) => {
    const poem = poems[index];
    if (!poem) return;

    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
    if (poemAudioRef.current) poemAudioRef.current.pause();

    // Duck the background music instead of pausing it, so it stays present
    // but gives room to the poem being read.
    duckVolume(true);

    if (poem.audioUrl) {
      const audio = new Audio(poem.audioUrl);
      poemAudioRef.current = audio;
      audio.onended = () => {
        setIsReading(false);
        if (autoMode) nextPoem(true);
        else duckVolume(false);
      };
      void audio.play();
      setIsReading(true);
      setCurrentLineIndex(-1);
      setCurrentPoemIndex(index);
      return;
    }

    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const joined = poem.lines.join('. ');
    const offsets: number[] = [];
    let cursor = 0;
    poem.lines.forEach((line) => {
      offsets.push(cursor);
      cursor += line.length + 2;
    });

    const utterance = new SpeechSynthesisUtterance(joined);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.92;
    utterance.pitch = 1.02;
    const frVoice = pickFrenchVoice();
    if (frVoice) utterance.voice = frVoice;

    utterance.onboundary = (e) => {
      let lineIndex = 0;
      for (let i = 0; i < offsets.length; i++) if (e.charIndex >= offsets[i]) lineIndex = i;
      setCurrentLineIndex(lineIndex);
    };
    utterance.onend = () => {
      setIsReading(false);
      setCurrentLineIndex(-1);
      if (autoMode) nextPoem(true);
      else duckVolume(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsReading(true);
    setCurrentPoemIndex(index);
  };

  const selectPoem = (i: number) => {
    stopReading();
    setCurrentPoemIndex(i);
  };

  const nextPoem = (autoPlay: boolean) => {
    const idx = (currentPoemIndex + 1) % poems.length;
    if (autoPlay) speak(idx);
    else selectPoem(idx);
  };

  const prevPoem = () => selectPoem((currentPoemIndex - 1 + poems.length) % poems.length);

  // Keep the active poem visible in the index list when navigating.
  useEffect(() => {
    if (!poemOverlayOpen) return;
    const el = document.querySelector('[data-poem-active="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [currentPoemIndex, poemOverlayOpen]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
      poemAudioRef.current?.pause();
    };
  }, []);

  if (categories.length === 0) return null;

  return (
    <section
      className="relative overflow-hidden border-t border-zinc-200 bg-white px-6 py-11 lg:px-10"
      style={{
        background: `radial-gradient(70% 55% at 18% 8%, ${currentTrack.color}28, transparent 62%), radial-gradient(60% 50% at 85% 65%, ${currentTrack.color}20, transparent 65%), var(--paper-card, #fcf8f4)`,
        transition: 'background 1.2s ease',
      }}
    >
      <div className="relative mx-auto max-w-[1560px]">
        {/* CONTROL BAR — poetry (music playback lives in the hero bar) */}
        <div className="mb-9 flex flex-wrap items-center justify-end gap-5 border-b border-zinc-200 pb-6">
          {poems.length > 0 && (
            <button
              type="button"
              onClick={() => setPoemOverlayOpen(true)}
              className="group relative flex items-center gap-3.5 rounded-full border border-zinc-200 bg-white py-2 pl-2 pr-6 shadow-[0_14px_30px_-18px_rgba(24,24,27,0.32)] transition-all duration-300 hover:border-[#8d1e11] hover:-translate-y-0.5 hover:shadow-[0_18px_38px_-14px_rgba(141,30,17,0.35)]"
            >
              <span
                className="relative flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-full"
                style={{ background: 'radial-gradient(circle at 32% 28%, #a8433a, #8d1e11 70%)' }}
              >
                <span className="pointer-events-none absolute -inset-[5px] animate-[poemRing_2.6s_ease-in-out_infinite] rounded-full border border-[#8d1e1159]" />
                <span className="-translate-y-px font-[family-name:var(--font-playfair)] text-lg text-[#fffdf8]">&#8221;</span>
              </span>
              <span className="text-left">
                <span className="block font-[family-name:var(--font-playfair)] text-[17px] italic font-semibold leading-tight text-zinc-900">
                  Écouter un poème
                </span>
                <span className="mt-0.5 block text-[10.5px] uppercase tracking-[0.08em] text-zinc-400">
                  {poems.length} poésie{poems.length > 1 ? 's' : ''} · voix de synthèse
                </span>
              </span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-start gap-10">
          {/* SIDEBAR — slim, discrete */}
          <aside className="w-[172px] flex-shrink-0">
            <div className="sticky top-28 flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="relative py-[7px] pl-3.5 pr-2.5 text-left text-[12.5px] font-medium tracking-[0.01em] transition-colors duration-300"
                style={{ color: allSelected ? '#18181b' : '#a1a1aa' }}
              >
                <span
                  className="absolute left-0 top-1/2 h-4 w-0.5 origin-center -translate-y-1/2 bg-[#ff6b6b] transition-transform duration-500"
                  style={{ transform: `translateY(-50%) ${allSelected ? 'scaleY(1)' : 'scaleY(0)'}` }}
                />
                Toutes les œuvres
              </button>

              {categories.map((cat) => {
                const isActive = !allSelected && selected.has(cat.slug);
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => toggleCategory(cat.slug)}
                    aria-pressed={isActive}
                    className="relative w-full py-[7px] pl-3.5 pr-2.5 text-left text-[12.5px] font-medium leading-[1.35] tracking-[0.01em] transition-colors duration-300"
                    style={{ color: isActive ? '#18181b' : '#a1a1aa' }}
                  >
                    <span
                      className="absolute left-0 top-1/2 h-4 w-0.5 origin-center -translate-y-1/2 bg-[#ff6b6b] transition-transform duration-500"
                      style={{ transform: `translateY(-50%) ${isActive ? 'scaleY(1)' : 'scaleY(0)'}` }}
                    />
                    {cat.title}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* GALLERY WALL — one unified salon-style mosaic */}
          <div className="min-w-[280px] flex-1 transition-opacity duration-500 ease-out" style={{ opacity: isSwitching ? 0 : 1 }}>
            <div style={{ columns: '230px', columnGap: '22px' }}>
              {tiles.map((item) => (
                <div key={item.key} className="mb-[22px] [break-inside:avoid]">
                  <div className="gallery-tile block" style={item.entranceStyle}>
                    <span
                      className="gallery-mat block rounded-[3px] border border-[#ece8e1] bg-[#f7f5f1] p-3 pb-[14px] transition-[transform,box-shadow,border-color] duration-300"
                      style={{ boxShadow: `0 14px 30px -18px rgba(24,24,27,.25), ${item.glowShadow}` }}
                    >
                      <span
                        className="relative block w-full overflow-hidden"
                        style={{ aspectRatio: item.aspect, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.1)' }}
                      >
                        <Image
                          src={item.src}
                          alt={item.typeLabel}
                          fill
                          className="object-cover"
                          sizes="240px"
                          loading="lazy"
                          // These are already ~8KB pre-generated thumbnails; skip
                          // Next's on-demand optimizer (a single-threaded bottleneck
                          // in dev) and serve them directly.
                          unoptimized
                        />
                      </span>
                      <span className="mt-[11px] block text-center font-[family-name:var(--font-playfair)] text-[12.5px] text-zinc-700">
                        {item.pieceTitle}
                      </span>
                      <span className="mt-0.5 block text-center text-[9.5px] tracking-[0.05em] text-zinc-400">
                        {item.typeLabel}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {tiles.length === 0 && (
              <div className="py-20 text-center text-sm text-zinc-400">
                Sélectionnez au moins une section pour afficher des œuvres.
              </div>
            )}
          </div>
        </div>
      </div>

      {poemOverlayOpen && currentPoem && typeof document !== 'undefined' && createPortal(
        <div className="poem-overlay-in fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setPoemOverlayOpen(false)}
          />

          <div className="relative flex h-[88vh] w-full max-w-[880px] overflow-hidden rounded-lg bg-[#fffdf8] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)]">
            <button
              type="button"
              onClick={() => setPoemOverlayOpen(false)}
              aria-label={isReading ? 'Continuer la lecture en arrière-plan' : 'Fermer'}
              className="absolute right-4 top-3 z-10 text-xl leading-none text-zinc-400 transition-colors hover:text-zinc-700"
            >
              ×
            </button>

            {/* READING PANE — the poem sits at the reader's eye level (vertically
                centered), and only this pane scrolls if a poem runs long. */}
            <div className="flex-1 overflow-y-auto">
              <div className="mx-auto flex min-h-full max-w-[520px] flex-col justify-center px-8 py-12 sm:px-12">
                <div className="text-center text-[10px] uppercase tracking-[0.28em] text-[#8d1e11]">Poésie</div>
                <div className="mt-1 text-center text-[10px] tracking-[0.12em] text-zinc-300">
                  {currentPoemIndex + 1} / {poems.length}
                </div>
                <h3 className="mt-2 text-center font-[family-name:var(--font-playfair)] text-[28px] font-medium leading-tight text-zinc-900">
                  {currentPoem.title}
                </h3>
                {currentPoem.dedication && (
                  <div className="mt-2 text-center font-[family-name:var(--font-playfair)] text-[13px] italic text-zinc-400">
                    {currentPoem.dedication}
                  </div>
                )}

                <div className="mt-9 mb-2 flex flex-col gap-3.5 text-center">
                  {currentPoem.lines.map((line, i) => (
                    <div
                      key={i}
                      className="font-[family-name:var(--font-playfair)] text-[19px] leading-[1.55] text-zinc-900 transition-[opacity,font-weight] duration-400"
                      style={{
                        opacity: currentPoem.audioUrl ? 0.9 : i === currentLineIndex ? 1 : currentLineIndex === -1 ? 0.62 : 0.3,
                        fontWeight: !currentPoem.audioUrl && i === currentLineIndex ? 500 : 400,
                      }}
                    >
                      {line}
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-center gap-[18px]">
                  <button type="button" onClick={prevPoem} className="text-[13px] text-zinc-500 transition-colors hover:text-zinc-900">
                    ‹ Préc.
                  </button>
                  <button
                    type="button"
                    onClick={() => (isReading ? stopReading() : speak(currentPoemIndex))}
                    aria-label="Lire le poème"
                    className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-zinc-900 bg-zinc-900 text-[11px] text-[#fffdf8] transition-transform hover:scale-105"
                  >
                    {isReading ? '❚❚' : '▶'}
                  </button>
                  <button type="button" onClick={() => nextPoem(false)} className="text-[13px] text-zinc-500 transition-colors hover:text-zinc-900">
                    Suiv. ›
                  </button>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2.5">
                  <span className="text-[11px] text-zinc-500">Lecture automatique</span>
                  <button
                    type="button"
                    onClick={() => setAutoMode((v) => !v)}
                    aria-label="Lecture automatique"
                    className="relative h-[18px] w-[34px] rounded-full transition-colors duration-300"
                    style={{ background: autoMode ? '#ff6b6b' : '#e4e4e7' }}
                  >
                    <span
                      className="absolute left-0.5 top-0.5 h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-300"
                      style={{ transform: autoMode ? 'translateX(16px)' : 'translateX(0)' }}
                    />
                  </button>
                </div>

                <div className="mt-5 text-center text-[10px] text-zinc-300">
                  {currentPoem.audioUrl ? 'Enregistrement audio' : 'Voix de synthèse (navigateur)'}
                </div>
              </div>
            </div>

            {/* INDEX PANE — searchable anthology; keeps the 159 poems browsable
                without burying the poem itself. Hidden on small screens (use
                Préc./Suiv. there). */}
            <aside className="hidden w-[264px] flex-shrink-0 flex-col border-l border-[#ece8e1] bg-[#faf8f3] sm:flex">
              <div className="border-b border-[#ece8e1] px-4 pb-3 pt-5">
                <div className="mb-2.5 flex items-baseline justify-between">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Anthologie</span>
                  <span className="text-[10px] text-zinc-400">
                    {poemSearch ? `${filteredPoems.length} / ${poems.length}` : poems.length}
                  </span>
                </div>
                <input
                  type="search"
                  value={poemSearch}
                  onChange={(e) => setPoemSearch(e.target.value)}
                  placeholder="Rechercher un poème…"
                  className="w-full rounded-full border border-[#e4ded2] bg-white px-3.5 py-1.5 text-[12px] text-zinc-700 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#8d1e11]"
                />
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
                {filteredPoems.map(({ poem, index }) => {
                  const active = index === currentPoemIndex;
                  return (
                    <button
                      key={poem.id}
                      type="button"
                      data-poem-active={active}
                      onClick={() => selectPoem(index)}
                      className="block w-full rounded-[4px] px-2.5 py-1.5 text-left font-[family-name:var(--font-playfair)] text-[13px] italic leading-snug transition-colors"
                      style={{
                        color: active ? '#fffdf8' : '#71717a',
                        background: active ? '#8d1e11' : 'transparent',
                      }}
                    >
                      {poem.title}
                    </button>
                  );
                })}
                {filteredPoems.length === 0 && (
                  <div className="px-3 py-6 text-center text-[12px] text-zinc-400">Aucun poème trouvé.</div>
                )}
              </div>
            </aside>
          </div>
        </div>,
        document.body
      )}

      {/* Persistent mini-player — reading continues after closing the overlay,
          so visitors can keep browsing the gallery while the poem plays. */}
      {isReading && !poemOverlayOpen && currentPoem && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed bottom-6 right-6 z-[85] flex max-w-[280px] items-center gap-3 rounded-full border border-[#e8ded4] bg-[#fffdf8] py-2 pl-2 pr-4 shadow-[0_16px_36px_-14px_rgba(0,0,0,0.4)]"
          style={{ animation: 'poemOverlayIn 0.3s ease both' }}
        >
          <button
            type="button"
            onClick={stopReading}
            aria-label="Arrêter la lecture"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#8d1e11] text-[10px] text-[#fffdf8] transition-transform hover:scale-105"
          >
            ❚❚
          </button>
          <button
            type="button"
            onClick={() => setPoemOverlayOpen(true)}
            className="min-w-0 flex-1 text-left"
            aria-label="Rouvrir la lecture du poème"
          >
            <span className="block text-[9px] uppercase tracking-[0.16em] text-[#8d1e11]">Lecture en cours</span>
            <span className="block truncate font-[family-name:var(--font-playfair)] text-[13px] italic text-zinc-800">
              {currentPoem.title}
            </span>
          </button>
        </div>,
        document.body
      )}

      <style jsx global>{`
        @keyframes frameConverge {
          from {
            transform: translate(var(--sx, 0), var(--sy, 0)) rotate(var(--sr, 0deg)) scale(0.4);
            opacity: 0;
          }
          to {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
          }
        }
        @keyframes idleFloat {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-7px) rotate(0.35deg);
          }
        }
        @keyframes poemRing {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.18);
            opacity: 0;
          }
        }
        .poem-overlay-in {
          animation: poemOverlayIn 0.35s ease both;
        }
        @keyframes poemOverlayIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .gallery-tile:hover .gallery-mat {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 26px 48px -20px rgba(24, 24, 27, 0.32);
        }
      `}</style>
    </section>
  );
}
