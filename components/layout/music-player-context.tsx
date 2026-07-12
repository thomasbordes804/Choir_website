'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

export interface MusicTrack {
  id: string;
  title: string;
  path: string;
  color: string;
  coverImage?: string;
}

// The site's real playlist. Colors are new (used by the candle/sun dots) —
// swap them for your own palette if you'd rather.
export const MUSIC_TRACKS: MusicTrack[] = [
  { id: 'last-dream', title: 'Last Dream', path: '/media/last-dream.mp3', color: '#ff6b6b', coverImage: '/Musiques/Last Dream - song.png' },
  { id: 'yura-yura', title: 'Yura Yura', path: '/media/Yura yura.mp3', color: '#a8a7d4', coverImage: '/Musiques/Yura yura - song.png' },
  { id: 'the-journey', title: 'The Journey', path: '/media/Tom Misch - The Journey.mp3', color: '#636098', coverImage: '/Musiques/Yura yura - song.png' },
  { id: 'photograph', title: 'Photograph', path: '/media/Ed Sheeran - Photograph.mp3', color: '#8d1e11', coverImage: '/Musiques/Yura yura - song.png' },
];

interface MusicPlayerValue {
  tracks: MusicTrack[];
  currentTrackIndex: number;
  currentTrack: MusicTrack;
  isPlaying: boolean;
  hasStarted: boolean;
  audioElement: HTMLAudioElement | null;
  togglePlayback: () => void;
  selectTrack: (index: number) => void;
  next: () => void;
  /** Fades the background music down (e.g. while a poem is being read aloud)
   *  without pausing it, then fades it back up when `active` is false. */
  duckVolume: (active: boolean) => void;
}

const MusicPlayerContext = createContext<MusicPlayerValue | null>(null);

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) {
    throw new Error('useMusicPlayer must be used within <MusicPlayerProvider>');
  }
  return ctx;
}

function registerUnlock(handler: () => void) {
  const onceHandler = () => {
    handler();
    window.removeEventListener('pointerdown', onceHandler);
    window.removeEventListener('keydown', onceHandler);
  };
  window.addEventListener('pointerdown', onceHandler, { once: true });
  window.addEventListener('keydown', onceHandler, { once: true });
  return () => {
    window.removeEventListener('pointerdown', onceHandler);
    window.removeEventListener('keydown', onceHandler);
  };
}

const NORMAL_VOLUME = 0.35;
const DUCKED_VOLUME = 0.17;

/**
 * Owns the single shared <audio> element for the whole site. Wrap the site
 * layout with this once; both the header's candle control and any page
 * content read/drive the same session through useMusicPlayer() — so there is
 * never more than one track playing at a time.
 */
export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const wasPlayingRef = useRef(false);
  const [, forceTick] = useState(0);
  const duckFadeRef = useRef<number | null>(null);

  const currentTrack = MUSIC_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (!currentTrack) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current.load();
      audioRef.current = null;
    }

    const audio = new Audio(currentTrack.path);
    audio.loop = true;
    audio.volume = NORMAL_VOLUME;
    audioRef.current = audio;
    forceTick((n) => n + 1);

    let unregisterUnlock: (() => void) | undefined;

    const attemptPlay = async () => {
      if (!audioRef.current) return;
      try {
        if (wasPlayingRef.current) {
          await audioRef.current.play();
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
        }
        setHasStarted(true);
      } catch (error) {
        console.warn('Autoplay blocked, waiting for user interaction', error);
        setIsPlaying(false);
        if (!unregisterUnlock) {
          unregisterUnlock = registerUnlock(() => {
            void attemptPlay();
          });
        }
      }
    };

    void attemptPlay();

    return () => {
      if (duckFadeRef.current !== null) {
        cancelAnimationFrame(duckFadeRef.current);
        duckFadeRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.load();
      }
      audioRef.current = null;
      if (unregisterUnlock) unregisterUnlock();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack]);

  const togglePlayback = useCallback(async () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      wasPlayingRef.current = false;
      return;
    }
    try {
      await audioRef.current.play();
      setIsPlaying(true);
      wasPlayingRef.current = true;
      setHasStarted(true);
    } catch (error) {
      console.warn('Playback blocked', error);
    }
  }, [isPlaying]);

  const duckVolume = useCallback((active: boolean) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (duckFadeRef.current !== null) {
      cancelAnimationFrame(duckFadeRef.current);
      duckFadeRef.current = null;
    }

    const target = active ? DUCKED_VOLUME : NORMAL_VOLUME;
    const start = audio.volume;
    const duration = 350;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration);
      audio.volume = start + (target - start) * progress;
      if (progress < 1) {
        duckFadeRef.current = requestAnimationFrame(step);
      } else {
        duckFadeRef.current = null;
      }
    };
    duckFadeRef.current = requestAnimationFrame(step);
  }, []);

  const next = useCallback(() => {
    wasPlayingRef.current = isPlaying;
    setCurrentTrackIndex((prev) => (prev + 1) % MUSIC_TRACKS.length);
  }, [isPlaying]);

  const selectTrack = useCallback(
    (index: number) => {
      wasPlayingRef.current = isPlaying;
      setCurrentTrackIndex(index);
    },
    [isPlaying]
  );

  return (
    <MusicPlayerContext.Provider
      value={{
        tracks: MUSIC_TRACKS,
        currentTrackIndex,
        currentTrack,
        isPlaying,
        hasStarted,
        audioElement: audioRef.current,
        togglePlayback,
        selectTrack,
        next,
        duckVolume,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
}
