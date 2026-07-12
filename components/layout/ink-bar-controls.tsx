'use client';

import { useMusicPlayer } from './music-player-context';
import { InkStroke } from './ink-stroke';
import { GhostScore } from './ghost-score';
import { LightSunControl } from './light-sun-control';
import { CandleMusicControl } from './candle-music-control';

/**
 * The decorative row under the nav. The whole scene breathes with the music:
 * - score ribbon scrolls + glows while playing, freezes + fades when cut
 * - the ink stroke itself turns warm gold and luminous while playing,
 *   settling back to a dim cream line when the music stops
 * Split into two vertical zones so the light/music controls never sit at the
 * same height as the scrolling notes (which read as cluttered/confusing) —
 * the ribbon + stroke occupy a thin band on top, light (left) and music
 * (right) sit clearly below it in their own space.
 */
export function InkBarControls() {
  const { isPlaying } = useMusicPlayer();

  return (
    <div className="relative hidden h-24 w-full md:block">
      <div className="absolute inset-x-0 top-0 h-9">
        <GhostScore />

        <div
          className="absolute inset-0"
          style={{
            color: isPlaying ? '#e8c99b' : '#f7f3ec',
            opacity: isPlaying ? 0.95 : 0.45,
            filter: isPlaying ? 'drop-shadow(0 0 5px rgba(232,201,155,.7))' : 'none',
            transition: 'opacity 1.2s ease, color 1.2s ease, filter 1.2s ease',
          }}
        >
          <InkStroke />
        </div>
      </div>

      <div className="absolute left-0 bottom-0 z-10">
        <LightSunControl />
      </div>
      <div className="absolute right-0 bottom-0 z-10">
        <CandleMusicControl />
      </div>
    </div>
  );
}
