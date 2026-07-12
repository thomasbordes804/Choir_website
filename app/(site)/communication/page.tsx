import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { EmptyState } from "@/components/ui/empty-state";
import { TopVideoTemplate } from "@/components/ui/top-video-template";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { getSiteSettings } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Communication",
  description: "Communication, médias et événements de Michel Hilger.",
};

// Fallback images for hero section
const communicationImages = [
  '/biographie/portrait.webp',
  '/home_page/home_page_2.jpg',
  '/home_page/home_page_3.jpg',
];

const communicationSections = [
  {
    title: "Événementiel",
    href: "/communication/evenementiel/festival-concerts",
    description: "Festival, concerts et temps forts",
    image: "/showcase/communication/evenementiel.jpg",
  },
  {
    title: "Médias",
    href: "/communication/medias/parution-presse",
    description: "Parutions et revue de presse",
    image: "/showcase/communication/media.jpg",
  },
  {
    title: "Newsletter",
    href: "/communication/newsletter",
    description: "Restez informé des actualités",
    image: "/showcase/communication/newsletter.jpg",
  },
  {
    title: "Plaquette",
    href: "/communication/plaquette",
    description: "Documentation de présentation",
    image: "/showcase/communication/plaquette.jpg",
  },
];

export default async function CommunicationPage() {
  const siteSettings = await getSiteSettings();

  const pageTitle = "Communication & médias.";
  const pageDescription = siteSettings?.tagline ?? "";

  return (
    <div className="relative min-h-screen bg-[#edeae6]">
      {/* Hero Section with Video Background - Matching Biography/Oeuvres/Actualités pattern */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <TopVideoTemplate videoSrc="/showcase/communication/communication.mp4" />
        
        {/* Fallback Image */}
        <div className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
          <Image
            src={communicationImages[0]}
            alt="Communication"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent z-10" />

        {/* Hero Content */}
        <div className="relative z-20 max-w-4xl mx-auto px-6 lg:px-8 text-center pt-32 sm:pt-40">
          <div className="mb-6 text-sm uppercase tracking-[0.3em] text-white/80 font-light">
            Communication
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white mb-4 drop-shadow-lg" style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.5), 0 4px 20px rgba(0, 0, 0, 0.3)' }}>
            {pageTitle}
          </h1>
          {/* Hand-drawn underline — same motif as the homepage hero, in green for this page */}
          <svg width="180" height="14" viewBox="0 0 180 14" className="block mx-auto mb-8" aria-hidden="true">
            <path
              d="M2 8 Q90 2 178 8"
              fill="none"
              stroke="#7d9468"
              strokeWidth={2}
              strokeLinecap="round"
              className="animate-draw-line"
            />
          </svg>
          {pageDescription && (
            <p className="text-lg sm:text-xl md:text-2xl text-white font-light max-w-2xl mx-auto leading-relaxed drop-shadow-lg" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.3)' }}>
              {pageDescription}
            </p>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex flex-col items-center gap-2">
            <div className="text-white/60 text-xs uppercase tracking-wider font-light">
              Défilez
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent" />
          </div>
        </div>
      </section>

      {/* Communication Sections — « La Portée » (design 1b, fond « Blanc galerie ») */}
      <section className="relative py-24 px-6 lg:px-8 border-t border-zinc-200 bg-[#fbfaf8] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollReveal className="mb-8 text-center">
            <div className="inline-block mb-4 text-xs uppercase tracking-[0.35em] text-zinc-500 font-light">
              Sections
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-normal italic tracking-tight text-zinc-950">
              Communication &amp; Médias
            </h2>
            {/* Hand-drawn underline — in green, matching the hero motif for this page */}
            <svg width="160" height="12" viewBox="0 0 160 12" className="block mx-auto mt-5" aria-hidden="true">
              <path
                d="M2 7 Q80 2 158 7"
                fill="none"
                stroke="#7d9468"
                strokeWidth={2}
                strokeLinecap="round"
                className="animate-draw-line"
              />
            </svg>
          </ScrollReveal>

          {/* Arched cards on a musical stagger */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-11 gap-y-10 items-start">
            {communicationSections.map((section, index) => {
              const lift = ["lg:mt-0", "lg:mt-14", "lg:mt-6", "lg:mt-0"][index % 4];
              return (
                <ScrollReveal key={section.href} delay={index * 90}>
                  <Link href={section.href} className={`group block ${lift}`}>
                    {/* Arched image */}
                    <div className="overflow-hidden rounded-t-full aspect-[3/4] shadow-[0_18px_44px_rgba(26,26,26,0.10)] transition-all duration-500 ease-out group-hover:-translate-y-2.5 group-hover:shadow-[0_30px_60px_rgba(26,26,26,0.18)]">
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.07]"
                        style={{ backgroundImage: `url(${section.image})` }}
                      />
                    </div>

                    {/* Label */}
                    <div className="pt-6 px-2 text-center">
                      <div className="flex items-center justify-center gap-3.5 mb-2">
                        <span className="w-[22px] h-px bg-[#7d9468]" />
                        <span className="text-2xl font-medium text-zinc-900">
                          {section.title}
                        </span>
                        <span className="w-[22px] h-px bg-[#7d9468]" />
                      </div>
                      <div className="text-[15px] italic text-zinc-500 leading-relaxed">
                        {section.description}
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}