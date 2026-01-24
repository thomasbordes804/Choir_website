'use client';

import { useState, useRef, useEffect } from 'react';

interface MusicControlsProps {
  isPlaying: boolean;
  currentTrackTitle?: string;
  onPlayPause: () => void;
  onNext: () => void;
  onSelectTrack?: (index: number) => void;
  tracks?: Array<{ id: string; title: string }>;
  currentTrackIndex?: number;
}

export function MusicControls({ 
  isPlaying, 
  currentTrackTitle, 
  onPlayPause, 
  onNext,
  onSelectTrack,
  tracks = [],
  currentTrackIndex = 0,
}: MusicControlsProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Handle hover with delay to prevent disappearing
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 150);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsHovered(false);
      }
    };

    if (isHovered) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isHovered]);

  return (
    <div className="flex items-center gap-4 ml-6">
      {/* Separator - elegant line */}
      <div className="h-5 w-px bg-white/30" />
      
      {/* Current track name with dropdown - artistic and subtle */}
      {currentTrackTitle && (
        <div 
          className="hidden sm:flex items-center gap-3 relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          ref={menuRef}
        >
          <div className="px-3 py-1.5">
            <span 
              className="text-white/90 text-sm font-semibold tracking-wider uppercase cursor-pointer transition-opacity duration-300"
              style={{
                fontFamily: 'var(--font-playfair)',
                letterSpacing: '0.15em',
              }}
            >
              {currentTrackTitle}
            </span>
            {isPlaying && (
              <div className="inline-flex items-center gap-1 ml-2">
                <div className="w-1 h-1 rounded-full bg-white/70 animate-pulse" />
                <div className="w-1 h-1 rounded-full bg-white/70 animate-pulse" style={{ animationDelay: '0.3s' }} />
              </div>
            )}
          </div>

          {/* Dropdown menu - transparent beige, fluid and artistic */}
          <div
            className={`absolute top-full left-0 bg-[#f5f3f0]/40 backdrop-blur-md border border-[#e8e6e3]/30 rounded-lg overflow-hidden z-50 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              marginTop: '12px',
              minWidth: '220px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            }}
          >
            {tracks.map((track, index) => (
              <button
                key={track.id}
                onClick={() => {
                  onSelectTrack?.(index);
                  setIsHovered(false);
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`w-full text-left px-4 py-3 text-sm transition-all duration-300 relative overflow-hidden ${
                  index === currentTrackIndex
                    ? 'text-zinc-900 font-semibold'
                    : 'text-zinc-700 font-medium'
                } ${
                  hoveredIndex === index ? 'text-zinc-900 font-bold' : ''
                }`}
                style={{
                  fontFamily: 'var(--font-playfair)',
                }}
              >
                {/* Transparent beige highlight on hover */}
                <div 
                  className={`absolute inset-0 transition-all duration-300 ${
                    hoveredIndex === index && index !== currentTrackIndex
                      ? 'bg-gradient-to-r from-[#f5f3f0]/60 via-[#edeae6]/70 to-[#f5f3f0]/60 opacity-100'
                      : 'opacity-0'
                  }`}
                  style={{
                    transform: hoveredIndex === index ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left',
                  }}
                />
                
                {/* Decorative left border on hover */}
                <div 
                  className={`absolute left-0 top-0 bottom-0 w-0.5 bg-[#d4c5b8] transition-all duration-300 ${
                    hoveredIndex === index && index !== currentTrackIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    transform: hoveredIndex === index ? 'scaleY(1)' : 'scaleY(0)',
                    transformOrigin: 'top',
                  }}
                />
                
                <div className="flex items-center justify-between relative z-10">
                  <span 
                    className="transition-all duration-300"
                    style={{
                      transform: hoveredIndex === index ? 'translateX(4px)' : 'translateX(0)',
                      textShadow: hoveredIndex === index ? '0 1px 2px rgba(0, 0, 0, 0.1)' : 'none',
                    }}
                  >
                    {track.title}
                  </span>
                  {index === currentTrackIndex && (
                    <span className="text-zinc-500 text-xs font-light">
                      —
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Play/Pause button - minimal */}
      <button
        type="button"
        onClick={onPlayPause}
        className="group relative text-white/70 hover:text-white transition-all duration-300"
        aria-pressed={isPlaying}
      >
        <span className="text-xs font-light tracking-wider">
          {isPlaying ? '⏸' : '▶'}
        </span>
        {/* Subtle underline on hover */}
        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
      </button>

      {/* Next button - minimal */}
      <button
        type="button"
        onClick={onNext}
        className="group relative text-white/70 hover:text-white transition-all duration-300"
        aria-label="Musique suivante"
      >
        <span className="text-xs font-light tracking-wider">
          →
        </span>
        {/* Subtle underline on hover */}
        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
      </button>
    </div>
  );
}