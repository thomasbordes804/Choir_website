'use client';

interface ActualityErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ActualityError({ reset }: ActualityErrorProps) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-4 px-6 py-14 lg:px-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Unable to load actuality</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          We couldn’t fetch the latest announcements. Please try again shortly.
        </p>
      </div>
      <button
        type="button"
        onClick={reset}
        className="inline-flex items-center rounded-full bg-[color:var(--accent)] px-5 py-2 text-sm font-semibold text-[color:var(--accent-foreground)] shadow-sm transition hover:opacity-90"
      >
        Reload updates
      </button>
    </div>
  );
}
