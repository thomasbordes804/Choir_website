'use client';

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("App Router error", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Something went wrong</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          We couldn’t load the latest choir updates. Please try again in a moment.
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
