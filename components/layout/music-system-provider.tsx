'use client';

import { type ReactNode } from 'react';

import { AudioContextProvider } from './audio-context-provider';
import { MusicPlayerProvider, useMusicPlayer } from './music-player-context';

function AudioContextBridge({ children }: { children: ReactNode }) {
  const { audioElement, isPlaying } = useMusicPlayer();
  return (
    <AudioContextProvider audioElement={audioElement} isPlaying={isPlaying}>
      {children}
    </AudioContextProvider>
  );
}

/** Wrap the whole site layout (header + main + footer) with this once. */
export function MusicSystemProvider({ children }: { children: ReactNode }) {
  return (
    <MusicPlayerProvider>
      <AudioContextBridge>{children}</AudioContextBridge>
    </MusicPlayerProvider>
  );
}
