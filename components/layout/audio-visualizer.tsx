'use client';

import { useEffect, useRef } from 'react';
import { useAudioContext } from './audio-context-provider';

interface AudioVisualizerProps {
  isPlaying: boolean;
}

export function AudioVisualizer({ isPlaying }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const lastFrameRef = useRef<ImageData | null>(null);
  const { analyser, dataArray, isReady } = useAudioContext();

  useEffect(() => {
    if (!isReady || !analyser || !dataArray) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      lastFrameRef.current = null; // Clear last frame on resize
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const bufferLength = analyser.frequencyBinCount;
    const frequencyData = new Uint8Array(bufferLength);
    const timeData = new Uint8Array(bufferLength);

    // Helper function to map frequency index with logarithmic scaling
    const getFrequencyIndex = (barIndex: number, totalBars: number, totalFrequencies: number) => {
      const normalizedPosition = barIndex / totalBars;
      const logPosition = Math.pow(normalizedPosition, 0.7);
      return Math.floor(logPosition * totalFrequencies);
    };

    // Animation loop - ALWAYS continues, even when paused
    const draw = () => {
      if (!isReady || !analyser) {
        return;
      }

      // ALWAYS schedule next frame to keep animation loop running
      animationFrameRef.current = requestAnimationFrame(draw);

      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      // If paused and we have a last frame, restore it and continue loop
      if (!isPlaying && lastFrameRef.current) {
        ctx.putImageData(lastFrameRef.current, 0, 0);
        return; // Continue loop but don't update
      }

      // If paused but no last frame yet, just clear and wait
      if (!isPlaying) {
        // Don't draw anything, but keep the loop running
        return;
      }

      // If playing, get new audio data and draw
      analyser.getByteFrequencyData(frequencyData);
      analyser.getByteTimeDomainData(timeData);

      // Clear with transparency
      ctx.clearRect(0, 0, width, height);

      // Draw frequency bars
      const barCount = 150;
      const padding = 5;
      const availableWidth = width - (padding * 2);
      const spacing = 2;
      const totalSpacing = spacing * (barCount - 1);
      const barWidth = (availableWidth - totalSpacing) / barCount;
      const startX = padding;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = getFrequencyIndex(i, barCount, bufferLength);
        const safeIndex = Math.min(dataIndex, bufferLength - 1);
        const barHeight = (frequencyData[safeIndex] / 255) * height * 0.85;

        const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
        const intensity = frequencyData[safeIndex] / 255;
        gradient.addColorStop(0, `rgba(255, 107, 107, ${0.6 + intensity * 0.4})`);
        gradient.addColorStop(0.5, `rgba(168, 167, 212, ${0.5 + intensity * 0.4})`);
        gradient.addColorStop(1, `rgba(255, 107, 107, ${0.4})`);

        ctx.fillStyle = gradient;
        const x = startX + i * (barWidth + spacing);
        ctx.fillRect(
          x,
          height - barHeight,
          barWidth,
          barHeight
        );
      }

      // Draw waveform
      ctx.strokeStyle = `rgba(255, 107, 107, 0.8)`;
      ctx.lineWidth = 3;
      ctx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = timeData[i] / 128.0;
        const y = (v * height) / 2 + height / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.stroke();

      // Draw second waveform layer
      ctx.strokeStyle = `rgba(168, 167, 212, 0.5)`;
      ctx.lineWidth = 2;
      ctx.beginPath();

      x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = timeData[i] / 128.0;
        const y = (v * height) / 1.5 + height / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.stroke();

      // Draw floating frequency dots
      const dotCount = 80;
      for (let i = 0; i < dotCount; i++) {
        const freqIndex = getFrequencyIndex(i, dotCount, bufferLength);
        const safeIndex = Math.min(freqIndex, bufferLength - 1);
        const intensity = frequencyData[safeIndex] / 255;
        
        const x = (i / (dotCount - 1)) * width;
        const y = height - (intensity * height * 0.5);
        const size = 4 + intensity * 8;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
        gradient.addColorStop(0, `rgba(168, 167, 212, ${0.6 + intensity * 0.4})`);
        gradient.addColorStop(0.5, `rgba(255, 107, 107, ${0.3 + intensity * 0.3})`);
        gradient.addColorStop(1, 'rgba(168, 167, 212, 0)');

        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 167, 212, ${0.7 + intensity * 0.3})`;
        ctx.fill();
      }

      // Save current frame when playing (so we can restore it when paused)
      lastFrameRef.current = ctx.getImageData(0, 0, width, height);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyser, dataArray, isReady, isPlaying]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}