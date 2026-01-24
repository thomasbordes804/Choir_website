import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RichText } from "@/components/ui/rich-text";
import { getBooksPage, getBookBySlug } from "@/lib/sanity/queries";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const booksPage = await getBooksPage();
  const books = booksPage?.books || [];
  
  return books
    .filter((book: any) => book.slug)
    .map((book: any) => ({
      slug: book.slug!,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookBySlug(slug);

  if (!book) {
    return {
      title: "Livre non trouvé",
    };
  }

  return {
    title: book.title ?? "Livre",
    description: book.subtitle ?? undefined,
  };
}

export default async function BookDetailPage({ params }: Props) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);

  if (!book) {
    notFound();
  }

  const coverImagePath = book.coverImagePath || book.coverImage?.url;
  const galleryImages = book.galleryImages || [];

  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 py-14 lg:px-8 font-[family-name:var(--font-playfair)]">
      {/* Back Navigation */}
      <Link
        href="/books"
        className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:text-[color:var(--accent)] mb-8"
      >
        <svg
          className="h-4 w-4 transition-transform group-hover:-translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Retour aux livres
      </Link>

      {/* Page Header */}
      <div className="mb-12 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
          LIVRE
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          {book.title ?? "Livre"}
        </h1>
        {book.subtitle && (
          <p className="max-w-3xl text-lg text-[color:var(--accent)] font-semibold">
            {book.subtitle}
          </p>
        )}
      </div>

      <div className="space-y-12">
        {/* Book Content with Image */}
        <article className="relative">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cover Image - Float left on large screens */}
            {coverImagePath && (
              <div className="flex-shrink-0 lg:w-80">
                <figure className="group relative overflow-hidden rounded-xl border-2 border-zinc-200/60 bg-white/60 shadow-lg transition-all duration-300 hover:border-[color:var(--accent)]/60 hover:shadow-xl hover:shadow-[color:var(--accent)]/20 dark:border-zinc-700/60 dark:bg-zinc-900/40 dark:hover:border-[color:var(--accent)]/40">
                  <div className="relative aspect-[2/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <Image
                      src={coverImagePath}
                      alt={`Couverture de ${book.title}`}
                      width={400}
                      height={600}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 320px, 100vw"
                    />
                  </div>
                </figure>
              </div>
            )}
            
            {/* Book Description */}
            <div className="flex-1 space-y-6">
              {/* Book Info */}
              {(book.authors || book.publisher || book.publicationDate) && (
                <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {book.authors && book.authors.length > 0 && (
                    <p>
                      <span className="font-semibold">Auteur(s) :</span> {book.authors.join(", ")}
                    </p>
                  )}
                  {book.publisher && (
                    <p>
                      <span className="font-semibold">Éditeur :</span> {book.publisher}
                    </p>
                  )}
                  {book.publicationDate && (
                    <p>
                      <span className="font-semibold">Date de publication :</span> {book.publicationDate}
                    </p>
                  )}
                </div>
              )}

              {book.description && (
                <div className="prose prose-lg max-w-none">
                  <div className="text-xl leading-relaxed text-zinc-900 dark:text-zinc-100 font-normal space-y-6">
                    <RichText value={book.description} />
                  </div>
                </div>
              )}
              
              {/* Purchase Links */}
              {book.purchaseLinks && book.purchaseLinks.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Où acheter ce livre ?
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {book.purchaseLinks.map((link: any, linkIndex: number) => (
                      <Link
                        key={linkIndex}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-full bg-[color:var(--accent)] px-6 py-3 text-base font-semibold text-[color:var(--accent-foreground)] transition-colors hover:opacity-90"
                      >
                        {link.label || "Acheter"}
                        <svg
                          className="ml-2 h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Gallery Section */}
        {galleryImages && galleryImages.length > 0 && (
          <section className="space-y-8">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
                Galerie
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((image: any, index: number) => {
                if (!image.url) return null;

                return (
                  <figure
                    key={image.url || index}
                    className="group relative overflow-hidden rounded-xl border-2 border-zinc-200/60 bg-white/60 shadow-lg transition-all duration-300 hover:border-[color:var(--accent)]/60 hover:shadow-xl hover:shadow-[color:var(--accent)]/20 dark:border-zinc-700/60 dark:bg-zinc-900/40 dark:hover:border-[color:var(--accent)]/40"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                      <Image
                        src={image.url}
                        alt={image.alt ?? `Image ${index + 1} de ${book.title}`}
                        width={800}
                        height={600}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                    </div>
                    {image.caption && (
                      <figcaption className="px-4 py-3 text-center text-sm text-zinc-700 dark:text-zinc-300 font-normal">
                        {image.caption}
                      </figcaption>
                    )}
                  </figure>
                );
              })}
            </div>
          </section>
        )}

        {/* Additional Content */}
        {book.additionalContent && book.additionalContent.length > 0 && (
          <article className="prose prose-lg max-w-none">
            <div className="text-xl leading-relaxed text-zinc-900 dark:text-zinc-100 font-normal space-y-6">
              <RichText value={book.additionalContent} />
            </div>
          </article>
        )}
      </div>
    </section>
  );
}