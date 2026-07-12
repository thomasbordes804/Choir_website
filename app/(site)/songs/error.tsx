'use client';

interface SongsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SongsError({ reset }: SongsErrorProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-4 px-6 py-12 lg:px-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Unable to fetch songs</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          We couldn’t reach the music library right now. Please retry in a moment.
        </p>
      </div>
      <button
        type="button"
        onClick={reset}
        className="inline-flex items-center rounded-full bg-[color:var(--accent)] px-5 py-2 text-sm font-semibold text-[color:var(--accent-foreground)] shadow-sm transition hover:opacity-90"
      >
        Retry loading
      </button>
    </div>
  );
}
