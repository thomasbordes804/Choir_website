'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    // Only transition if pathname actually changed
    if (prevPathnameRef.current !== pathname) {
      setIsTransitioning(true);

      const timer = setTimeout(() => {
        setDisplayChildren(children);
        // Small delay before fade in for smoother transition
        requestAnimationFrame(() => {
          setIsTransitioning(false);
        });
      }, 300);

      prevPathnameRef.current = pathname;

      return () => clearTimeout(timer);
    } else {
      // Update children without transition if pathname didn't change
      setDisplayChildren(children);
    }
  }, [pathname, children]);

  return (
    <div
      className="relative w-full min-h-screen"
      style={{
        opacity: isTransitioning ? 0 : 1,
        transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
        transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: isTransitioning ? 'opacity, transform' : 'auto',
      }}
    >
      {displayChildren}
    </div>
  );
}