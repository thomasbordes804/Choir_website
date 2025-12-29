import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-xl border border-zinc-200 bg-white px-6 py-8 shadow-sm dark:border-white/10 dark:bg-zinc-900/40">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
        {description ? (
          <p className="mt-1 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
        ) : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
