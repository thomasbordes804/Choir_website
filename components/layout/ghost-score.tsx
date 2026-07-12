'use client';

import { useMusicPlayer } from './music-player-context';

/**
 * "Au rythme du morceau" — the ghost sheet-music ribbon lives ONLY with the
 * music: while a track plays it scrolls and glows at ~55% presence; the
 * moment the music is cut the scroll freezes in place and the whole score
 * fades to a barely-there 7% — an orchestra putting its instruments down.
 * Purely decorative — pointer-events none, aria-hidden.
 */
export function GhostScore() {
  const { isPlaying } = useMusicPlayer();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 overflow-hidden"
      style={{
        top: '50%',
        height: 110,
        transform: 'translateY(-50%)',
        opacity: isPlaying ? 0.55 : 0.07,
        transition: 'opacity 1.4s ease',
        maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <svg
        viewBox="0 0 1800 110"
        style={{
          width: 1800,
          height: 110,
          animation: 'scoreScroll 50s linear infinite',
          animationPlayState: isPlaying ? 'running' : 'paused',
          filter: isPlaying ? 'drop-shadow(0 0 6px rgba(232,201,155,.35))' : 'none',
          transition: 'filter 1.4s ease',
        }}
      >
        {/* staff */}
        <g stroke="rgba(247,243,236,.16)" strokeWidth="0.6">
          <line x1="0" y1="30" x2="1800" y2="30" />
          <line x1="0" y1="44" x2="1800" y2="44" />
          <line x1="0" y1="58" x2="1800" y2="58" />
          <line x1="0" y1="72" x2="1800" y2="72" />
          <line x1="0" y1="86" x2="1800" y2="86" />
        </g>
        {/* bar lines */}
        <g stroke="rgba(247,243,236,.12)" strokeWidth="0.8">
          <line x1="150" y1="30" x2="150" y2="86" />
          <line x1="380" y1="30" x2="380" y2="86" />
          <line x1="600" y1="30" x2="600" y2="86" />
          <line x1="830" y1="30" x2="830" y2="86" />
          <line x1="1050" y1="30" x2="1050" y2="86" />
          <line x1="1280" y1="30" x2="1280" y2="86" />
          <line x1="1500" y1="30" x2="1500" y2="86" />
          <line x1="1730" y1="30" x2="1730" y2="86" />
        </g>
        {/* ghost notes — pattern repeats every 900px for a seamless loop */}
        <g fill="rgba(232,201,155,.45)">
          <ellipse cx="90" cy="58" rx="5" ry="3.6" transform="rotate(-16 90 58)" />
          <rect x="94" y="34" width="1.3" height="24" />
          <ellipse cx="230" cy="44" rx="5" ry="3.6" transform="rotate(-16 230 44)" />
          <rect x="234" y="20" width="1.3" height="24" />
          <ellipse cx="310" cy="72" rx="5" ry="3.6" transform="rotate(-16 310 72)" />
          <rect x="314" y="48" width="1.3" height="24" />
          <ellipse cx="470" cy="58" rx="5" ry="3.6" transform="rotate(-16 470 58)" />
          <rect x="474" y="34" width="1.3" height="24" />
          <ellipse cx="540" cy="30" rx="5" ry="3.6" transform="rotate(-16 540 30)" />
          <rect x="544" y="6" width="1.3" height="24" />
          <ellipse cx="700" cy="44" rx="5" ry="3.6" transform="rotate(-16 700 44)" />
          <rect x="704" y="20" width="1.3" height="24" />
          <ellipse cx="770" cy="58" rx="5" ry="3.6" transform="rotate(-16 770 58)" />
          <rect x="774" y="34" width="1.3" height="24" />
          <ellipse cx="990" cy="58" rx="5" ry="3.6" transform="rotate(-16 990 58)" />
          <rect x="994" y="34" width="1.3" height="24" />
          <ellipse cx="1130" cy="44" rx="5" ry="3.6" transform="rotate(-16 1130 44)" />
          <rect x="1134" y="20" width="1.3" height="24" />
          <ellipse cx="1210" cy="72" rx="5" ry="3.6" transform="rotate(-16 1210 72)" />
          <rect x="1214" y="48" width="1.3" height="24" />
          <ellipse cx="1370" cy="58" rx="5" ry="3.6" transform="rotate(-16 1370 58)" />
          <rect x="1374" y="34" width="1.3" height="24" />
          <ellipse cx="1440" cy="30" rx="5" ry="3.6" transform="rotate(-16 1440 30)" />
          <rect x="1444" y="6" width="1.3" height="24" />
          <ellipse cx="1600" cy="44" rx="5" ry="3.6" transform="rotate(-16 1600 44)" />
          <rect x="1604" y="20" width="1.3" height="24" />
          <ellipse cx="1670" cy="58" rx="5" ry="3.6" transform="rotate(-16 1670 58)" />
          <rect x="1674" y="34" width="1.3" height="24" />
        </g>
        <text x="18" y="80" fontFamily="Georgia, serif" fontSize="48" fill="rgba(232,201,155,.35)">
          𝄞
        </text>
        <text x="918" y="80" fontFamily="Georgia, serif" fontSize="48" fill="rgba(232,201,155,.35)">
          𝄞
        </text>
      </svg>

      <style jsx global>{`
        @keyframes scoreScroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-900px);
          }
        }
      `}</style>
    </div>
  );
}
