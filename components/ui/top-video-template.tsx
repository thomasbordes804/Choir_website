'use client';

import { useEffect, useRef } from 'react';

interface TopVideoTemplateProps {
  videoSrc: string;
  className?: string;
}

export function TopVideoTemplate({ videoSrc, className = '' }: TopVideoTemplateProps) {
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
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
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

      {/* Top fade gradient - increased fade area with beige color */}
      <div 
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          zIndex: 1,
          height: '50%', // Fixed: was 0%, now 60%
          background: 'linear-gradient(to bottom, rgba(237, 234, 230, 1) 0%, rgba(237, 234, 230, 0.95) 15%, rgba(237, 234, 230, 0.85) 30%, rgba(237, 234, 230, 0.7) 45%, rgba(237, 234, 230, 0.5) 60%, rgba(237, 234, 230, 0.3) 75%, transparent 100%)',
        }}
      />

      {/* Bottom fade gradient to blend with beige background */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          zIndex: 5,
          height: '10%', // Fixed: was 0%, now 60%
          background: 'linear-gradient(to bottom, transparent 0%, rgba(237, 234, 230, 0.3) 30%, rgba(237, 234, 230, 0.7) 70%, rgba(237, 234, 230, 1) 100%)',
        }}
      />
    </>
  );
}