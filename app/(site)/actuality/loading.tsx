export default function ActualityLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-14 lg:px-8">
      <div className="h-12 w-1/2 animate-pulse rounded-2xl bg-[color:var(--muted)]/60" />
      <div className="mt-8 space-y-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-48 animate-pulse rounded-3xl border border-transparent bg-white/70 shadow-md dark:bg-[rgba(15,23,42,0.6)]"
          />
        ))}
      </div>
    </div>
  );
}
