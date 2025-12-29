export default function ChoirLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12 lg:px-8">
      <div className="mb-8 h-8 w-2/3 animate-pulse rounded bg-[color:var(--muted)]" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 rounded-2xl border border-transparent bg-white/60 p-5 shadow-sm dark:bg-zinc-900/40">
            <span className="h-16 w-16 animate-pulse rounded-xl bg-[color:var(--muted)]" />
            <div className="flex-1 space-y-3">
              <span className="block h-4 w-1/2 animate-pulse rounded bg-[color:var(--muted)]" />
              <span className="block h-3 w-1/3 animate-pulse rounded bg-[color:var(--muted)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
