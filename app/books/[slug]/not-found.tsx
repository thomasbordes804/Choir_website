import Link from "next/link";

export default function BookNotFound() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 py-14 lg:px-8">
      <div className="rounded-xl border-2 border-zinc-200/60 bg-white/40 p-12 text-center dark:border-zinc-700/60 dark:bg-zinc-900/30">
        <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Livre non trouvé
        </h2>
        <p className="mb-6 text-lg text-zinc-700 dark:text-zinc-300">
          Le livre que vous recherchez n'existe pas ou a été déplacé.
        </p>
        <Link
          href="/books"
          className="inline-flex items-center rounded-full bg-[color:var(--accent)] px-6 py-3 text-base font-semibold text-[color:var(--accent-foreground)] transition-colors hover:opacity-90"
        >
          Retour aux livres
        </Link>
      </div>
    </section>
  );
}