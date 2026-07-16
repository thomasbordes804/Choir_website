'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

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

export function MainNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close the mobile menu on route change and lock body scroll while open.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <nav aria-label="Main navigation" className="relative px-5 py-1.5 md:ml-8">
      {/* Desktop — flat inline list */}
      <ul className="hidden items-center gap-7 md:flex lg:gap-9">
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

      {/* Mobile — hamburger trigger */}
      <button
        type="button"
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center text-white md:hidden"
      >
        {isOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Mobile — full-screen overlay menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-black/95 backdrop-blur-sm md:hidden">
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setIsOpen(false)}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center text-white"
          >
            <X size={28} />
          </button>
          <ul className="flex flex-col items-center gap-6">
            {NAV_ITEMS.map((item) => {
              const isActive = item.href === "/" ? pathname === item.href : pathname?.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="font-[family-name:var(--font-playfair)] text-2xl italic tracking-[0.04em]"
                    style={{ color: isActive ? '#fff' : 'rgba(247,243,236,0.78)' }}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
