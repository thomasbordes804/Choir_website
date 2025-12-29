'use client';

import { useEffect, useRef, useState } from "react";

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

export function BackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [requiresInteraction, setRequiresInteraction] = useState(false);

  useEffect(() => {
    const audio = new Audio("/media/last-dream.mp3");
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    let unregisterUnlock: (() => void) | undefined;

    const attemptPlay = async () => {
      if (!audioRef.current) {
        return;
      }

      try {
        await audioRef.current.play();
        setIsPlaying(true);
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
  }, []);

  const togglePlayback = async () => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
      setRequiresInteraction(false);
    } catch (error) {
      console.warn("Playback blocked", error);
      setRequiresInteraction(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {requiresInteraction ? (
        <div className="rounded-full bg-white px-4 py-2 text-xs font-medium text-zinc-600 shadow-lg ring-1 ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-white/10">
          Tap play to enable background music
        </div>
      ) : null}
      <button
        type="button"
        onClick={togglePlayback}
        className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-[color:var(--accent-foreground)] shadow-lg transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--accent)]"
        aria-pressed={isPlaying}
      >
        <span className="inline-flex h-2.5 w-2.5 items-center justify-center">
          <span
            className={`block h-2.5 w-2.5 ${
              isPlaying
                ? "animate-pulse rounded-full bg-[color:var(--accent-foreground)]"
                : "rounded-sm border border-[color:var(--accent-foreground)]"
            }`}
          />
        </span>
        {isPlaying ? "Pause music" : "Play music"}
      </button>
    </div>
  );
}
