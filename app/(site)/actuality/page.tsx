import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { EmptyState } from "@/components/ui/empty-state";
import { TopVideoTemplate } from "@/components/ui/top-video-template";
import { Gazette } from "@/components/actuality/gazette";
import { getAnnouncements, getSiteSettings } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Actualités",
  description: "Dernières actualités, points forts et annonces de Michel Hilger.",
};

// Fallback images for hero section
const actualityImages = [
  '/biographie/portrait.webp',
  '/home_page/home_page_2.jpg',
  '/home_page/home_page_3.jpg',
];

export default async function ActualityPage() {
  const [announcements, siteSettings] = await Promise.all([
    getAnnouncements(),
    getSiteSettings(),
  ]);

  const pageTitle = "Actualités & nouvelles.";
  const pageDescription = siteSettings?.tagline ?? "";

  return (
    <div className="relative min-h-screen bg-[#edeae6]">
      {/* Hero Section with Video Background - Matching Biography/Oeuvres pattern */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <TopVideoTemplate videoSrc="/showcase/actualité/actualités.mp4" />

        {/* Fallback Image */}
        <div className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
          <Image
            src={actualityImages[0]}
            alt="Actualités"
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
            Actualités
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white mb-4 drop-shadow-lg" style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.5), 0 4px 20px rgba(0, 0, 0, 0.3)' }}>
            {pageTitle}
          </h1>
          {/* Hand-drawn underline — same motif as the homepage hero, in indigo for this page */}
          <svg width="180" height="14" viewBox="0 0 180 14" className="block mx-auto mb-8" aria-hidden="true">
            <path
              d="M2 8 Q90 2 178 8"
              fill="none"
              stroke="#636098"
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

      {/* The gazette front page (client component: search + expand) */}
      {announcements.length > 0 ? (
        <Gazette announcements={announcements} />
      ) : (
        <section className="relative py-20 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <EmptyState
              title="Rien à partager pour le moment"
              description="Publiez votre première annonce dans le Sanity Studio pour informer la communauté de ce qui se passe."
              action={(
                <Link
                  href="/studio"
                  className="inline-flex items-center rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-[color:var(--accent-foreground)]"
                >
                  Ouvrir le Studio
                </Link>
              )}
            />
          </div>
        </section>
      )}
    </div>
  );
}