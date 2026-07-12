'use client';

import { useEffect, useRef, useState } from 'react';

interface LightingSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  temperature: number;
}

// Same presets/filter math/localStorage key as always.
const presets: Record<string, LightingSettings> = {
  dark: { brightness: 75, contrast: 105, saturation: 95, temperature: 5 },
  normal: { brightness: 110, contrast: 105, saturation: 110, temperature: 5 },
  vivid: { brightness: 125, contrast: 115, saturation: 135, temperature: 10 },
  vibrant: { brightness: 135, contrast: 120, saturation: 150, temperature: 12 },
};

const presetOrder: Array<keyof typeof presets> = ['dark', 'normal', 'vivid', 'vibrant'];

const presetLabels: Record<string, string> = {
  dark: 'Sombre',
  normal: 'Naturelle',
  vivid: 'Vive',
  vibrant: 'Éclatante',
};

/** The sun's face changes with the chosen intensity:
 *  dark → shadowed moon · normal → soft disc · vivid → rayed sun ·
 *  vibrant → blazing orb. */
function SunFace({ preset }: { preset: string }) {
  if (preset === 'dark') {
    return (
      <span
        className="relative block rounded-full"
        style={{ width: 24, height: 24, background: '#3a3230', boxShadow: 'inset 7px -3px 0 3px #b9a98e' }}
      />
    );
  }
  if (preset === 'vivid') {
    return (
      <svg viewBox="0 0 24 24" width="27" height="27" style={{ overflow: 'visible' }}>
        <circle cx="12" cy="12" r="6" fill="#f2ce8e" />
        <g stroke="#f2ce8e" strokeWidth="1.4" strokeLinecap="round">
          <line x1="12" y1="1.5" x2="12" y2="4.5" />
          <line x1="12" y1="19.5" x2="12" y2="22.5" />
          <line x1="1.5" y1="12" x2="4.5" y2="12" />
          <line x1="19.5" y1="12" x2="22.5" y2="12" />
          <line x1="4.6" y1="4.6" x2="6.7" y2="6.7" />
          <line x1="17.3" y1="17.3" x2="19.4" y2="19.4" />
          <line x1="4.6" y1="19.4" x2="6.7" y2="17.3" />
          <line x1="17.3" y1="6.7" x2="19.4" y2="4.6" />
        </g>
      </svg>
    );
  }
  if (preset === 'vibrant') {
    return (
      <span className="relative block" style={{ width: 25, height: 25 }}>
        <span
          className="pointer-events-none absolute rounded-full"
          style={{
            inset: -9,
            background: 'radial-gradient(circle, rgba(255,214,140,.75), transparent 70%)',
            animation: 'glowPulse 2s ease-in-out infinite',
          }}
        />
        <span
          className="relative block rounded-full"
          style={{
            width: 25,
            height: 25,
            background: 'radial-gradient(circle at 35% 30%, #fff7e2, #f2b64e 70%)',
            boxShadow: '0 0 20px rgba(255,196,94,.95)',
          }}
        />
      </span>
    );
  }
  // normal
  return (
    <span className="relative block" style={{ width: 24, height: 24 }}>
      <span
        className="pointer-events-none absolute rounded-full"
        style={{
          inset: -9,
          background: 'radial-gradient(circle, rgba(232,201,155,.5), transparent 70%)',
          animation: 'glowPulse 3.6s ease-in-out infinite',
        }}
      />
      <span
        className="relative block rounded-full"
        style={{
          width: 24,
          height: 24,
          background: 'radial-gradient(circle at 35% 30%, #fdf0d8, #e8c99b 65%)',
          boxShadow: '0 0 16px rgba(232,201,155,.85)',
        }}
      />
    </span>
  );
}

/**
 * Closed state redesigned as a small "horizon" vignette instead of a pill:
 * the sun (whose face reflects the chosen intensity) hangs just above a
 * short hand-drawn arc — a miniature landscape, no box, no backdrop. The
 * current intensity's name sits beneath in small italic serif, like a
 * painting's caption. The open menu (which works well) is unchanged.
 */
