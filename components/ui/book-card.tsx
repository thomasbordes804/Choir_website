'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

import { RichText } from "@/components/ui/rich-text";
import { PurchaseLink } from "@/components/ui/purchase-link";

interface BookCardProps {
  book: {
    slug: string;
    title: string;
    subtitle?: string;
    description?: any;
    purchaseLinks?: Array<{ label: string; url: string }>;
    coverImagePath?: string;
  };
}

export function BookCard({ book }: BookCardProps) {
  const router = useRouter();
  const coverImagePath = book.coverImagePath;

  const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
    // Ne pas naviguer si on clique sur un lien d'achat
    const target = e.target as HTMLElement;
    if (target.closest('a[target="_blank"]')) {
      return;
    }
    router.push(`/books/${book.slug}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer relative overflow-hidden rounded-xl border-2 border-zinc-200/60 bg-white/70 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:border-[color:var(--accent)]/60 hover:shadow-xl hover:shadow-[color:var(--accent)]/20 dark:border-zinc-700/60 dark:bg-zinc-900/50 dark:hover:bg-zinc-900/70"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cover Image - Square/Card format on left */}
        {coverImagePath ? (
          <div className="flex-shrink-0 lg:w-64 w-full sm:w-48 mx-auto lg:mx-0">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800 shadow-md">
              <Image
                src={coverImagePath}
                alt={`Couverture de ${book.title}`}
                width={300}
                height={450}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 256px, (min-width: 640px) 192px, 100vw"
                priority={false}
              />
            </div>
          </div>
        ) : (
          <div className="flex-shrink-0 lg:w-64 w-full sm:w-48 mx-auto lg:mx-0">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
              <span className="text-zinc-400 dark:text-zinc-500 text-sm">Pas d'image</span>
            </div>
          </div>
        )}
        
        {/* Book Content */}
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[color:var(--accent)] transition-colors">
              {book.title}
            </h3>
            
            {book.subtitle && (
              <p className="text-lg font-semibold text-[color:var(--accent)] mt-2">
                {book.subtitle}
              </p>
            )}
          </div>
          
          {book.description && (
            <div className="prose prose-lg max-w-none">
              <div className="text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
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
          <div className="flex items-center gap-2 text-sm font-semibold text-[color:var(--accent)] pt-2">
            <span>En savoir plus</span>
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}