'use client';

export default function BooksError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 py-14 lg:px-8">
      <div className="rounded-xl border-2 border-red-200/60 bg-red-50/50 p-12 text-center dark:border-red-800/60 dark:bg-red-900/20">
        <h2 className="mb-4 text-2xl font-semibold text-red-900 dark:text-red-100">
          Erreur lors du chargement des livres
        </h2>
        <p className="mb-6 text-red-700 dark:text-red-300">
          {error.message || "Une erreur est survenue lors du chargement des livres."}
        </p>
        <button
          onClick={reset}
          className="rounded-full bg-[color:var(--accent)] px-6 py-3 text-sm font-semibold text-[color:var(--accent-foreground)] transition-colors hover:opacity-90"
        >
          Réessayer
        </button>
      </div>
    </section>
  );
}