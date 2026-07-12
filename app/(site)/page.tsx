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
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { HeroTitle } from "@/components/ui/hero-title";

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

  const heroName = siteSettings?.homepageHeroTitle ?? "Michel Hilger";
  const heroTagline = siteSettings?.tagline ?? "L'art au service de l'harmonie";
  const heroSubtitle =
    siteSettings?.homepageHeroSubtitle ??
    "Altiste-peintre et musicien au service des communautés";

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
  ];

  const featuredEvent = siteSettings?.featuredEvent ?? upcomingEvents[0] ?? null;

  return (
    <div className="relative overflow-hidden bg-[#edeae6]">
      {/* Cloud transition overlay */}
      <CloudTransition />
      
      {/* Hero Section with home_page animated video background - BOYD inspired minimal */}
      <section className="relative min-h-screen flex items-center justify-center px-6 lg:px-8 overflow-hidden">
        <TopVideoTemplate videoSrc="/home_page/clouds.mp4" kenburns />
        
        {/* Enhanced overlay for text readability */}
        <div className="absolute inset-0 bg-black/30 z-10" />
        
        {/* Additional gradient overlay at top for text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-transparent z-11" />
        
        <div className="relative z-20 max-w-7xl w-full pt-32 sm:pt-40">
          {/* Main Hero Content */}
          <div className="text-center mb-20">
            {/* Artist name - staggered letter reveal on load */}
            <div className="flex justify-center">
              <HeroTitle text={heroName} />
            </div>

            {/* Hand-drawn underline beneath the tagline */}
            <svg
              width="180"
              height="14"
              viewBox="0 0 180 14"
              className="block mx-auto mb-6 opacity-90"
              aria-hidden="true"
            >
              <path
                d="M2 8 Q90 2 178 8"
                fill="none"
                stroke="#ff8a8a"
                strokeWidth={2}
                strokeLinecap="round"
                className="animate-draw-line"
              />
            </svg>

            {/* Tagline - more visible */}
            <div
              className="hero-fade-in mb-12 text-2xl sm:text-3xl md:text-4xl tracking-[0.2em] uppercase text-white font-light leading-relaxed drop-shadow-lg"
              style={{ animationDelay: "0.9s", textShadow: '0 2px 10px rgba(0, 0, 0, 0.5), 0 4px 20px rgba(0, 0, 0, 0.3)' }}
            >
              {heroTagline}
            </div>
            
            {/* Subtitle - more visible */}
            <p
              className="hero-fade-in text-lg sm:text-xl md:text-2xl text-white font-light max-w-2xl mx-auto leading-relaxed drop-shadow-lg"
              style={{ animationDelay: "1.05s", textShadow: '0 2px 8px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.3)' }}
            >
              {heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Catalogue Section — « La Portée » (design 1b, fond « Blanc galerie ») */}
      <section className="relative py-24 px-6 lg:px-8 border-t border-zinc-200 bg-[#fbfaf8] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollReveal className="mb-8 text-center">
            <div className="inline-block mb-4 text-xs uppercase tracking-[0.35em] text-zinc-500 font-light">
              Catalogue
            </div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-normal italic tracking-tight text-zinc-950">
              Explorez l'Univers
            </h2>
            {/* Hand-drawn coral underline — smaller than the hero's since this
                is a section subtitle, not the primary title */}
            <svg
              width="160"
              height="12"
              viewBox="0 0 160 12"
              className="block mx-auto mt-5"
              aria-hidden="true"
            >
              <path
                d="M2 7 Q80 2 158 7"
                fill="none"
                stroke="#ff8a8a"
                strokeWidth={2}
                strokeLinecap="round"
                className="animate-draw-line"
              />
            </svg>
          </ScrollReveal>

          {/* Arched cards on a musical stagger */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-11 gap-y-10 items-start">
            {sections.map((section, index) => {
              // Rhythm of the staff line: 0 / down / slightly down, repeated
              const lift = ["lg:mt-0", "lg:mt-14", "lg:mt-6"][index % 3];
              return (
                <ScrollReveal key={section.href} delay={index * 90}>
                  <Link href={section.href} className={`group block ${lift}`}>
                    {/* Arched image */}
                    <div className="overflow-hidden rounded-t-full aspect-[3/4] shadow-[0_18px_44px_rgba(26,26,26,0.10)] transition-all duration-500 ease-out group-hover:-translate-y-2.5 group-hover:shadow-[0_30px_60px_rgba(26,26,26,0.18)]">
                      <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.07]"
                        style={{
                          backgroundImage: `url(${section.image || `/home_page/home_page_${Math.min(index + 2, 6)}.jpg`})`,
                        }}
                      />
                    </div>

                    {/* Label */}
                    <div className="pt-6 px-2 text-center">
                      <div className="flex items-center justify-center gap-3.5 mb-2">
                        <span className="w-[22px] h-px bg-[#ff8a8a]" />
                        <span className="text-2xl font-medium text-zinc-900">
                          {section.title}
                        </span>
                        <span className="w-[22px] h-px bg-[#ff8a8a]" />
                      </div>
                      <div className="text-[15px] italic text-zinc-500 leading-relaxed">
                        {section.description}
                      </div>
                      {section.count !== undefined && (
                        <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-zinc-400 font-sans">
                          {section.count} {section.label}
                        </div>
                      )}
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>

          {/* View all — pill button */}
          <div className="text-center mt-20">
            <Link
              href="/works"
              className="inline-block text-sm uppercase tracking-[0.25em] text-zinc-700 font-sans font-light border border-zinc-900 rounded-full px-9 py-3.5 transition-colors duration-400 hover:bg-zinc-900 hover:text-[#faf9f6]"
            >
              Voir tout →
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
        <ScrollReveal variant="scale" className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-block mb-4 text-xs uppercase tracking-[0.3em] text-white/80 font-light">
            L'Art en Mouvement
          </div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-white mb-8">
            Création Vivante
          </h2>
          {/* Hand-drawn underline — same motif as the hero, in ocre for this section */}
          <svg width="160" height="12" viewBox="0 0 160 12" className="block mx-auto -mt-4 mb-4" aria-hidden="true">
            <path
              d="M2 7 Q80 2 158 7"
              fill="none"
              stroke="#e8c99b"
              strokeWidth={2}
              strokeLinecap="round"
              className="animate-draw-line"
            />
          </svg>
        </ScrollReveal>
      </section>

      {/* Latest Announcements - minimal style */}
      {highlights.length > 0 && (
        <section className="relative py-20 px-6 lg:px-8 border-t border-zinc-200 bg-[#edeae6]">
          <div className="max-w-7xl mx-auto">
          <ScrollReveal className="mb-16 text-center">
                   <div className="inline-block mb-4 text-xs uppercase tracking-[0.3em] text-zinc-700 font-light">
                     Actualités
                   </div>
                   <h2 className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-zinc-950">
                     Dernières Nouvelles
                   </h2>
                   {/* Hand-drawn underline — same motif as the hero, in indigo for this section */}
                   <svg width="160" height="12" viewBox="0 0 160 12" className="block mx-auto mt-5" aria-hidden="true">
                     <path
                       d="M2 7 Q80 2 158 7"
                       fill="none"
                       stroke="#636098"
                       strokeWidth={2}
                       strokeLinecap="round"
                       className="animate-draw-line"
                     />
                   </svg>
          </ScrollReveal>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {highlights.map((announcement, index) => (
                <ScrollReveal key={announcement._id} delay={index * 80}>
                <article
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
                </ScrollReveal>
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
          <ScrollReveal className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4 text-xs uppercase tracking-[0.3em] text-zinc-500 font-light">
              Événement
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-zinc-900">
              {featuredEvent.title ?? "Événement à venir"}
            </h2>
            {/* Hand-drawn underline — same motif as the hero, in bordeaux for this section */}
            <svg width="160" height="12" viewBox="0 0 160 12" className="block mx-auto mt-5 mb-8" aria-hidden="true">
              <path
                d="M2 7 Q80 2 158 7"
                fill="none"
                stroke="#8d1e11"
                strokeWidth={2}
                strokeLinecap="round"
                className="animate-draw-line"
              />
            </svg>

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
          </ScrollReveal>
        </section>
      )}

      {/* About Section - minimal footer style */}
      <section className="relative py-20 px-6 lg:px-8 border-t border-zinc-200 bg-[#edeae6]">
        <ScrollReveal className="max-w-4xl mx-auto text-center">
          <div className="mb-8 text-xs uppercase tracking-[0.3em] text-zinc-500 font-light">
            À propos
          </div>
          <p className="text-lg text-zinc-700 font-light leading-relaxed max-w-2xl mx-auto">
            {heroTagline}
          </p>
        </ScrollReveal>
      </section>
    </div>
  );
}
