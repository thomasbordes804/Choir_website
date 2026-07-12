'use client';

import { AudioVisualizer } from './audio-visualizer';
import { useMusicPlayer } from './music-player-context';

/**
 * Now only responsible for the ambient bottom-of-screen visualizer — the
 * play/pause/track controls have moved into the header's InkBarControls
 * (candle-music-control.tsx). Still reads from the same shared session.
 */
export function BackgroundAudio() {
  const { isPlaying, hasStarted } = useMusicPlayer();

  if (!hasStarted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-48 pointer-events-none z-0">
      <AudioVisualizer isPlaying={isPlaying} />
    </div>
  );
}
