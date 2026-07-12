'use client';

import { useMemo, useState } from 'react';

import type { Donation } from '@/lib/sanity/queries';

/**
 * « Le mécène » — the donation flow as a painter's gesture.
 *
 * - A collective fresco shows the brushstrokes already given: one stroke per
 *   real `donation` document in Sanity, in its chosen color. Laid out in
 *   wide, airy rows (max 8 per row) instead of cramming everything into a
 *   single tight line, so it stays legible as donations pile up.
 * - Three tiers named after atelier materials: L'esquisse (10 €), Le pigment
 *   (30 €), La fresque (free amount + free color).
 * - The CTA hands off to your payment provider (HelloAsso / PayPal / Stripe
 *   link) with the chosen amount — set DONATION_URL below.
 */

const DONATION_URL = 'https://www.helloasso.com/associations/votre-association'; // ← replace

const TIERS = [
  { id: 'esquisse', label: "L'esquisse", amount: 10, color: '#e8c99b', blurb: "une touche d'ocre sur la fresque" },
  { id: 'pigment', label: 'Le pigment', amount: 30, color: '#8d1e11', blurb: 'un trait bordeaux + votre nom au mur des mécènes', featured: true },
  { id: 'fresque', label: 'La fresque', amount: null, color: null, blurb: 'vous choisissez le montant et la couleur' },
] as const;

const FREE_COLORS = ['#8d1e11', '#636098', '#e8c99b', '#7d9468', '#a8433a', '#a8a7d4', '#b39244'];

const FRESCO_WIDTH = 640;
const MARGIN_X = 34;
const ROW_HEIGHT = 46;
const MAX_COLS = 8;

/** Lays real donations out as wide, unhurried brushstrokes — few per row so
 *  the fresco reads as airy rather than a cramped tally mark. */
function layoutStrokes(donations: Donation[]) {
  const count = donations.length;
  if (count === 0) return { strokes: [], rows: 1 };

  const cols = Math.min(count, MAX_COLS);
  const rows = Math.ceil(count / cols);
  const colWidth = (FRESCO_WIDTH - MARGIN_X * 2) / Math.max(cols - 1, 1);
  const strokeLen = Math.min(78, cols > 1 ? colWidth * 0.6 : 120);

  // Deterministic jitter (seeded) so strokes look hand-drawn without
  // reshuffling on every render.
  let seed = 11;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  const strokes = donations.map((donation, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = cols > 1 ? MARGIN_X + col * colWidth : FRESCO_WIDTH / 2 - strokeLen / 2;
    const y = 30 + row * ROW_HEIGHT + rand() * 6;
    const bend = (rand() - 0.5) * 22;
    return {
      key: donation._id,
      d: `M${x.toFixed(0)} ${y.toFixed(0)} q ${(strokeLen / 2).toFixed(0)} ${bend.toFixed(0)} ${strokeLen.toFixed(0)} 0`,
      color: donation.color || '#8d1e11',
      width: 8 + rand() * 3,
      opacity: 0.7 + rand() * 0.25,
      donorName: donation.donorName,
      amount: donation.amount,
    };
  });

  return { strokes, rows };
}

interface MecenePanelProps {
  donations: Donation[];
}

