export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-[color:var(--muted)] border-t-[color:var(--accent)]" aria-hidden />
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Loading the latest from the choir…</p>
      </div>
    </div>
  );
}
