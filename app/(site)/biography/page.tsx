import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { EmptyState } from "@/components/ui/empty-state";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { TopVideoTemplate } from "@/components/ui/top-video-template";

import {
  getBiographyPage,
  getBiographySections,
  getSiteSettings,
} from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Biographie",
  description:
    "Informations biographiques sur Michel Hilger, altiste-peintre et musicien au service des communautés.",
};

// Chapter images cycle through these (order: alto, orgue, peinture, écriture)
const chapterImages = [
  "/showcase/alto.png",
  "/orgue/org_10.webp",
  "/showcase/tableau.png",
  "/Livres/la_mort_attendra.webp",
];

const biographyImages = [
  "/biographie/portrait.webp",
  "/home_page/home_page_2.jpg",
  "/home_page/home_page_3.jpg",
  "/home_page/home_page_1.jpg",
];

export default async function BiographyPage() {
  const [biography, biographySections, siteSettings] = await Promise.all([
    getBiographyPage(),
    getBiographySections(),
    getSiteSettings(),
  ]);

  const pageTitle = biography?.title ?? "Explorez son parcours.";
  const pageDescription = siteSettings?.tagline ?? "...";

  const sortedSections = biographySections
    ? [...biographySections].sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
    : [];

  return (
    <div className="relative min-h-screen bg-[#fbfaf8]">
      {/* Hero Section with Video Background - Matching Biography/Oeuvres/Actualités pattern */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <TopVideoTemplate videoSrc="/showcase/biographie/biographie.mp4" />
        <div className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
          <Image
            src={biographyImages[0]}
            alt="Michel Hilger"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent z-10" />
        <div className="relative z-20 max-w-4xl mx-auto px-6 lg:px-8 text-center pt-32 sm:pt-40">
          <div className="mb-6 text-sm uppercase tracking-[0.3em] text-white/80 font-light">
            Biographie
          </div>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white mb-4 drop-shadow-lg"
            style={{ textShadow: "0 2px 10px rgba(0, 0, 0, 0.5), 0 4px 20px rgba(0, 0, 0, 0.3)" }}
          >
            {pageTitle}
          </h1>
          {/* Hand-drawn underline — same motif as the homepage hero, in terracotta for this page */}
          <svg width="180" height="14" viewBox="0 0 180 14" className="block mx-auto mb-8" aria-hidden="true">
            <path
              d="M2 8 Q90 2 178 8"
              fill="none"
              stroke="#a8433a"
              strokeWidth={2}
              strokeLinecap="round"
              className="animate-draw-line"
            />
          </svg>
          {pageDescription && (
            <p
              className="text-lg sm:text-xl md:text-2xl text-white font-light max-w-2xl mx-auto leading-relaxed drop-shadow-lg"
              style={{ textShadow: "0 2px 8px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.3)" }}
            >
              {pageDescription}
            </p>
          )}
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex flex-col items-center gap-2">
            <div className="text-white/60 text-xs uppercase tracking-wider font-light">Défilez</div>
            <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent" />
          </div>
        </div>
      </section>

      {/* Ouverture — « Le fil d'une vie » (design 6a) */}
      <section className="pt-28 pb-20 px-6 lg:px-8 text-center">
        <ScrollReveal>
          <div className="mb-5 text-xs uppercase tracking-[0.35em] text-zinc-500 font-light">
            Parcours
          </div>
          <h2 className="text-4xl sm:text-5xl italic font-normal tracking-tight text-zinc-900 mb-5">
            Une vie, plusieurs voix
          </h2>
          <svg width="200" height="14" viewBox="0 0 220 16" className="block mx-auto mb-7" aria-hidden="true">
            <path
              d="M4 10 Q110 2 216 10"
              fill="none"
              stroke="#a8433a"
              strokeWidth={2}
              strokeLinecap="round"
              className="animate-draw-line"
            />
          </svg>
          <p className="text-lg sm:text-xl text-zinc-600 leading-relaxed max-w-2xl mx-auto">
            L'alto, l'orgue, la peinture, l'écriture : quatre langages, un seul artiste. Cette
            biographie suit le fil qui les relie — des premières notes aux dernières toiles,
            toujours au service des communautés qu'il rencontre.
          </p>
        </ScrollReveal>
      </section>

      {/* Chapitres reliés par le fil */}
      {sortedSections.length > 0 && (
        <section className="relative pb-24 px-6 lg:px-8">
          {/* Le fil vertical terracotta */}
          <div
            className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-px opacity-35"
            style={{
              background:
                "linear-gradient(to bottom, transparent, #a8433a 8%, #a8433a 92%, transparent)",
            }}
            aria-hidden="true"
          />
          <div className="max-w-7xl mx-auto flex flex-col gap-24 lg:gap-28 pt-8">
            {sortedSections.map((section, index) => {
              if (!section.slug) return null;
              const isImageLeft = index % 2 === 0;
              const img = chapterImages[index % chapterImages.length];
              const num = String(index + 1).padStart(2, "0");

              return (
                <ScrollReveal key={section._id}>
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_120px_1fr] gap-8 lg:gap-0 items-center">
                    {/* Image */}
                    <div
                      className={`group ${
                        isImageLeft
                          ? "lg:col-start-1 justify-self-center lg:justify-self-end"
                          : "lg:col-start-3 lg:row-start-1 justify-self-center lg:justify-self-start"
                      }`}
                    >
                      <div className="overflow-hidden rounded-t-full w-[320px] sm:w-[420px] aspect-[4/5] shadow-[0_18px_44px_rgba(26,26,26,0.12)] transition-transform duration-500 ease-out group-hover:-translate-y-2">
                        <div
                          className="w-full h-full bg-cover bg-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                          style={{ backgroundImage: `url(${img})` }}
                        />
                      </div>
                    </div>

                    {/* Pastille numérotée sur le fil */}
                    <div className="hidden lg:flex lg:col-start-2 lg:row-start-1 items-center justify-center justify-self-center w-[52px] h-[52px] rounded-full bg-[#fbfaf8] border border-[#a8433a]/40 text-xl italic text-[#a8433a] z-10">
                      {num}
                    </div>

                    {/* Texte */}
                    <div
                      className={`max-w-[460px] ${
                        isImageLeft
                          ? "lg:col-start-3 lg:row-start-1 justify-self-center lg:justify-self-start text-center lg:text-left"
                          : "lg:col-start-1 lg:row-start-1 justify-self-center lg:justify-self-end text-center lg:text-right"
                      }`}
                    >
                      <div className="mb-3 text-xs uppercase tracking-[0.3em] text-[#a8433a]">
                        Chapitre {num}
                      </div>
                      <h3 className="text-3xl sm:text-4xl italic font-normal tracking-tight text-zinc-900 leading-tight mb-4">
                        {section.title || "Section sans titre"}
                      </h3>
                      {section.description && (
                        <p className="text-[17px] text-zinc-600 leading-relaxed mb-5">
                          {section.description}
                        </p>
                      )}
                      <Link
                        href={`/biography/${section.slug}`}
                        className="inline-block text-xs uppercase tracking-[0.22em] text-zinc-900 border-b border-zinc-300 pb-1 transition-colors duration-300 hover:text-[#a8433a] hover:border-[#a8433a]"
                      >
                        En savoir plus →
                      </Link>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </section>
      )}

      {/* Épilogue */}
      <section className="pb-28 px-6 lg:px-8">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto relative overflow-hidden aspect-[16/9] sm:aspect-[21/9] rounded-sm">
            <Image
              src={biographyImages[2]}
              alt="Michel Hilger - Artiste"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141210]/65 via-[#141210]/15 to-transparent" />
            <div className="absolute left-0 right-0 bottom-0 p-8 sm:p-14">
              <p className="text-xl sm:text-2xl lg:text-3xl italic font-normal text-[#faf9f6] leading-snug max-w-3xl">
                « Je n'ai jamais choisi entre la musique et la peinture.
                <br />
                Ce sont elles qui m'ont choisi. »
              </p>
              <div className="mt-4 text-[13px] uppercase tracking-[0.25em] text-[#faf9f6]/75">
                — Michel Hilger
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Empty State */}
      {(!biographySections || biographySections.length === 0) && (
        <section className="relative py-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <EmptyState
              title="Aucune section de biographie"
              description="Ajoutez des sections de biographie dans le Sanity Studio pour les afficher ici."
              action={
                <Link
                  href="/studio"
                  className="inline-flex items-center rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-[color:var(--accent-foreground)]"
                >
                  Ouvrir le Studio
                </Link>
              }
            />
          </div>
        </section>
      )}
    </div>
  );
}
