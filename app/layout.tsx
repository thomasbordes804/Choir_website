import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display } from "next/font/google";

import { BackgroundAudio } from "@/components/layout/background-audio";
import { CustomCursor } from "@/components/layout/custom-cursor";
import { LightingControl } from "@/components/layout/lighting-control";
import { MainNav } from "@/components/navigation/main-nav";
//import { getWorksSections } from "@/lib/sanity/queries";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "ArtsParadise",
    template: "%s — ArtsParadise",
  },
  description: "Découvrez l'univers artistique de Michel Hilger, altiste-peintre et musicien au service des communautés.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Manual works subsections structure - define your own structure here
  const worksSubsections = [
    // Peintures
    { href: "/works/peinture-sur-toiles", label: "Peinture sur toiles" },
    { href: "/works/peinture-sur-table", label: "Peinture sur table" },
    { href: "/works/peinture-personnages", label: "Peinture sur clavecin" },
    
    // Musiques
    { href: "/works/composition-musicale", label: "Composition musicale" },
    { href: "/works/chants", label: "Chants" },
    
    // Chorales
    { href: "/works/chorale-de-sucy-en-brie", label: "Chorale de Sucy en Brie" },
    { href: "/works/chorale-de-bondy", label: "Chorale de Bondy" },
    { href: "/works/chorale-dorly", label: "Chorale d'Orly" },
    
    // Ecriture
    { href: "/works/poesies", label: "Poésies" },
    
    // Dessin
    { href: "/works/dessins", label: "Dessins, pastels et techniques mixtes" },
    
    // Sculpture
    { href: "/works/sculptures", label: "Sculptures" },
    
    // Portraits
    { href: "/works/portraits", label: "Portraits" },
    
    // Autres
    { href: "/works/impression-sur-tissu", label: "Impression sur tissu" },
    { href: "/works/coloriages", label: "Coloriages pédagogiques et thérapeutiques" },
    { href: "/works/design-packaging", label: "Design de packagings" },
    { href: "/works/flacon-parfums", label: "Flacon de parfums" },
    { href: "/works/affiches-evenementielles", label: "Affiches évènementielles" },
    { href: "/works/oeuvres-jeunesse", label: "Oeuvres de jeunesse" },
  ];

  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} bg-[color:var(--background)] text-[color:var(--foreground)] antialiased`}
      >
        <CustomCursor />
        <div className="flex min-h-screen flex-col">
          {/* Studio Nuts inspired minimal header */}
          <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
            <div className="relative mx-auto w-full max-w-7xl px-6 py-4 lg:px-8">
              {/* Top row: Arts Paradise, Music, Navigation - all on same level */}
              <div className="flex items-center justify-between w-full">
                {/* Left: Logo + Title */}
                <div className="flex items-center gap-3 flex-shrink-0 relative">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-3 text-white transition-opacity hover:opacity-70 group"
                  >
                    <div className="relative h-20 w-auto sm:h-24" style={{ background: 'transparent' }}>
                      <Image
                        src="/logo_website.png"
                        alt="ArtsParadise Logo"
                        width={100}
                        height={100}
                        className="h-20 w-auto sm:h-24"
                        priority
                        style={{
                          background: 'transparent',
                          backgroundColor: 'transparent',
                        }}
                        unoptimized
                      />
                    </div>
                    <span 
                      className={`hidden sm:inline font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-light tracking-[0.2em] text-white relative whitespace-nowrap`}
                      style={{
                        letterSpacing: '0.15em',
                      }}
                    >
                      <span className="relative inline-block">
                        Arts
                        <span className="absolute -bottom-0.5 left-0 w-full h-px bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                      </span>
                      <span className="mx-1 text-white/60">·</span>
                      <span className="relative inline-block">
                        Paradise
                        <span className="absolute -bottom-0.5 left-0 w-full h-px bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" style={{ transitionDelay: '0.1s' }} />
                      </span>
                    </span>
                  </Link>
                  
                  {/* Light button below Arts Paradise text - moved more to top and right */}
                  <div className="absolute left-[180px] sm:left-[200px] top-16 sm:top-20">
                    <LightingControl />
                  </div>
                </div>

                {/* Center: Music Controls */}
                <div className="flex items-center flex-1 justify-center">
                  <BackgroundAudio />
                </div>
                
                {/* Right: Navigation */}
                <div className="flex items-center flex-shrink-0">
                  <MainNav worksSubsections={worksSubsections} />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 relative bg-[#edeae6]">
            {/* Content with page transitions */}
            <div className="relative z-10">
              {children}
            </div>
          </main>

          <footer className="relative mt-16 border-t border-[color:var(--accent)]/20 py-8 bg-[#edeae6]">
            {/* Footer text */}
            <div className="relative mx-auto w-full max-w-6xl px-6 lg:px-8 text-center text-sm text-zinc-600 dark:text-zinc-300 z-10">
              <p>&copy; {new Date().getFullYear()} ArtsParadise. Tous droits réservés.</p>
              <p className="mt-1">Propulsé par Sanity &amp; Next.js.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}