import type { Metadata } from "next";
import Image from "next/image";

import { TopVideoTemplate } from "@/components/ui/top-video-template";
import { MecenePanel } from "@/components/don/mecene-panel";
import { getDonations, getSiteSettings } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Soutenir",
  description: "Soutenez l'atelier de Michel Hilger — chaque don est un coup de pinceau sur la fresque des mécènes.",
};

const donImages = [
  '/biographie/portrait.webp',
  '/home_page/home_page_2.jpg',
  '/home_page/home_page_3.jpg',
];

export default async function DonPage() {
  const [siteSettings, donations] = await Promise.all([
    getSiteSettings(),
    getDonations(),
  ]);
  const pageDescription = siteSettings?.tagline ?? "";

  return (
    <div className="relative min-h-screen bg-[#edeae6]">
      {/* Hero Section — same pattern as the other pages */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <TopVideoTemplate videoSrc="/showcase/contact/contact.mp4" />

        <div className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
          <Image
            src={donImages[0]}
            alt="Soutenir l'atelier"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent z-10" />

        <div className="relative z-20 max-w-4xl mx-auto px-6 lg:px-8 text-center pt-32 sm:pt-40">
          <div className="mb-6 text-sm uppercase tracking-[0.3em] text-white font-semibold">
            Soutien
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-white mb-4 drop-shadow-lg" style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.5), 0 4px 20px rgba(0, 0, 0, 0.3)' }}>
            Soutenir l&apos;atelier.
          </h1>
          {/* Hand-drawn underline — same motif as the homepage hero, in ocre for this page */}
          <svg width="180" height="14" viewBox="0 0 180 14" className="block mx-auto mb-8" aria-hidden="true">
            <path
              d="M2 8 Q90 2 178 8"
              fill="none"
              stroke="#e8c99b"
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

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex flex-col items-center gap-2">
            <div className="text-white font-semibold text-xs uppercase tracking-wider">
              Défilez
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent" />
          </div>
        </div>
      </section>

      {/* Le mécène — fresco + tiers + CTA */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <div className="mb-3 inline-block text-xs uppercase tracking-[0.3em] text-[#8d1e11]">
              Soutien
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-light tracking-tight text-zinc-900 sm:text-5xl">
              Devenez un <em className="font-normal">coup de pinceau</em>
            </h2>
            <p className="mx-auto mt-4 max-w-[520px] text-sm leading-relaxed text-zinc-500">
              Chaque don ajoute une touche de couleur à la fresque des soutiens — votre nom, votre couleur, votre trace dans l&apos;atelier.
            </p>
          </div>

          <MecenePanel donations={donations} />
        </div>
      </section>
    </div>
  );
}
