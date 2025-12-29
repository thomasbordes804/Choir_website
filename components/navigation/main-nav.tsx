'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/actuality", label: "Actuality" },
  { href: "/biography", label: "Biography" },
  { href: "/songs", label: "Songs" },
  { href: "/events", label: "Events" },
  { href: "/choir", label: "Choir" },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation">
      <ul className="flex flex-wrap items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
        {navItems.map((item) => {
          const isActive = item.href === "/"
            ? pathname === item.href
            : pathname?.startsWith(item.href ?? "");

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`inline-flex items-center rounded-full border px-4 py-1.5 transition-all ${
                  isActive
                    ? "border-transparent bg-[color:var(--accent)] text-[color:var(--accent-foreground)] shadow-sm shadow-[color:var(--accent)]/30"
                    : "border-transparent bg-white/60 text-current shadow-sm hover:border-[color:var(--accent)]/30 hover:bg-white hover:text-[color:var(--accent)] dark:bg-[rgba(15,23,42,0.6)] dark:hover:bg-[rgba(15,23,42,0.8)]"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
