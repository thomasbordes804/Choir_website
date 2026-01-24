'use client';

import { useEffect, useRef, useState } from "react";
import { AudioContextProvider } from "./audio-context-provider";
import { AudioVisualizer } from "./audio-visualizer";
import { MusicControls } from "./music-controls";

function registerUnlock(handler: () => void) {
  const onceHandler = () => {
    handler();
    window.removeEventListener("pointerdown", onceHandler);
    window.removeEventListener("keydown", onceHandler);
  };

  window.addEventListener("pointerdown", onceHandler, { once: true });
  window.addEventListener("keydown", onceHandler, { once: true });

  return () => {
    window.removeEventListener("pointerdown", onceHandler);
    window.removeEventListener("keydown", onceHandler);
  };
}

// Available music tracks
const musicTracks = [
  {
    id: 'last-dream',
    title: 'Last Dream',
    path: '/media/last-dream.mp3',
    color: '#ff6b6b',
    coverImage: '/Musiques/Last Dream - song.png',
  },
  {
    id: 'yura-yura',
    title: 'Yura Yura',
    path: '/media/Yura yura.mp3',
    color: '#a8a7d4',
    coverImage: '/Musiques/Yura yura - song.png',
  },
  {
    id: 'the-journey',
    title: 'The Journey',
    path: '/media/Tom Misch - The Journey.mp3',
    color: '#a8a7d4',
    coverImage: '/Musiques/Yura yura - song.png',
  },
  {
    id: 'photograph',
    title: 'Photograph',
    path: '/media/Ed Sheeran - Photograph.mp3',
    color: '#a8a7d4',
    coverImage: '/Musiques/Yura yura - song.png',
  },
];

export function BackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [requiresInteraction, setRequiresInteraction] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const wasPlayingRef = useRef(false);

  const currentTrack = musicTracks[currentTrackIndex];

  // Initialize audio with current track
  useEffect(() => {
    if (!currentTrack) return;

    // Clean up previous audio completely
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current.load();
      audioRef.current = null;
    }

    // Create new audio element
    const audio = new Audio(currentTrack.path);
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    let unregisterUnlock: (() => void) | undefined;

    const attemptPlay = async () => {
      if (!audioRef.current) {
        return;
      }

      try {
        if (wasPlayingRef.current) {
          await audioRef.current.play();
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
        }
        setHasStarted(true);
        setRequiresInteraction(false);
      } catch (error) {
        console.warn("Autoplay blocked, waiting for user interaction", error);
        setIsPlaying(false);
        setRequiresInteraction(true);

        if (!unregisterUnlock) {
          unregisterUnlock = registerUnlock(async () => {
            await attemptPlay();
          });
        }
      }
    };

    void attemptPlay();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current.load();
      }
      audioRef.current = null;
      if (unregisterUnlock) {
        unregisterUnlock();
      }
    };
  }, [currentTrack]);

  const togglePlayback = async () => {
    if (!audioRef.current) {
      return;
    }

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
      setRequiresInteraction(false);
    } catch (error) {
      console.warn("Playback blocked", error);
      setRequiresInteraction(true);
    }
  };

  const handleNext = () => {
    wasPlayingRef.current = isPlaying;
    setCurrentTrackIndex((prev) => (prev + 1) % musicTracks.length);
  };

  const handleSelectTrack = (index: number) => {
    wasPlayingRef.current = isPlaying;
    setCurrentTrackIndex(index);
  };

  return (
    <AudioContextProvider audioElement={audioRef.current} isPlaying={isPlaying}>
      {/* Audio visualizations */}
      {hasStarted && (
        <>
          <div className="fixed bottom-0 left-0 right-0 h-48 pointer-events-none z-0">
            <AudioVisualizer isPlaying={isPlaying} />
          </div>
        </>
      )}

      {/* Music Controls integrated in header */}
      <MusicControls
        isPlaying={isPlaying}
        currentTrackTitle={currentTrack?.title}
        onPlayPause={togglePlayback}
        onNext={handleNext}
        onSelectTrack={handleSelectTrack}
        tracks={musicTracks.map(t => ({ id: t.id, title: t.title }))}
        currentTrackIndex={currentTrackIndex}
      />
    </AudioContextProvider>
  );
}