import type { Metadata } from "next";

import { RichText } from "@/components/ui/rich-text";
import { InteractiveBook } from "@/components/ui/interactive-book";
import { getBooksPage } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Livres",
  description: "Découvrez les ouvrages de Michel Hilger : témoignages, autobiographie et récits inspirants.",
};

// Book-themed color palettes
const bookPalettes = [
  {
    primary: "from-amber-600 via-orange-600 to-red-600",
    secondary: "from-yellow-500 via-amber-500 to-orange-500",
    accent: "bg-gradient-to-br from-amber-400 to-orange-500",
    glow: "shadow-[0_0_80px_rgba(251,191,36,0.8)]",
    light: "from-amber-400/50 via-orange-400/50 to-red-400/50",
    border: "border-amber-400",
  },
  {
    primary: "from-indigo-600 via-purple-600 to-pink-600",
    secondary: "from-violet-500 via-purple-500 to-fuchsia-500",
    accent: "bg-gradient-to-br from-indigo-400 to-purple-500",
    glow: "shadow-[0_0_80px_rgba(99,102,241,0.8)]",
    light: "from-indigo-400/50 via-purple-400/50 to-pink-400/50",
    border: "border-indigo-400",
  },
];

export default async function BooksPage() {
  const booksPage = await getBooksPage();

  const pageTitle = booksPage?.title ?? "Livres";
  const pageDescription = booksPage?.description ?? "Découvrez les ouvrages de Michel Hilger : témoignages, autobiographie et récits inspirants.";

  // Extract books from content
  const books = booksPage?.books || [];
  const contentWithoutBooks = booksPage?.content?.filter((item: any) => item._type !== "book") || [];

  return (
    <section className="relative mx-auto w-full max-w-7xl px-6 py-14 lg:px-8 font-[family-name:var(--font-playfair)] overflow-hidden">
      {/* Library atmosphere background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Warm library lighting */}
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-to-br from-amber-400/30 via-orange-400/20 to-red-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-gradient-to-tl from-indigo-400/30 via-purple-400/20 to-pink-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Bookshelf decorative lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 200 100" preserveAspectRatio="none">
          {/* Bookshelf shelves */}
          <line x1="0" y1="30" x2="200" y2="30" stroke="currentColor" strokeWidth="1" className="text-amber-600" />
          <line x1="0" y1="60" x2="200" y2="60" stroke="currentColor" strokeWidth="1" className="text-orange-600" />
          <line x1="0" y1="90" x2="200" y2="90" stroke="currentColor" strokeWidth="1" className="text-red-600" />
          {/* Book spines */}
          {[...Array(8)].map((_, i) => (
            <rect key={i} x={10 + i * 24} y={25} width="4" height="10" fill="currentColor" className="text-amber-500/40" />
          ))}
        </svg>
      </div>

      {/* Page Header - Library Style */}
      <div className="mb-16 space-y-6 relative z-10">
        {/* Decorative header with book theme */}
        <div className="flex items-center gap-4">
          {/* Left decorative element - Open book */}
          <div className="flex items-center gap-3">
            <div className="h-1 w-16 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full" />
            <div className="relative">
              <div className="w-10 h-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-l-md shadow-lg transform -skew-x-12" />
              <div className="absolute inset-0 w-10 h-8 bg-gradient-to-l from-indigo-600 to-purple-600 rounded-r-md shadow-lg transform skew-x-12" style={{ marginLeft: '8px' }} />
            </div>
            <div className="h-1 w-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
          </div>
          
          {/* Center label */}
          <p className="text-sm tracking-[0.3em] uppercase font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 dark:from-amber-400 dark:via-orange-400 dark:to-red-400">
            BIBLIOTHÈQUE
          </p>
          
          {/* Right decorative element */}
          <div className="flex items-center gap-3 flex-1">
            <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-rose-500 rounded-full" />
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-1 h-8 bg-gradient-to-b from-amber-500 via-orange-500 to-red-500 rounded-full opacity-60" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            <div className="h-1 flex-1 bg-gradient-to-r from-rose-500 via-red-500 to-transparent rounded-full" />
          </div>
        </div>

        {/* Main title with library gradient */}
        <h1 className="text-6xl sm:text-7xl font-black tracking-tight">
          <span className="block bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
            {pageTitle}
          </span>
        </h1>

        {/* Description with decorative elements */}
        {pageDescription && (
          <div className="relative">
            <p className="max-w-3xl text-xl leading-relaxed font-bold text-zinc-800 dark:text-zinc-200">
              {pageDescription}
            </p>
            {/* Decorative book pages */}
            <div className="mt-4 flex items-center gap-2">
              <div className="h-0.5 w-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-6 h-8 bg-gradient-to-r from-amber-500/30 via-orange-500/30 to-red-500/30 rounded-sm border border-amber-400/20" style={{ transform: `rotate(${i * 2 - 2}deg)` }} />
                ))}
              </div>
              <div className="h-0.5 flex-1 bg-gradient-to-r from-orange-500 via-red-500 to-transparent rounded-full" />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-20 relative z-10">
        {/* Introduction Content */}
        {contentWithoutBooks && contentWithoutBooks.length > 0 && (
          <article className="prose prose-lg max-w-none">
            <div className="text-xl leading-relaxed text-zinc-900 dark:text-zinc-100 font-semibold space-y-6">
              <RichText value={contentWithoutBooks} />
            </div>
          </article>
        )}

        {/* Interactive Books Display */}
        {books && books.length > 0 ? (
          <section className="space-y-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-1 w-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
              <p className="text-sm tracking-[0.3em] uppercase font-extrabold text-amber-600 dark:text-amber-400">
                Ouvrages
              </p>
              <div className="h-1 flex-1 bg-gradient-to-r from-orange-500 to-transparent rounded-full" />
            </div>

            <div className="grid gap-12 lg:grid-cols-2">
              {books.map((book: any, index: number) => {
                const bookSlug = book.slug || `book-${index}`;
                const palette = bookPalettes[index % bookPalettes.length];
                
                return (
                  <InteractiveBook
                    key={index}
                    book={{
                      ...book,
                      slug: bookSlug,
                      coverImagePath: book.coverImagePath || book.coverImage?.url,
                    }}
                    palette={palette}
                    index={index}
                  />
                );
              })}
            </div>
          </section>
        ) : (
          <div className="rounded-2xl border-4 border-amber-700/60 bg-gradient-to-br from-amber-900/80 to-orange-900/80 backdrop-blur-md p-12 text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-lg font-bold text-amber-200">
              Les livres seront bientôt disponibles.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}