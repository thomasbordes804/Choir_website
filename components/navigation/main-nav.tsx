'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

// Flat, elegant nav — no hover dropdowns/submenus (removed per request).
// Every entry is a plain link straight to its section's top-level page.
const NAV_ITEMS = [
  { href: "/", label: "Accueil" },
  { href: "/actuality", label: "Actualités" },
  { href: "/works", label: "Œuvres" },
  { href: "/biography", label: "Biographie" },
  { href: "/communication", label: "Communication" },
  { href: "/partenariat", label: "Partenariat" },
  { href: "/contact", label: "Contact" },
  { href: "/don", label: "Soutenir" },
];

// worksSubsections kept as a prop for backward compatibility with the page
// that passes it in, but it's intentionally unused now that dropdowns are
// gone — remove the prop from the call site whenever convenient.
export function MainNav({ worksSubsections }: { worksSubsections?: { href: string; label: string }[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="relative ml-8 px-5 py-1.5">
      <ul className="flex items-center gap-7 sm:gap-9">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === "/" ? pathname === item.href : pathname?.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group relative inline-block font-[family-name:var(--font-playfair)] text-[15px] italic tracking-[0.04em] transition-colors duration-300 sm:text-base"
                style={{ color: isActive ? '#fff' : 'rgba(247,243,236,0.78)' }}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-white/70 transition-all duration-500 ease-out ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
