import type { ReactNode } from "react";

interface PageShellProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  eyebrow?: string;
  children: ReactNode;
}

export function PageShell({ title, description, actions, eyebrow, children }: PageShellProps) {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 py-14 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-[color:var(--surface-border)] bg-[color:var(--surface)]/95 px-8 py-10 shadow-xl shadow-indigo-500/10 backdrop-blur-sm lg:px-12 lg:py-14">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/40 via-transparent to-indigo-200/20 opacity-70 dark:from-white/5 dark:via-white/0 dark:to-indigo-500/10" aria-hidden />
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            {eyebrow ? (
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl">
              {title}
            </h1>
            {description ? (
              <p className="max-w-2xl text-base text-zinc-600 dark:text-zinc-300">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-3">{actions}</div> : null}
        </div>
        <div className="space-y-8">{children}</div>
      </div>
    </section>
  );
}
