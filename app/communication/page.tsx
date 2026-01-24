import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { EmptyState } from "@/components/ui/empty-state";
import { TopVideoTemplate } from "@/components/ui/top-video-template";
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

      {/* Communication Sections */}
      <section className="relative py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <div className="inline-block mb-4 text-xs uppercase tracking-[0.3em] text-zinc-500 font-light">
              Sections
            </div>
          </div>

          {/* Communication Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Evenementiel */}
            <Link
              href="/communication/evenementiel/festival-concerts"
              className="group relative block"
            >

            <div className="relative overflow-hidden bg-white border border-zinc-200 hover:border-zinc-900 transition-all duration-500 h-full">
                {/* Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-100">
                  <Image
                    src="/showcase/communication/evenementiel.jpg"
                    alt="Evenementiel"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{
                      filter: 'brightness(0.7)',
                    }}
                  />
                </div>
                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl md:text-3xl font-light tracking-tight text-zinc-900 mb-4 group-hover:text-zinc-700 transition-colors duration-300">
                    Evenementiel
                  </h3>
                  <p className="text-base text-zinc-600 mb-4">
                    Festival concerts
                  </p>
                  <div className="text-sm text-zinc-400 group-hover:text-zinc-600 transition-colors duration-300">
                    En savoir plus →
                  </div>
                </div>
              </div>
            </Link>

            {/* Medias */}
            <Link
              href="/communication/medias/parution-presse"
              className="group relative block"
            >
              <div className="relative overflow-hidden bg-white border border-zinc-200 hover:border-zinc-900 transition-all duration-500 h-full">
                {/* Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-100">
                  <Image
                    src="/showcase/communication/media.jpg"
                    alt="Medias"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{
                      filter: 'brightness(0.7)',
                    }}
                  />
                </div>
                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl md:text-3xl font-light tracking-tight text-zinc-900 mb-4 group-hover:text-zinc-700 transition-colors duration-300">
                    Medias
                  </h3>
                  <p className="text-base text-zinc-600 mb-4">
                    Parution presse
                  </p>
                  <div className="text-sm text-zinc-400 group-hover:text-zinc-600 transition-colors duration-300">
                    En savoir plus →
                  </div>
                </div>
              </div>
            </Link>

            {/* Newsletter */}
            <Link
              href="/communication/newsletter"
              className="group relative block"
            >
              <div className="relative overflow-hidden bg-white border border-zinc-200 hover:border-zinc-900 transition-all duration-500 h-full">
                {/* Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-100">
                  <Image
                    src="/showcase/communication/newsletter.jpg"
                    alt="Newsletter"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{
                      filter: 'brightness(0.7)',
                    }}
                  />
                </div>
                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl md:text-3xl font-light tracking-tight text-zinc-900 mb-4 group-hover:text-zinc-700 transition-colors duration-300">
                    Newsletter
                  </h3>
                  <p className="text-base text-zinc-600 mb-4">
                    Restez informé
                  </p>
                  <div className="text-sm text-zinc-400 group-hover:text-zinc-600 transition-colors duration-300">
                    En savoir plus →
                  </div>
                </div>
              </div>
            </Link>

            {/* Plaquette */}
            <Link
              href="/communication/plaquette"
              className="group relative block"
            >
              <div className="relative overflow-hidden bg-white border border-zinc-200 hover:border-zinc-900 transition-all duration-500 h-full">
                {/* Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-100">
                  <Image
                    src="/showcase/communication/plaquette.jpg"
                    alt="Plaquette"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{
                      filter: 'brightness(0.7)',
                    }}
                  />
                </div>
                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl md:text-3xl font-light tracking-tight text-zinc-900 mb-4 group-hover:text-zinc-700 transition-colors duration-300">
                    Plaquette
                  </h3>
                  <p className="text-base text-zinc-600 mb-4">
                    Documentation
                  </p>
                  <div className="text-sm text-zinc-400 group-hover:text-zinc-600 transition-colors duration-300">
                    En savoir plus →
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}