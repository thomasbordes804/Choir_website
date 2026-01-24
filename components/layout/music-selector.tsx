'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export interface MusicTrack {
  id: string;
  title: string;
  path: string;
  artist?: string;
  color?: string;
  coverImage?: string;
}

interface MusicSelectorProps {
  tracks: MusicTrack[];
  currentTrack: MusicTrack | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (track: MusicTrack) => void;
}

export function MusicSelector({ tracks, currentTrack, isOpen, onClose, onSelect }: MusicSelectorProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - minimal */}
      <div
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Music Selector Panel - minimal design */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full max-w-md pointer-events-auto bg-white/95 backdrop-blur-xl border border-zinc-200 rounded-lg shadow-xl"
          onClick={(e) => e.stopPropagation()}
          style={{
            animation: 'fadeInUp 0.3s ease-out',
          }}
        >
          {/* Header - minimal */}
          <div className="p-6 border-b border-zinc-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-light tracking-wide text-zinc-900 font-[family-name:var(--font-playfair)]">
                Musique
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-900"
                aria-label="Fermer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Music tracks list - minimal */}
          <div className="p-4 space-y-2">
            {tracks.map((track, index) => {
              const isCurrent = currentTrack?.id === track.id;
              const isHovered = hoveredIndex === index;

              return (
                <button
                  key={track.id}
                  onClick={() => {
                    onSelect(track);
                    onClose();
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`relative w-full group p-4 rounded border transition-all duration-300 text-left ${
                    isCurrent
                      ? 'border-zinc-900 bg-zinc-50'
                      : 'border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Cover image or icon */}
                    <div className="relative flex-shrink-0">
                      {track.coverImage ? (
                        <div className="relative w-16 h-16 rounded overflow-hidden">
                          <Image
                            src={track.coverImage}
                            alt={track.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded bg-zinc-100 flex items-center justify-center">
                          <span className="text-2xl text-zinc-400">♪</span>
                        </div>
                      )}
                      {isCurrent && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-zinc-900 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      )}
                    </div>

                    {/* Track info */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-sm font-medium transition-colors duration-300 ${
                          isCurrent
                            ? 'text-zinc-900'
                            : 'text-zinc-700 group-hover:text-zinc-900'
                        }`}
                        style={{
                          fontFamily: 'var(--font-playfair)',
                        }}
                      >
                        {track.title}
                      </h3>
                      {track.artist && (
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {track.artist}
                        </p>
                      )}
                    </div>

                    {/* Current indicator */}
                    {isCurrent && (
                      <div className="flex-shrink-0">
                        <div className="px-2 py-1 rounded text-xs font-light text-zinc-600 bg-zinc-100">
                          En cours
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}