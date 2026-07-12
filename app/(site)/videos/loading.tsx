export default function VideosLoading() {
    return (
      <section className="relative mx-auto w-full max-w-6xl px-6 py-14 lg:px-8">
        <div className="mb-12 space-y-4">
          <div className="h-6 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-12 w-64 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-6 w-96 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-6 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="aspect-video animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          ))}
        </div>
      </section>
    );
  }