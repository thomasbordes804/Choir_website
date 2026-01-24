'use client';

import { useEffect, useRef, useState } from 'react';

interface VideoBackgroundProps {
  videoSrc: string;
  className?: string;
}

export function VideoBackground({ videoSrc, className = '' }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [revealProgress, setRevealProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Get section position relative to viewport
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      
      // Commencer la révélation plus tôt pour une transition plus douce
      const startReveal = windowHeight * 0.6;
      
      // Calculate progress avec une transition très progressive
      let progress = 0;
      
      if (sectionTop < startReveal) {
        // Section a commencé à entrer dans la zone de révélation
        const scrolled = startReveal - sectionTop;
        // Distance totale très longue pour une transition très subtile
        const totalScroll = sectionHeight * 1.5;
        progress = Math.min(1, Math.max(0, scrolled / totalScroll));
      }
      
      setRevealProgress(progress);
      
      // Play video when it starts to be visible
      if (progress > 0.05 && videoRef.current && !hasPlayed) {
        videoRef.current.play().catch(console.error);
        setHasPlayed(true);
      }
      
      // Keep video playing once started
      if (progress > 0 && videoRef.current && hasPlayed && videoRef.current.paused) {
        videoRef.current.play().catch(console.error);
      }
    };

    // Initial check
    handleScroll();
    
    // Listen to scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [hasPlayed]);

  // Accélérer automatiquement la vidéo
  useEffect(() => {
    if (videoRef.current) {
      // Définir la vitesse à 1.8x pour un effet plus dynamique
      videoRef.current.playbackRate = 1.8;
    }
  }, []);

  // Calculate clip path - transition très subtile
  const clipTop = Math.max(0, 100 - (revealProgress * 100));
  const clipPath = `inset(${clipTop}% 0 0 0)`;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ width: '100vw', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}
    >
      {/* White background avec transition très douce et subtile */}
      <div 
        className="absolute inset-0 bg-white z-10"
        style={{
          width: '100%',
          height: '100%',
          clipPath: clipPath,
          WebkitClipPath: clipPath,
          transition: 'clip-path 0.3s ease-out', // Transition plus lente et douce avec ease-out
          opacity: 0.98, // Presque opaque mais laisse un peu voir la vidéo
        }}
      />

      {/* Video Background with dynamic top-to-bottom reveal */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{
          width: '100%',
          height: '100%',
          minWidth: '100%',
          minHeight: '100%',
        }}
        playsInline
        muted
        loop
        preload="auto"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Gradient overlay très subtil */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none z-20" />
      
      {/* Bottom gradient for transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#faf9f6] pointer-events-none z-20" />
    </div>
  );
}