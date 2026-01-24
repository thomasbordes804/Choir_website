import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { EmptyState } from "@/components/ui/empty-state";
import { TopVideoTemplate } from "@/components/ui/top-video-template";
import { getSiteSettings } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Archive",
  description: "Archives et documents historiques de Michel Hilger.",
};

// Fallback images for hero section
const archiveImages = [
  '/biographie/portrait.webp',
  '/home_page/home_page_2.jpg',
  '/home_page/home_page_3.jpg',
];

export default async function ArchivePage() {
  const siteSettings = await getSiteSettings();

  const pageTitle = "Archive & documents.";
  const pageDescription = siteSettings?.tagline ?? "";

  return (
    <div className="relative min-h-screen bg-[#edeae6]">
      {/* Hero Section with Video Background - Matching Biography/Oeuvres/Actualités/Communication/Partenariat/Contact pattern */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <TopVideoTemplate videoSrc="/showcase/archive/archive.mp4" />
        
        {/* Dark overlay to reduce video brightness/luminosity */}
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none" 
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 1,
          }}
        />
        
        {/* Fallback Image */}
        <div className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
          <Image
            src={archiveImages[0]}
            alt="Archive"
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
          <div className="mb-6 text-sm uppercase tracking-[0.3em] text-white font-semibold">
            Archive
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-white mb-8 drop-shadow-lg" style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.5), 0 4px 20px rgba(0, 0, 0, 0.3)' }}>
            {pageTitle}
          </h1>
          {pageDescription && (
            <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold max-w-2xl mx-auto leading-relaxed drop-shadow-lg" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.3)' }}>
              {pageDescription}
            </p>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex flex-col items-center gap-2">
            <div className="text-white font-semibold text-xs uppercase tracking-wider">
              Défilez
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent" />
          </div>
        </div>
      </section>

      {/* Archive Content Section */}
      <section className="relative py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <div className="inline-block mb-4 text-xs uppercase tracking-[0.3em] text-zinc-700 font-semibold">
              Documents
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-zinc-900">
              Archives
            </h2>
          </div>

          {/* Content placeholder - can be replaced with actual archive content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed text-zinc-900 font-semibold text-center">
              Contenu des archives à venir...
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}