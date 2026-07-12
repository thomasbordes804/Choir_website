import type { Metadata } from "next";
import Image from "next/image";

import { EmptyState } from "@/components/ui/empty-state";
import { TopVideoTemplate } from "@/components/ui/top-video-template";
import { WorksGallery, type GalleryCategory, type PoemVM } from "@/components/works/works-gallery";
import { getFullSectionImagePaths } from "@/lib/utils/section-image-mapper";
import {
  getWorksPage,
  getWorksSections,
  getSiteSettings,
  getPoems,
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
  const [worksPage, worksSections, siteSettings, poems] = await Promise.all([
    getWorksPage(),
    getWorksSections(),
    getSiteSettings(),
    getPoems(),
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

  // Build the full-image gallery categories (every piece per subsection,
  // not just the 4-image preview used elsewhere on the site).
  const galleryCategories: GalleryCategory[] = sortedSections
    .map((section) => {
      if (!section.slug) return null;
      const images = getFullSectionImagePaths(section.slug, section.title ?? null);
      if (images.length === 0) return null;
      return {
        slug: section.slug,
        title: section.title || "Section sans titre",
        images,
      };
    })
    .filter((c): c is GalleryCategory => c !== null);

  // Poems -> view model for the reading panel (split the flattened portable
  // text body back into verse lines).
  const galleryPoems: PoemVM[] = (poems || [])
    .filter((p) => p.bodyText)
    .map((p) => ({
      id: p._id,
      title: p.title || "Sans titre",
      dedication: p.dedication,
      lines: (p.bodyText || "")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
      audioUrl: p.audioUrl,
    }));

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
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white mb-4 drop-shadow-lg" style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.5), 0 4px 20px rgba(0, 0, 0, 0.3)' }}>
            {pageTitle}
          </h1>
          {/* Hand-drawn underline — same motif as the homepage hero, in gold for this page */}
          <svg width="180" height="14" viewBox="0 0 180 14" className="block mx-auto mb-8" aria-hidden="true">
            <path
              d="M2 8 Q90 2 178 8"
              fill="none"
              stroke="#b39244"
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

      {/* Museum gallery: art wall + music palette + poetry reading */}
      {galleryCategories.length > 0 && <WorksGallery categories={galleryCategories} poems={galleryPoems} />}

      {/* Empty State */}
      {galleryCategories.length === 0 && (
        <section className="relative py-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <EmptyState
              title="Aucune section d'œuvres"
              description="Ajoutez des sections d'œuvres dans le Sanity Studio pour les afficher ici."
              action={
                <a
                  href="/studio"
                  className="inline-flex items-center rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-[color:var(--accent-foreground)]"
                >
                  Ouvrir le Studio
                </a>
              }
            />
          </div>
        </section>
      )}
    </div>
  );
}
