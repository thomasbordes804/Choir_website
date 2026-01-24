'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, MouseEvent } from "react";

import { RichText } from "@/components/ui/rich-text";
import { PurchaseLink } from "@/components/ui/purchase-link";

interface InteractiveBookProps {
  book: {
    slug: string;
    title: string;
    subtitle?: string;
    description?: any;
    purchaseLinks?: Array<{ label: string; url: string }>;
    coverImagePath?: string;
  };
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    glow: string;
    light: string;
    border: string;
  };
  index: number;
}

export function InteractiveBook({ book, palette, index }: InteractiveBookProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const coverImagePath = book.coverImagePath;

  const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('a[target="_blank"]')) {
      return;
    }
    router.push(`/books/${book.slug}`);
  };

  const handleFlip = (e: MouseEvent) => {
    e.stopPropagation();
    setIsFlipping(true);
    setTimeout(() => setIsFlipping(false), 600);
  };

  return (
    <div
      className="group relative perspective-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient light effect */}
      <div className={`absolute -inset-4 bg-gradient-to-br ${palette.light} rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10`} />
      
      {/* 3D Book Container */}
      <div
        className={`relative transform-gpu transition-all duration-700 ${
          isHovered ? 'scale-105' : 'scale-100'
        } ${isFlipping ? 'rotate-y-180' : ''}`}
        style={{ transformStyle: 'preserve-3d' }}
        onClick={handleCardClick}
      >
        {/* Book Spine - 3D effect */}
        <div className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r ${palette.primary} rounded-l-2xl shadow-2xl transform rotate-y-90 origin-left transition-all duration-700 group-hover:w-12 group-hover:shadow-[0_0_40px_rgba(0,0,0,0.5)]`} />
        
        {/* Main Book Cover */}
        <div className={`relative ml-4 overflow-hidden rounded-r-2xl border-4 ${palette.border} bg-gradient-to-br ${palette.primary} shadow-2xl transition-all duration-700 group-hover:${palette.glow} cursor-pointer`}>
          {/* Book cover texture */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_50%)] opacity-60" />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.05)_49%,rgba(255,255,255,0.05)_51%,transparent_52%)] bg-[length:20px_20px]" />
          
          {/* Reading light effect */}
          <div className={`absolute inset-0 bg-gradient-to-br ${palette.light} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
          
          <div className="relative z-10 p-8 space-y-6">
            {/* Book Cover Image - 3D effect */}
            <div 
              className="relative aspect-[2/3] overflow-hidden rounded-xl bg-black/20 shadow-2xl transform transition-all duration-700 group-hover:scale-105 group-hover:rotate-2"
              onClick={handleFlip}
            >
              {coverImagePath ? (
                <>
                  <Image
                    src={coverImagePath}
                    alt={`Couverture de ${book.title}`}
                    width={400}
                    height={600}
                    className="h-full w-full object-cover"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    priority={index === 0}
                  />
                  {/* Flip indicator */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-md rounded-full p-3 border-2 border-white/30">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                  <span className="text-zinc-400 text-sm">Pas d'image</span>
                </div>
              )}
            </div>

            {/* Book Content */}
            <div className="space-y-4">
              <div>
                <h3 className="text-3xl font-black text-white mb-2 drop-shadow-2xl leading-tight group-hover:scale-105 transition-transform duration-500">
                  {book.title}
                </h3>
                
                {book.subtitle && (
                  <p className="text-lg font-extrabold text-white/90 drop-shadow-lg">
                    {book.subtitle}
                  </p>
                )}
              </div>
              
              {book.description && (
                <div className="prose prose-lg max-w-none">
                  <div className="text-base font-bold text-white/95 leading-relaxed line-clamp-3 drop-shadow-md">
                    <RichText value={book.description} />
                  </div>
                </div>
              )}
              
              {book.purchaseLinks && book.purchaseLinks.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {book.purchaseLinks.map((link, linkIndex) => (
                    <PurchaseLink
                      key={linkIndex}
                      label={link.label || "Acheter"}
                      url={link.url}
                    />
                  ))}
                </div>
              )}
              
              {/* Read more indicator */}
              <div className="flex items-center gap-2 text-sm font-extrabold text-white pt-2 group-hover:gap-3 transition-all duration-300">
                <span>Feuilleter le livre</span>
                <svg
                  className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:rotate-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Book pages effect - bottom edge */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-black/40 to-transparent" />
          
          {/* Corner highlights */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/20 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Floating pages effect on hover */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-16 h-20 bg-gradient-to-r from-white/20 to-white/10 rounded-sm border border-white/30 transform animate-float"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 15}%`,
                transform: `rotate(${i * 5 - 5}deg) translateY(${i * 10}px)`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}