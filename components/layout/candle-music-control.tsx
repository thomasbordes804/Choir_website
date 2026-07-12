'use client';

import { useRef, useState } from 'react';

import { useMusicPlayer } from './music-player-context';

/**
 * Closed state made subtle and boxless: just the candle flame with the
 * current track's title in small italic serif beneath it — like a signature
 * at the edge of a canvas. While playing, a hairline in the track's color
 * underlines the title and the flame dances; when the music is cut the flame
 * dims to an ember and the title reads "Musique coupée" in faded cream.
 * Click = play/pause; hover opens the (unchanged) track list.
 */
export function CandleMusicControl() {
  const { tracks, currentTrack, currentTrackIndex, isPlaying, togglePlayback, selectTrack } = useMusicPlayer();
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setIsOpen(true);
  };

  const handleLeave = () => {
    closeTimeout.current = setTimeout(() => setIsOpen(false), 300);
  };

  return (
    <div className="relative inline-flex" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        type="button"
        onClick={togglePlayback}
        aria-label={isPlaying ? 'Mettre en pause la musique' : 'Jouer la musique'}
        aria-pressed={isPlaying}
        className="group flex flex-col items-center gap-1 transition-transform duration-300 hover:scale-105"
        style={{ minWidth: 110 }}
      >
        <svg
          viewBox="0 0 20 30"
          width="22"
          height="33"
          style={{
            overflow: 'visible',
            animation: isPlaying ? 'flicker 1.6s ease-in-out infinite' : 'none',
            opacity: isPlaying ? 1 : 0.38,
            transition: 'opacity .5s ease',
          }}
        >
          <ellipse cx="10" cy="10" rx="6.5" ry="9.5" fill="rgba(255,178,102,0.28)" />
          <path d="M10 3.5 C 5.8 10, 5.8 16, 10 20.5 C 14.2 16, 14.2 10, 10 3.5 Z" fill="#f4a24a" />
          <path d="M10 9 C 8 12, 8 15, 10 17.5 C 12 15, 12 12, 10 9 Z" fill="#fde2b0" />
          <rect x="8.9" y="20.5" width="2.2" height="6.5" fill="#e8dfd2" />
        </svg>

        <span className="relative flex flex-col items-center">
          <span
            className="max-w-[150px] truncate whitespace-nowrap font-[family-name:var(--font-playfair)] text-[13px] italic transition-colors duration-500"
            style={{
              color: isPlaying ? 'rgba(247,243,236,.9)' : 'rgba(247,243,236,.45)',
              textShadow: '0 1px 6px rgba(0,0,0,.6)',
            }}
          >
            {isPlaying ? currentTrack?.title : 'Musique coupée'}
          </span>
          {/* hairline in the track's color, only while playing */}
          <span
            className="mt-0.5 block h-px rounded-full transition-all duration-700"
            style={{
              width: isPlaying ? '100%' : 0,
              background: currentTrack?.color ?? '#e8c99b',
              boxShadow: isPlaying ? `0 0 6px ${currentTrack?.color ?? '#e8c99b'}` : 'none',
            }}
          />
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full z-50 flex flex-col items-stretch gap-1 rounded-lg px-2 py-3"
          style={{
            animation: 'menuReveal .22s ease both',
            marginTop: 10,
            minWidth: 190,
            background: '#faf6ef',
            border: '1px solid #e0d0b3',
            boxShadow: '0 16px 36px -14px rgba(0,0,0,0.35)',
          }}
        >
          {tracks.map((t, i) => {
            const isCurrent = i === currentTrackIndex;
            const isCurrentAndPlaying = isCurrent && isPlaying;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => selectTrack(i)}
                aria-pressed={isCurrent}
                className="group relative whitespace-nowrap rounded-md px-4 py-2.5 text-left text-[14px] tracking-wide transition-all duration-200"
                style={{
                  color: isCurrent ? '#3f3a33' : '#57534e',
                  fontWeight: isCurrent ? 600 : 400,
                  background: isCurrent ? `${t.color}30` : 'transparent',
                  border: isCurrent ? `1px solid ${t.color}70` : '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isCurrent) {
                    e.currentTarget.style.background = 'rgba(210,192,157,0.55)';
                    e.currentTarget.style.borderColor = 'rgba(180,140,70,0.35)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCurrent) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                {isCurrent && (
                  <span
                    className="absolute left-1.5 top-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      width: 5,
                      height: 5,
                      background: t.color,
                      boxShadow: `0 0 6px ${t.color}`,
                      animation: isCurrentAndPlaying ? 'glowPulse 1.8s ease-in-out infinite' : 'none',
                    }}
                  />
                )}
                <span className="ml-2.5">{t.title}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