export function MecenePanel({ donations }: MecenePanelProps) {
  const [tierId, setTierId] = useState<string>('pigment');
  const [freeAmount, setFreeAmount] = useState<string>('50');
  const [freeColor, setFreeColor] = useState<string>(FREE_COLORS[1]);

  const { strokes, rows } = useMemo(() => layoutStrokes(donations), [donations]);
  const tier = TIERS.find((t) => t.id === tierId) ?? TIERS[1];
  const amount = tier.amount ?? Math.max(1, parseInt(freeAmount || '0', 10) || 0);
  const previewColor = tier.color ?? freeColor;

  const previewY = 30 + rows * ROW_HEIGHT;
  const frescoHeight = previewY + 34;

  const donate = () => {
    // Most providers accept an amount query param; adapt to yours.
    window.open(`${DONATION_URL}?amount=${amount}`, '_blank', 'noopener');
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* ============ THE FRESCO ============ */}
      <div
        className="mx-auto mb-9 max-w-[720px] border border-[#e8ded4] bg-[#fcf8f4] px-7 py-6"
        style={{ boxShadow: '0 16px 32px -20px rgba(24,24,27,.3)' }}
      >
        <div className="mb-3 text-center text-[9.5px] uppercase tracking-[0.2em] text-zinc-400">
          La fresque des mécènes — {strokes.length} coup{strokes.length > 1 ? 's' : ''} de pinceau
        </div>
        <svg viewBox={`0 0 ${FRESCO_WIDTH} ${frescoHeight}`} className="h-auto w-full" aria-hidden="true">
          {strokes.map((s) => (
            <g key={s.key}>
              <path
                d={s.d}
                stroke={s.color}
                strokeWidth={s.width}
                strokeLinecap="round"
                fill="none"
                opacity={s.opacity}
              />
              {s.donorName && (
                <title>
                  {s.donorName} — {s.amount} €
                </title>
              )}
            </g>
          ))}
          {/* your future stroke, previewed in the selected color */}
          <path
            d={`M${FRESCO_WIDTH / 2 - 38} ${previewY} q 19 -10 38 0`}
            stroke={previewColor}
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
            opacity=".35"
            strokeDasharray="4 7"
          />
          <text
            x={FRESCO_WIDTH / 2}
            y={previewY + 22}
            textAnchor="middle"
            fontStyle="italic"
            fontSize="11"
            fill="#a8a29e"
            fontFamily="var(--font-playfair), serif"
          >
            …votre touche ici
          </text>
        </svg>
      </div>

      {/* ============ TIERS ============ */}
      <div className="flex flex-wrap justify-center gap-4">
        {TIERS.map((t) => {
          const active = t.id === tierId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTierId(t.id)}
              aria-pressed={active}
              className="w-[200px] rounded-[5px] border bg-[#fcf8f4] px-5 py-5 text-center transition-all duration-300"
              style={{
                borderColor: active ? '#8d1e11' : '#e8ded4',
                borderWidth: active ? 2 : 1,
                boxShadow: active ? '0 14px 30px -16px rgba(141,30,17,.4)' : 'none',
                transform: active ? 'translateY(-3px)' : 'none',
              }}
            >
              <span
                className="mx-auto mb-3 block h-2 w-11 rounded"
                style={{ background: t.color ?? `linear-gradient(90deg, ${FREE_COLORS.slice(0, 4).join(',')})` }}
              />
              <span className="block font-[family-name:var(--font-playfair)] text-2xl text-zinc-900">
                {t.amount ? `${t.amount} €` : 'Libre'}
              </span>
              <span
                className="mt-0.5 block font-[family-name:var(--font-playfair)] text-[13px] italic"
                style={{ color: active ? '#8d1e11' : '#78716c' }}
              >
                {t.label}
              </span>
              <span className="mt-2 block text-[11px] leading-normal text-zinc-400">{t.blurb}</span>
            </button>
          );
        })}
      </div>

      {/* ============ FREE-TIER CONTROLS ============ */}
      {tier.id === 'fresque' && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-5">
          <label className="flex items-center gap-2.5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-400">Montant</span>
            <span className="flex items-baseline gap-1 border-b border-[#cbbfae] px-1 py-0.5">
              <input
                type="number"
                min={1}
                value={freeAmount}
                onChange={(e) => setFreeAmount(e.target.value)}
                className="w-16 bg-transparent text-right font-[family-name:var(--font-playfair)] text-xl text-zinc-900 outline-none"
                aria-label="Montant libre en euros"
              />
              <span className="font-[family-name:var(--font-playfair)] text-lg text-zinc-500">€</span>
            </span>
          </label>
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-400">Couleur</span>
            <div className="flex gap-2">
              {FREE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFreeColor(c)}
                  aria-label={`Couleur ${c}`}
                  aria-pressed={freeColor === c}
                  className="h-[18px] w-[18px] rounded-full transition-transform duration-200 hover:scale-110"
                  style={{
                    background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,.75), transparent 45%), ${c}`,
                    boxShadow: freeColor === c ? `0 0 0 2px #fcf8f4, 0 0 0 3.5px ${c}` : 'none',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============ CTA ============ */}
      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={donate}
          className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-zinc-900 px-8 py-3 text-[11.5px] uppercase tracking-[0.14em] text-[#f7f3ec] transition-transform duration-300 hover:scale-[1.03]"
        >
          Ajouter ma touche — {amount} €
          <svg viewBox="0 0 16 12" width="15" height="11" aria-hidden="true">
            <path d="M1 6 H14 M10 1.5 L14.5 6 L10 10.5" fill="none" stroke="#e8c99b" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <div className="mt-3 text-[11px] text-zinc-400">
          paiement sécurisé · reçu fiscal envoyé par email (66 % déductible)
        </div>
      </div>
    </div>
  );
}
