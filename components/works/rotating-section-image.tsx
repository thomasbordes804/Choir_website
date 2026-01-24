'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface RotatingSectionImageProps {
  imagePaths: string[];
  alt: string;
  interval?: number; // Time in milliseconds between transitions
}

export function RotatingSectionImage({ 
  imagePaths, 
  alt, 
  interval = 6000
}: RotatingSectionImageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (imagePaths.length <= 1) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % imagePaths.length);
        setIsTransitioning(false);
      }, 300); // Half of transition duration (600ms / 2)
    }, interval);

    return () => clearInterval(timer);
  }, [imagePaths.length, interval]);

  if (imagePaths.length === 0) return null;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {imagePaths.map((path, index) => (
        <div
          key={`${path}-${index}`}
          className={`absolute inset-0 transition-opacity duration-[600ms] ease-in-out ${
            index === currentIndex
              ? isTransitioning
                ? 'opacity-0'
                : 'opacity-100'
              : 'opacity-0'
          }`}
        >
          <Image
            src={path}
            alt={`${alt} - Image ${index + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  );
}