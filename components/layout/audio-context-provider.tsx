'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';

interface AudioContextValue {
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
  dataArray: Uint8Array | null;
  isReady: boolean;
}

const AudioContextContext = createContext<AudioContextValue>({
  audioContext: null,
  analyser: null,
  dataArray: null,
  isReady: false,
});

export function useAudioContext() {
  return useContext(AudioContextContext);
}

interface AudioContextProviderProps {
  audioElement: HTMLAudioElement | null;
  isPlaying: boolean;
  children: ReactNode;
}

export function AudioContextProvider({ audioElement, isPlaying, children }: AudioContextProviderProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // If audio element changed or stopped, cleanup
    if (audioElement !== audioElementRef.current) {
      // Cleanup old connection if element changed
      if (sourceRef.current && audioElementRef.current) {
        try {
          sourceRef.current.disconnect();
        } catch (e) {
          // Ignore disconnect errors
        }
        sourceRef.current = null;
      }
      audioElementRef.current = audioElement;
    }

    if (!audioElement || !isPlaying) {
      setIsReady(false);
      return;
    }

    // Only create if we don't have a source already
    if (!audioContextRef.current || !sourceRef.current) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.8;

        // Check if audio element already has a source (shouldn't happen, but safety check)
        // Create MediaElementSource only once per audio element
        const source = audioContext.createMediaElementSource(audioElement);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        sourceRef.current = source;
        dataArrayRef.current = dataArray;
        setIsReady(true);
      } catch (error) {
        console.warn('Failed to create audio context:', error);
        setIsReady(false);
      }
    } else {
      // Already set up, just mark as ready
      setIsReady(true);
    }

    return () => {
      // Don't cleanup here - let it persist while audio is playing
    };
  }, [audioElement, isPlaying]);

  // Cleanup when component unmounts or audio stops
  useEffect(() => {
    return () => {
      if (sourceRef.current) {
        try {
          sourceRef.current.disconnect();
        } catch (e) {
          // Ignore disconnect errors
        }
        sourceRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close();
        } catch (e) {
          // Ignore close errors
        }
        audioContextRef.current = null;
      }
      analyserRef.current = null;
      dataArrayRef.current = null;
      audioElementRef.current = null;
      setIsReady(false);
    };
  }, []);

  return (
    <AudioContextContext.Provider
      value={{
        audioContext: audioContextRef.current,
        analyser: analyserRef.current,
        dataArray: dataArrayRef.current,
        isReady,
      }}
    >
      {children}
    </AudioContextContext.Provider>
  );
}