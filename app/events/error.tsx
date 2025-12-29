'use client';

interface EventsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function EventsError({ reset }: EventsErrorProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-4 px-6 py-12 lg:px-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Events failed to load</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          We can’t display the upcoming schedule right now. Try refreshing the view.
        </p>
      </div>
      <button
        type="button"
        onClick={reset}
        className="inline-flex items-center rounded-full bg-[color:var(--accent)] px-5 py-2 text-sm font-semibold text-[color:var(--accent-foreground)] shadow-sm transition hover:opacity-90"
      >
        Refresh events
      </button>
    </div>
  );
}
