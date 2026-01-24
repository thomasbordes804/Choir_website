import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  getEvents,
  getHighlightedAnnouncements,
  getSiteSettings,
  getSummaryCounts,
} from "@/lib/sanity/queries";
import { VideoBackground } from "@/components/ui/video-background";
import { CloudTransition } from "@/components/ui/cloud-transition";
import { TopVideoTemplate } from "@/components/ui/top-video-template";

export const metadata: Metadata = {
  title: "Accueil",
  description: "Bienvenue dans l'univers artistique de Michel Hilger",
};

const announcementDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
});

const eventDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short",
});

function truncate(value: string | null, limit = 140) {
  if (!value) return null;
  return value.length > limit ? `${value.slice(0, limit)}…` : value;
}

export default async function Home() {
  const [counts, siteSettings, highlights, upcomingEvents] = await Promise.all([
    getSummaryCounts(),
    getSiteSettings(),
    getHighlightedAnnouncements(3),
    getEvents(3),
  ]);

  const heroTitle = siteSettings?.homepageHeroTitle ?? "ArtsParadise";
  const heroSubtitle =
    siteSettings?.homepageHeroSubtitle ??
    "Altiste-peintre et musicien au service des communautés";
  const heroTagline = siteSettings?.tagline ?? "L'art au service de l'harmonie";

  // Sections avec leurs couleurs minimalistes - matching navigation bar
  const sections = [
    {
      title: "Actualités",
      href: "/actuality",
      description: "Découvrez les dernières nouvelles",
      count: highlights.length,
      label: highlights.length === 1 ? "actualité" : "actualités",
      image: "/showcase/actualité/actualités_2.jpg", // Add your image path here
    },
    {
      title: "Œuvres",
      href: "/works",
      description: "Peintures, sculptures et créations",
      image: "/showcase/oeuvres/oeuvres.jpg", // Add your image path here
    },
    {
      title: "Biographie",
      href: "/biography",
      description: "Explorez le parcours artistique",
      image: "/showcase/biographie/biographie.jpg", // Add your image path here
    },
    {
      title: "Communication",
      href: "/communication",
      description: "Médias et événements",
      image: "/showcase/communication/communication.jpg", // Add your image path here
    },
    {
      title: "Partenariat",
      href: "/partenariat",
      description: "Collaborations et partenaires",
      image: "/showcase/partenariat/partenariat.jpg", // Add your image path here
    },
    {
      title: "Contact",
      href: "/contact",
      description: "Prenez contact avec nous",
      image: "/showcase/contact/contact.jpg", // Add your image path here
    },
    {
      title: "Archive",
      href: "/archive",
      description: "Documents et archives",
      image: "/showcase/archive/archive.jpg", // Add your image path here
    },
  ];

  const featuredEvent = siteSettings?.featuredEvent ?? upcomingEvents[0] ?? null;

  return (
    <div className="relative overflow-hidden bg-[#edeae6]">
      {/* Cloud transition overlay */}
      <CloudTransition />
      
      {/* Hero Section with home_page animated video background - BOYD inspired minimal */}
      <section className="relative min-h-screen flex items-center justify-center px-6 lg:px-8 overflow-hidden">
        <TopVideoTemplate videoSrc="/home_page/clouds.mp4" />
        
        {/* Enhanced overlay for text readability */}
        <div className="absolute inset-0 bg-black/30 z-10" />
        
        {/* Additional gradient overlay at top for text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-transparent z-11" />
        
        <div className="relative z-20 max-w-7xl w-full pt-32 sm:pt-40">
          {/* Main Hero Content */}
          <div className="text-center mb-20">
            {/* Tagline - more visible */}
            <div className="mb-12 text-2xl sm:text-3xl md:text-4xl tracking-[0.2em] uppercase text-white font-light leading-relaxed drop-shadow-lg" style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.5), 0 4px 20px rgba(0, 0, 0, 0.3)' }}>
              {heroTagline}
            </div>
            
            {/* Subtitle - more visible */}
            <p className="text-lg sm:text-xl md:text-2xl text-white font-light max-w-2xl mx-auto leading-relaxed drop-shadow-lg" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.3)' }}>
              {heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Catalogue Section - BOYD style */}
      <section className="relative py-20 px-6 lg:px-8 border-t border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <div className="inline-block mb-4 text-xs uppercase tracking-[0.3em] text-zinc-700 font-light">
              Catalogue
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-zinc-950">
              Explorez l'Univers
            </h2>
          </div>

          {/* Sections Grid - minimal cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {sections.map((section, index) => (
              <Link
                key={section.href}
                href={section.href}
                className="group relative overflow-hidden border border-zinc-200 bg-white hover:border-zinc-900 transition-all duration-500"
              >
                {/* Use section-specific images as backgrounds */}
                <div 
                  className="aspect-[4/3] bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${section.image || `/home_page/home_page_${Math.min(index + 2, 6)}.jpg`})`,
                    filter: 'brightness(1)', // Increase brightness
                  }}
                />
                
                {/* Content overlay with stronger gradient for better text visibility */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 bg-gradient-to-t from-black/60 via-black/40 to-black/10">
                  <div className="transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-500">
                    <h3 className="text-2xl font-bold mb-2 text-white drop-shadow-2xl">
                      {section.title}
                    </h3>
                    <p className="text-sm text-white font-bold mb-4 drop-shadow-xl">
                      {section.description}
                    </p>
                    {section.count !== undefined && (
                      <div className="text-xs uppercase tracking-wider text-white font-bold drop-shadow-lg">
                        {section.count} {section.label}
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover line effect */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-500" />
              </Link>
            ))}
          </div>

          {/* View all link */}
          <div className="text-center">
            <Link
              href="/works"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-zinc-700 hover:text-zinc-900 transition-colors duration-300 font-light group"
            >
              Voir tout
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic Video Section - BOYD style transition */}
      <section className="relative w-full min-h-[100vh] flex items-center justify-center">
        <VideoBackground 
          videoSrc="/home_page/fond ecran.mp4"
          className="min-h-[100vh]"
        />
        
        {/* Optional content overlay - minimal text */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-block mb-4 text-xs uppercase tracking-[0.3em] text-white/80 font-light">
            L'Art en Mouvement
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-white mb-8">
            Création Vivante
          </h2>
        </div>
      </section>

      {/* Latest Announcements - minimal style */}
      {highlights.length > 0 && (
        <section className="relative py-20 px-6 lg:px-8 border-t border-zinc-200 bg-[#edeae6]">
          <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
                   <div className="inline-block mb-4 text-xs uppercase tracking-[0.3em] text-zinc-700 font-light">
                     Actualités
                   </div>
                   <h2 className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-zinc-950">
                     Dernières Nouvelles
                   </h2>
                 </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {highlights.map((announcement) => (
                <article
                  key={announcement._id}
                  className="group bg-white border border-zinc-200 hover:border-zinc-900 transition-all duration-500"
                >
                  <div className="p-6 sm:p-8">
                    <div className="mb-4 text-xs uppercase tracking-wider text-zinc-500 font-light">
                      <time dateTime={announcement.publishedAt ?? undefined}>
                        {announcement.publishedAt
                          ? announcementDateFormatter.format(new Date(announcement.publishedAt))
                          : "Récemment"}
                      </time>
                    </div>
                    
                    <h3 className="text-xl font-light mb-3 text-zinc-900 group-hover:text-zinc-700 transition-colors duration-300">
                      {announcement.title ?? "Actualité"}
                    </h3>
                    
                    {truncate(announcement.excerpt) && (
                      <p className="text-sm text-zinc-600 font-light mb-6 leading-relaxed">
                        {truncate(announcement.excerpt)}
                      </p>
                    )}
                    
                    <Link
                      href="/actuality"
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-zinc-700 hover:text-zinc-900 transition-colors duration-300 font-light group/link"
                    >
                      Lire
                      <span className="transform group-hover/link:translate-x-1 transition-transform duration-300">→</span>
                    </Link>
                  </div>
                  
                  {/* Hover line effect */}
                  <div className="h-0.5 w-0 bg-zinc-900 group-hover:w-full transition-all duration-500" />
                </article>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/actuality"
                className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-zinc-700 hover:text-zinc-900 transition-colors duration-300 font-light group"
              >
                Voir toutes les actualités
                <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Event - minimal style */}
      {featuredEvent && (
        <section className="relative py-20 px-6 lg:px-8 border-t border-zinc-200 bg-[#edeae6]">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4 text-xs uppercase tracking-[0.3em] text-zinc-500 font-light">
              Événement
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-light mb-8 tracking-tight text-zinc-900">
              {featuredEvent.title ?? "Événement à venir"}
            </h2>
            
            {featuredEvent.date && (
              <time
                dateTime={featuredEvent.date}
                className="block mb-4 text-lg text-zinc-600 font-light"
              >
                {eventDateFormatter.format(new Date(featuredEvent.date))}
              </time>
            )}
            
            {featuredEvent.location && (
              <p className="mb-8 text-lg text-zinc-600 font-light">
                {featuredEvent.location}
              </p>
            )}
            
            {featuredEvent.description && (
              <p className="mb-12 text-base leading-relaxed text-zinc-700 font-light max-w-2xl mx-auto">
                {featuredEvent.description}
              </p>
            )}
            
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-zinc-700 hover:text-zinc-900 transition-colors duration-300 font-light group border border-zinc-900 px-8 py-4 hover:bg-zinc-900 hover:text-white transition-all duration-300"
            >
              Voir tous les événements
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>
        </section>
      )}

      {/* About Section - minimal footer style */}
      <section className="relative py-20 px-6 lg:px-8 border-t border-zinc-200 bg-[#edeae6]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 text-xs uppercase tracking-[0.3em] text-zinc-500 font-light">
            À propos
          </div>
          <p className="text-lg text-zinc-700 font-light leading-relaxed max-w-2xl mx-auto">
            {heroTagline}
          </p>
        </div>
      </section>
    </div>
  );
}