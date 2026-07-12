export default function BiographyLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-14 lg:px-8">
      <div className="h-10 w-2/3 animate-pulse rounded-2xl bg-[color:var(--muted)]/60" />
      <div className="mt-8 space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-6 animate-pulse rounded bg-[color:var(--muted)]/60" />
        ))}
      </div>
    </div>
  );
}
