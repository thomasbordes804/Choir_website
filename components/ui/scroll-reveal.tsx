'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in ms before the reveal transition starts, once visible. */
  delay?: number;
  /** 'up' fades in while rising; 'scale' fades in while growing slightly. */
  variant?: 'up' | 'scale';
}

/**
 * Wraps children and fades/translates them in the first time they scroll
 * into view. Client component so it can use IntersectionObserver; the
 * page itself stays a server component.
 */
export function ScrollReveal({ children, className = '', delay = 0, variant = 'up' }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hiddenClass = variant === 'scale' ? 'opacity-0 scale-95' : 'opacity-0 translate-y-6';
  const visibleClass = variant === 'scale' ? 'opacity-100 scale-100' : 'opacity-100 translate-y-0';

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? visibleClass : hiddenClass} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
