import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { EmptyState } from "@/components/ui/empty-state";
import { RichText } from "@/components/ui/rich-text";
import { TopVideoTemplate } from "@/components/ui/top-video-template";


import {
  getBiographyPage,
  getBiographySections,
  getSiteSettings,
} from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Biographie",
  description: "Informations biographiques sur Michel Hilger, altiste-peintre et musicien au service des communautés.",
};

const introductionParagraphs: string[] = [
  "Vous trouverez principalement dans cette section des informations biographiques et bien plus encore sur l'altiste-peintre Michel Hilger.",
  "Du Festival Grand Pari's en Chœurs dans l'harmonie à ses apparitions « Michel Hilger à l'orgue », cette biographie éclaire un musicien qui conjugue alto, orgue et peinture au service des communautés.",
];

// Images for dynamic sections
const biographyImages = [
  '/biographie/portrait.webp',
  '/home_page/home_page_2.jpg',
  '/home_page/home_page_3.jpg',
  '/home_page/home_page_4.jpg',
];

export default async function BiographyPage() {
  const [biography, biographySections, siteSettings] = await Promise.all([
    getBiographyPage(),
    getBiographySections(),
    getSiteSettings(),
  ]);

  const hasRichContent = Boolean(biography?.content && biography.content.length > 0);
  const pageTitle = biography?.title ?? "Explorez son parcours.";
  const pageDescription =
    siteSettings?.tagline ??
    "...";

  // Sort sections by order
  const sortedSections = biographySections
    ? [...biographySections].sort((a, b) => {
        const orderA = a.order ?? 999;
        const orderB = b.order ?? 999;
        return orderA - orderB;
      })
    : [];

    return (
      <div className="relative min-h-screen bg-[#edeae6]">
        {/* Hero Section with Video Background - Ikebana Studio Ma style */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <TopVideoTemplate videoSrc="/showcase/biographie/biographie.mp4" />
        
        
        {/* Fallback Image - shown if video doesn't load */}
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
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent z-10" />

          {/* Hero Content */}
          <div className="relative z-20 max-w-4xl mx-auto px-6 lg:px-8 text-center pt-32 sm:pt-40">
            <div className="mb-6 text-sm uppercase tracking-[0.3em] text-white/80 font-light">
              Biographie
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white mb-8 drop-shadow-lg" style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.5), 0 4px 20px rgba(0, 0, 0, 0.3)' }}>
              {pageTitle}
            </h1>
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

      {/* Biography Sections - Dynamic Grid with Images */}
      {sortedSections && sortedSections.length > 0 && (
        <section className="relative py-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="mb-16 text-center">
              <div className="inline-block mb-4 text-xs uppercase tracking-[0.3em] text-zinc-500 font-light">
                Parcours
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-zinc-900">
                Découvrez l'Histoire
              </h2>
            </div>

            {/* Dynamic Grid */}
            <div className="space-y-32">
              {sortedSections.map((section, index) => {
                if (!section.slug) return null;
                
                const imageIndex = (index % 2) + 2; // Use images 2 and 3
                const isImageLeft = index % 2 === 0;

                return (
                  <div
                    key={section._id}
                    className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                      isImageLeft ? '' : 'lg:grid-flow-dense'
                    }`}
                  >
                    {/* Image */}
                    <div 
                      className={`relative ${isImageLeft ? '' : 'lg:col-start-2'}`}
                    >
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <Image
                          src={biographyImages[imageIndex]}
                          alt={section.title || 'Section'}
                          fill
                          className="object-cover transition-transform duration-700 hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        {/* Subtle overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`${isImageLeft ? '' : 'lg:col-start-1 lg:row-start-1'}`}>
                      <div className="space-y-6">
                        {/* Section Number */}
                        <div className="text-sm uppercase tracking-[0.3em] text-zinc-400 font-light">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-zinc-900">
                          {section.title || "Section sans titre"}
                        </h3>
                        
                        {/* Description */}
                        {section.description && (
                          <p className="text-lg leading-relaxed text-zinc-700 font-light">
                            {section.description}
                          </p>
                        )}
                        
                        {/* Link */}
                        <Link
                          href={`/biography/${section.slug}`}
                          className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-zinc-900 hover:text-zinc-700 transition-colors duration-300 font-light group"
                        >
                          En savoir plus
                          <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Final Image Section */}
      <section className="relative py-20 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={biographyImages[3]}
              alt="Michel Hilger - Artiste"
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
            {/* Overlay with text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end">
              <div className="p-8 lg:p-12 text-white">
                <p className="text-xl sm:text-2xl font-light leading-relaxed max-w-2xl">
                  {pageDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
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