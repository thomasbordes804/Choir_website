import type { Metadata } from "next";
import Image from "next/image";

import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { getChoirMembers } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Choir",
  description: "Explore the voices, sections, and roles within the choir.",
};

const getInitials = (name: string | null) => {
  if (!name) return "CC";
  const matches = name
    .split(" ")
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase())
    .slice(0, 2)
    .join("");

  return matches.length > 0 ? matches : "CC";
};

export default async function ChoirPage() {
  const members = await getChoirMembers();

    if (members.length === 0) {
    return (
      <PageShell
        eyebrow="Ensemble"
        title="Choir Members"
        description="Once members have been added in the studio they will appear here with their section and role information."
      >
        <EmptyState
          title="No choir members yet"
          description="Add profiles in the Sanity Studio to celebrate the people behind the harmonies."
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Ensemble"
      title="Choir Members"
      description="Meet the cantors, sopranos, altos, tenors, and basses who shape the choir’s sound."
    >
      <ul className="grid gap-5 sm:grid-cols-2">
        {members.map((member) => (
          <li
            key={member._id}
            className="relative flex items-center gap-4 overflow-hidden rounded-3xl border border-white/50 bg-white/80 p-5 shadow-md shadow-indigo-500/10 transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[rgba(15,23,42,0.6)]"
          >
            <div
              className="absolute inset-0 -z-10 bg-gradient-to-br from-white/40 via-transparent to-indigo-200/30 dark:from-indigo-500/20 dark:via-transparent dark:to-slate-900/30"
              aria-hidden
            />
            {member.image ? (
              <Image
                src={member.image.url}
                width={member.image.width ?? 64}
                height={member.image.height ?? 64}
                alt={member.name ?? "Choir member"}
                className="h-16 w-16 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[color:var(--muted)] text-base font-semibold uppercase tracking-wide text-[color:var(--muted-foreground)]">
                {getInitials(member.name)}
              </div>
            )}
            <div className="space-y-1">
                            <p className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{member.name ?? "Unnamed member"}</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">{member.role ?? "Role to be announced"}</p>
                        </div>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}