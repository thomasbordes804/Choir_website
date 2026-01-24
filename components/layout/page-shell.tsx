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
    <section className="relative mx-auto w-full max-w-6xl px-6 py-14 lg:px-8 font-[family-name:var(--font-playfair)]">
      <div className="relative overflow-hidden rounded-3xl border border-[color:var(--surface-border)] bg-[color:var(--surface)]/95 px-8 py-10 shadow-xl shadow-[color:var(--accent)]/15 backdrop-blur-sm lg:px-12 lg:py-14">
        {/* Vibrant artistic gradient overlay */}
        <div 
          className="absolute inset-0 -z-10 opacity-60 dark:opacity-40" 
          style={{
            background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(78, 205, 196, 0.1) 25%, rgba(255, 230, 109, 0.1) 50%, rgba(255, 139, 148, 0.1) 75%, rgba(149, 225, 211, 0.1) 100%)',
          }}
          aria-hidden 
        />
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