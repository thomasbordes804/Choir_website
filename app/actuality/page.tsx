import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { EmptyState } from "@/components/ui/empty-state";
import { RichText } from "@/components/ui/rich-text";
import { TopVideoTemplate } from "@/components/ui/top-video-template";
import { getAnnouncements, getSiteSettings } from "@/lib/sanity/queries";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
});

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

  if (announcements.length === 0) {
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

        {/* Empty State */}
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
      </div>
    );
  }

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

      {/* Announcements Section */}
      <section className="relative py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <div className="inline-block mb-4 text-xs uppercase tracking-[0.3em] text-zinc-500 font-light">
              Dernières nouvelles
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-zinc-900">
              Actualités récentes
            </h2>
          </div>

          {/* Announcements List */}
          <div className="space-y-12">
          {announcements.map((announcement) => (
              <article
                key={announcement._id}
                className="group relative border border-zinc-200 hover:border-zinc-900 transition-all duration-500 p-8 rounded-sm overflow-hidden"
                style={{
                  backgroundImage: 'url(/showcase/actualité/actualités_v2.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  minHeight: '200px',
                }}
              >
                {/* Dark overlay to reduce image brightness/luminosity */}
                <div 
                  className="absolute inset-0" 
                  style={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    zIndex: 1,
                  }}
                />
                
                {/* Light beige overlay for text readability */}
                <div 
                  className="absolute inset-0" 
                  style={{ 
                    backgroundColor: 'rgba(220, 200, 180, 0.2)',
                    zIndex: 2,
                  }}
                />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Date and Highlight Badge */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-300">
                    <time 
                      dateTime={announcement.publishedAt ?? undefined}
                      className="text-sm uppercase tracking-wider text-zinc-900 font-bold"
                    >
                      {announcement.publishedAt
                        ? dateFormatter.format(new Date(announcement.publishedAt))
                        : "Récemment"}
                    </time>
                    {announcement.highlight && (
                      <span className="text-xs uppercase tracking-wider text-zinc-900 font-bold border-2 border-zinc-900 px-3 py-1 bg-white/50">
                        À la une
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 mb-4 group-hover:text-zinc-800 transition-colors duration-300">
                    {announcement.title ?? "Mise à jour"}
                  </h3>

                  {/* Content */}
                  <div className="prose prose-lg max-w-none">
                    <div className="text-base leading-relaxed text-zinc-900 font-medium">
                      <RichText value={announcement.body} />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}