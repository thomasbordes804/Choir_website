'use client';

import { useEffect, useRef, useState } from 'react';

export function CloudTransition() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('section[style*="home_page.jpg"]');
      if (!heroSection) return;

      const heroBottom = heroSection.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight;
      
      // Only show transition in a small zone (last 15% of hero section)
      // Progress: 0 when hero bottom is at 100vh, 1 when hero bottom is at 85vh
      const transitionStart = windowHeight * 0.85;
      const transitionEnd = windowHeight;
      
      if (heroBottom > transitionStart) {
        const progress = Math.max(0, Math.min(1, (heroBottom - transitionStart) / (transitionEnd - transitionStart)));
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Only render if there's progress
  if (scrollProgress === 0) return null;

  return (
    <div
      ref={containerRef}
      className="fixed left-0 right-0 pointer-events-none z-30"
      style={{
        bottom: 0,
        height: '200px', // Small transition zone
        opacity: scrollProgress * 0.4, // Very subtle
      }}
    >
      {/* Subtle cloud-like gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, 
            transparent 0%, 
            rgba(250, 249, 246, ${scrollProgress * 0.2}) 30%,
            rgba(250, 249, 246, ${scrollProgress * 0.4}) 50%,
            rgba(250, 249, 246, ${scrollProgress * 0.6}) 70%,
            rgba(250, 249, 246, ${scrollProgress * 0.8}) 100%
          )`,
          maskImage: `radial-gradient(ellipse 80% 100% at 50% 0%, black 40%, transparent 70%)`,
          WebkitMaskImage: `radial-gradient(ellipse 80% 100% at 50% 0%, black 40%, transparent 70%)`,
        }}
      />
      
      {/* Additional organic cloud shapes using SVG */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        style={{ opacity: scrollProgress * 0.3 }}
      >
        <defs>
          <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#faf9f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#faf9f6" stopOpacity={scrollProgress * 0.15} />
            <stop offset="100%" stopColor="#faf9f6" stopOpacity={scrollProgress * 0.3} />
          </linearGradient>
        </defs>
        
        {/* Small organic cloud shapes */}
        <path
          d="M 0,100 Q 20,80 40,85 T 60,90 Q 80,85 100,95 L 100,100 Z"
          fill="url(#cloudGradient)"
          opacity="0.5"
        />
        <path
          d="M 0,100 Q 25,75 50,80 T 75,85 Q 90,80 100,90 L 100,100 Z"
          fill="url(#cloudGradient)"
          opacity="0.3"
          style={{ transform: 'translateX(5%)' }}
        />
      </svg>
    </div>
  );
}