export function LightSunControl() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPreset, setCurrentPreset] = useState<string>('normal');
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const savedPreset = localStorage.getItem('lightingPreset');
    const preset = savedPreset && presets[savedPreset] ? savedPreset : 'normal';
    setCurrentPreset(preset);
    applySettings(presets[preset]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applySettings = (settings: LightingSettings) => {
    const target = (document.querySelector('.site-layout') as HTMLElement | null) ?? document.body;
    if (!target) return;

    if (document.body.style.filter) {
      document.body.style.filter = '';
    }

    const tempAdjust = settings.temperature;
    const warm = tempAdjust > 0 ? Math.abs(tempAdjust) : 0;
    const cool = tempAdjust < 0 ? Math.abs(tempAdjust) : 0;

    const filters = [
      `brightness(${settings.brightness}%)`,
      `contrast(${settings.contrast}%)`,
      `saturate(${settings.saturation}%)`,
    ];

    if (warm > 0) {
      filters.push(`sepia(${warm * 0.3}%)`);
      filters.push(`hue-rotate(${warm * 0.3}deg)`);
    }
    if (cool > 0) {
      filters.push(`sepia(${cool * 0.2}%)`);
      filters.push(`hue-rotate(${-cool * 0.4}deg)`);
    }

    target.style.filter = filters.join(' ');
    target.style.transition = 'filter 0.6s ease';
  };

  const handlePresetChange = (preset: string) => {
    setCurrentPreset(preset);
    localStorage.setItem('lightingPreset', preset);
    applySettings(presets[preset]);
  };

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
        onClick={() => setIsOpen((v) => !v)}
        aria-label={`Réglages de lumière — ${presetLabels[currentPreset]}`}
        aria-expanded={isOpen}
        className="group flex flex-col items-center gap-1 transition-transform duration-300 hover:scale-105"
        style={{ minWidth: 100 }}
      >
        {/* the sun above its horizon arc */}
        <span className="relative flex flex-col items-center">
          <span className="flex items-center justify-center" style={{ width: 30, height: 30 }}>
            <SunFace preset={currentPreset} />
          </span>
          <svg viewBox="0 0 100 15" width="100" height="15" style={{ marginTop: -2, overflow: 'visible' }}>
            <path
              d="M4 12 C 28 3, 72 3, 96 12"
              fill="none"
              stroke="rgba(247,243,236,.5)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            {/* tiny hills at the ends of the arc */}
            <path d="M15 11 C 19 8, 24 8, 28 11" fill="none" stroke="rgba(247,243,236,.28)" strokeWidth="0.9" />
            <path d="M72 11 C 76 8, 81 8, 85 11" fill="none" stroke="rgba(247,243,236,.28)" strokeWidth="0.9" />
          </svg>
        </span>
        <span
          className="whitespace-nowrap font-[family-name:var(--font-playfair)] text-[13px] italic"
          style={{ color: 'rgba(247,243,236,.75)', textShadow: '0 1px 6px rgba(0,0,0,.6)' }}
        >
          {presetLabels[currentPreset]}
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute left-0 top-full z-50 flex flex-col items-stretch gap-1 rounded-lg px-2 py-3"
          style={{
            animation: 'menuReveal .22s ease both',
            marginTop: 10,
            minWidth: 170,
            background: '#faf6ef',
            border: '1px solid #e0d0b3',
            boxShadow: '0 16px 36px -14px rgba(0,0,0,0.35)',
          }}
        >
          {presetOrder.map((p) => {
            const isCurrent = currentPreset === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => handlePresetChange(p)}
                aria-pressed={isCurrent}
                className="group relative whitespace-nowrap rounded-md px-4 py-2.5 text-left text-[14px] tracking-wide transition-all duration-200"
                style={{
                  color: isCurrent ? '#5a4322' : '#57534e',
                  fontWeight: isCurrent ? 600 : 400,
                  background: isCurrent ? 'rgba(232,201,155,0.45)' : 'transparent',
                  border: isCurrent ? '1px solid rgba(180,140,70,0.5)' : '1px solid transparent',
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
                    style={{ width: 5, height: 5, background: '#a8433a', boxShadow: '0 0 6px rgba(168,67,58,.7)' }}
                  />
                )}
                <span className="ml-2.5">{presetLabels[p]}</span>
              </button>
            );
          })}
        </div>
      )}

      <style jsx global>{`
        @keyframes menuReveal {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
