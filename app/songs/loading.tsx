export default function SongsLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-12 lg:px-8">
      <div className="mb-8 h-8 w-1/2 animate-pulse rounded bg-[color:var(--muted)]" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="space-y-2 rounded-2xl border border-transparent bg-white/60 p-6 shadow-sm dark:bg-zinc-900/40">
            <span className="block h-4 w-1/2 animate-pulse rounded bg-[color:var(--muted)]" />
            <span className="block h-3 w-1/3 animate-pulse rounded bg-[color:var(--muted)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
