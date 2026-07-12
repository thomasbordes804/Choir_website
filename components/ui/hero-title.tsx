'use client';

interface HeroTitleProps {
  text: string;
  className?: string;
}

/**
 * Staggered letter-by-letter reveal for the hero name/title.
 * Pure CSS animation (keyframes live in globals.css) — no JS needed
 * beyond marking this a client component so it can render safely
 * alongside the server-rendered hero.
 */
export function HeroTitle({ text, className = '' }: HeroTitleProps) {
  const letters = text.split('');

  return (
    <div
      className={`font-light text-5xl sm:text-6xl md:text-7xl tracking-tight text-white mb-5 ${className}`}
      style={{ textShadow: '0 4px 24px rgba(0, 0, 0, 0.35)' }}
      aria-label={text}
    >
      {letters.map((ch, i) => (
        <span
          key={i}
          className="inline-block opacity-0"
          style={{
            animation: 'heroLetterUp 0.7s ease forwards',
            animationDelay: `${0.05 + i * 0.045}s`,
          }}
          aria-hidden="true"
        >
          {ch === ' ' ? '\u00A0\u00A0' : ch}
        </span>
      ))}
    </div>
  );
}
