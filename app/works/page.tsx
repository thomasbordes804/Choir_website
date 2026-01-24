import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { EmptyState } from "@/components/ui/empty-state";
import { WorksFilter } from "@/components/works/works-filter";
import { TopVideoTemplate } from "@/components/ui/top-video-template";
import { RotatingSectionImage } from "@/components/works/rotating-section-image";
import { getSectionImagePaths } from "@/lib/utils/section-image-mapper";
import {
  getWorksPage,
  getWorksSections,
  getSiteSettings,
} from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Oeuvres",
  description: "Découvrez les œuvres de Michel Hilger : peintures, compositions, poésie et créations artistiques.",
};

// Fallback images for hero section
const worksImages = [
  '/biographie/portrait.webp',
  '/home_page/home_page_2.jpg',
  '/home_page/home_page_3.jpg',
];

export default async function WorksPage() {
  const [worksPage, worksSections, siteSettings] = await Promise.all([
    getWorksPage(),
    getWorksSections(),
    getSiteSettings(),
  ]);

  const pageTitle = worksPage?.title ?? "Créations artistiques.";
  const pageDescription = siteSettings?.tagline ?? "";

  // Sort sections by order and filter out "peinture sur toiles" and "peinture sur clavecin"
  const sortedSections = worksSections
    ? [...worksSections]
        .filter((section) => {
          const slug = section.slug?.toLowerCase() || '';
          const title = section.title?.toLowerCase() || '';
          return !slug.includes('toile') && 
                 !title.includes('peinture sur toiles') &&
                 !slug.includes('clavecin') &&
                 !title.includes('peinture sur clavecin');
        })
        .sort((a, b) => {
          const orderA = a.order ?? 999;
          const orderB = b.order ?? 999;
          return orderA - orderB;
        })
    : [];

  return (
    <div className="relative min-h-screen bg-[#edeae6]">
      {/* Hero Section with Video Background - Matching Biography pattern */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <TopVideoTemplate videoSrc="/oeuvres/piano_background.mp4" />
        
        {/* Fallback Image */}
        <div className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
          <Image
            src={worksImages[0]}
            alt="Oeuvres"
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
            Oeuvres
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

      {/* Works Sections - Matching Communication page layout */}
      {sortedSections && sortedSections.length > 0 && (
        <section className="relative py-20 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <div className="mb-16 text-center">
              <div className="inline-block mb-4 text-xs uppercase tracking-[0.3em] text-zinc-500 font-light">
                Sections
              </div>
            </div>

            {/* Works Grid - 2 columns like Communication */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedSections.map((section) => {
                if (!section.slug) return null;

                const imagePaths = getSectionImagePaths(section.slug, section.title);
                const hasImages = imagePaths.length > 0;
                const firstImage = imagePaths[0] || '/biographie/portrait.webp';

                return (
                  <Link
                    key={section._id}
                    href={`/works/${section.slug}`}
                    className="group relative block"
                  >
                    <div className="relative overflow-hidden bg-white border border-zinc-200 hover:border-zinc-900 transition-all duration-500 h-full">
                      {/* Image */}
                      {hasImages ? (
                        <div className="relative aspect-video w-full overflow-hidden bg-zinc-100">
                          <RotatingSectionImage
                            imagePaths={imagePaths}
                            alt={section.title || "Section d'œuvre"}
                            interval={6000}
                          />
                        </div>
                      ) : (
                        <div className="relative aspect-video w-full overflow-hidden bg-zinc-100">
                          <Image
                            src={firstImage}
                            alt={section.title || "Section d'œuvre"}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            style={{
                              filter: 'brightness(0.7)',
                            }}
                          />
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="p-8">
                        <h3 className="text-2xl md:text-3xl font-light tracking-tight text-zinc-900 mb-4 group-hover:text-zinc-700 transition-colors duration-300">
                          {section.title || "Section sans titre"}
                        </h3>
                        {section.description && (
                          <p className="text-base text-zinc-600 mb-4">
                            {section.description}
                          </p>
                        )}
                        <div className="text-sm text-zinc-400 group-hover:text-zinc-600 transition-colors duration-300">
                          En savoir plus →
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {(!worksSections || worksSections.length === 0) && (
        <section className="relative py-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <EmptyState
              title="Aucune section d'œuvres"
              description="Ajoutez des sections d'œuvres dans le Sanity Studio pour les afficher ici."
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