'use client';

import { useEffect, useRef } from 'react';

interface TopVideoTemplateProps {
  videoSrc: string;
  className?: string;
  /** Adds a slow continuous zoom (Ken Burns) loop to the background video. */
  kenburns?: boolean;
}

export function TopVideoTemplate({ videoSrc, className = '', kenburns = false }: TopVideoTemplateProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Just ensure video plays
    video.play().catch(console.error);
  }, []);

  return (
    <>
      {/* Video Background */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover ${kenburns ? 'animate-kenburns' : ''} ${className}`}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Top fade gradient — blends into the page background color (tracks
          --paper via color-mix so it never goes stale when the palette changes) */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          zIndex: 1,
          height: '50%',
          background: 'linear-gradient(to bottom, var(--paper) 0%, color-mix(in srgb, var(--paper) 95%, transparent) 15%, color-mix(in srgb, var(--paper) 85%, transparent) 30%, color-mix(in srgb, var(--paper) 70%, transparent) 45%, color-mix(in srgb, var(--paper) 50%, transparent) 60%, color-mix(in srgb, var(--paper) 30%, transparent) 75%, transparent 100%)',
        }}
      />

      {/* Bottom fade gradient — same, so the hero blends smoothly into the
          section below regardless of the current palette */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          zIndex: 5,
          height: '10%',
          background: 'linear-gradient(to bottom, transparent 0%, color-mix(in srgb, var(--paper) 30%, transparent) 30%, color-mix(in srgb, var(--paper) 70%, transparent) 70%, var(--paper) 100%)',
        }}
      />
    </>
  );
}
