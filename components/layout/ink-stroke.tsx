'use client';

/**
 * Purely decorative — the single brushstroke that the light + music controls
 * "sit on" in the header. Draws itself in once on mount. Uses currentColor so
 * it can be recolored via the wrapping element's `color`. Vertically centers
 * itself in whatever height its parent gives it (so it always lines up with
 * the sun/candle regardless of header row height).
 */
export function InkStroke({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`pointer-events-none absolute left-0 w-full ${className}`}
      style={{ top: '50%', height: '40px', transform: 'translateY(-50%)', opacity: 0.75 }}
    >
      <path
        d="M 10 20 C 260 4, 620 34, 860 14 S 1160 6, 1190 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeDasharray="1600"
        style={{ animation: 'inkDraw 2.2s ease-out both' }}
      />

      <style jsx global>{`
        @keyframes inkDraw {
          from {
            stroke-dashoffset: 1600;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes glowPulse {
          0%,
          100% {
            opacity: 0.55;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes flicker {
          0%,
          100% {
            opacity: 1;
            transform: scaleY(1);
          }
          50% {
            opacity: 0.82;
            transform: scaleY(0.94);
          }
        }
      `}</style>
    </svg>
  );
}
