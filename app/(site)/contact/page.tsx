import type { Metadata } from "next";
import Image from "next/image";

import { TopVideoTemplate } from "@/components/ui/top-video-template";
import { LetterForm } from "@/components/contact/letter-form";
import { getSiteSettings } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez Michel Hilger pour toute question ou collaboration.",
};

// Fallback images for hero section
const contactImages = [
  '/biographie/portrait.webp',
  '/home_page/home_page_2.jpg',
  '/home_page/home_page_3.jpg',
];

export default async function ContactPage() {
  const siteSettings = await getSiteSettings();

  const pageTitle = "Contact & informations.";
  const pageDescription = siteSettings?.tagline ?? "";

  return (
    <div className="relative min-h-screen bg-[#edeae6]">
      {/* Hero Section with Video Background - Matching Biography/Oeuvres/Actualités/Communication/Partenariat pattern */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <TopVideoTemplate videoSrc="/showcase/contact/contact.mp4" />
        
        {/* Fallback Image */}
        <div className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
          <Image
            src={contactImages[0]}
            alt="Contact"
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
            Contact
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-white mb-4 drop-shadow-lg" style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.5), 0 4px 20px rgba(0, 0, 0, 0.3)' }}>
            {pageTitle}
          </h1>
          {/* Hand-drawn underline — same motif as the homepage hero, in bordeaux for this page */}
          <svg width="180" height="14" viewBox="0 0 180 14" className="block mx-auto mb-8" aria-hidden="true">
            <path
              d="M2 8 Q90 2 178 8"
              fill="none"
              stroke="#8d1e11"
              strokeWidth={2}
              strokeLinecap="round"
              className="animate-draw-line"
            />
          </svg>
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

      {/* La correspondance — letter form + wax-seal channels */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <div className="mb-3 inline-block text-xs uppercase tracking-[0.3em] text-[#8d1e11]">
              Contact
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-light tracking-tight text-zinc-900 sm:text-5xl">
              Écrivez-<em className="font-normal">nous</em>
            </h2>
          </div>

          <LetterForm />
        </div>
      </section>
    </div>
  );
}