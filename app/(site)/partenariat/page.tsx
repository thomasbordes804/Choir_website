import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { TopVideoTemplate } from "@/components/ui/top-video-template";
import { getSiteSettings } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Partenariat",
  description: "Partenariats et collaborations de Michel Hilger.",
};

const partenariatImages = [
  "/biographie/portrait.webp",
  "/home_page/home_page_2.jpg",
  "/home_page/home_page_3.jpg",
];

const domains = [
  {
    title: "Expositions",
    img: "/showcase/peintures.png",
    desc: "Accrochages de peintures et œuvres graphiques — galeries, mairies, lieux patrimoniaux.",
    lift: "lg:mt-0",
  },
  {
    title: "Concerts",
    img: "/orgue/org_3.webp",
    desc: "Récitals d'orgue et d'alto — églises, festivals, cérémonies et événements privés.",
    lift: "lg:mt-11",
  },
  {
    title: "Ateliers",
    img: "/maison_de_retraite/maison_2.webp",
    desc: "Ateliers artistiques intergénérationnels — maisons de retraite, écoles, associations.",
    lift: "lg:mt-5",
  },
  {
    title: "Lectures",
    img: "/Livres/la_mort_attendra.webp",
    desc: "Rencontres littéraires et lectures publiques autour de ses ouvrages.",
    lift: "lg:mt-0",
  },
  {
    title: "Commandes",
    img: "/showcase/alto.png",
    desc: "Œuvres sur mesure — portraits, pièces musicales, textes de circonstance.",
    lift: "lg:mt-11",
  },
  {
    title: "Scène ouverte",
    img: "/showcase/communication/communication.jpg",
    desc: "Projets croisés avec d'autres artistes — musique, image et mots réunis.",
    lift: "lg:mt-5",
  },
];

const steps = [
  {
    num: "01",
    title: "La rencontre",
    desc: "Un échange simple autour de votre lieu, votre public et vos envies. Sans engagement — juste faire connaissance.",
  },
  {
    num: "02",
    title: "L'esquisse",
    desc: "Michel propose une forme : exposition, concert, atelier ou création croisée, pensée pour votre contexte et votre budget.",
  },
  {
    num: "03",
    title: "L'œuvre partagée",
    desc: "Le projet prend vie, ensemble. Chaque collaboration laisse une trace — une œuvre, un enregistrement, un souvenir commun.",
  },
];

export default async function PartenariatPage() {
  const siteSettings = await getSiteSettings();

  const pageTitle = "Partenariat & collaborations.";
  const pageDescription = siteSettings?.tagline ?? "";

  return (
    <div className="relative min-h-screen bg-[#fbfaf8]">
      {/* Hero Section with Video Background - Matching Biography/Oeuvres/Actualités/Communication pattern */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <TopVideoTemplate videoSrc="/showcase/partenariat/partenariat.mp4" />

        {/* Fallback Image */}
        <div className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
          <Image
            src={partenariatImages[0]}
            alt="Partenariat"
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
            Partenariat
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white mb-4 drop-shadow-lg" style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.5), 0 4px 20px rgba(0, 0, 0, 0.3)' }}>
            {pageTitle}
          </h1>
          {/* Hand-drawn underline — same motif as the homepage hero, in lavande for this page */}
          <svg width="180" height="14" viewBox="0 0 180 14" className="block mx-auto mb-8" aria-hidden="true">
            <path
              d="M2 8 Q90 2 178 8"
              fill="none"
              stroke="#a8a7d4"
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

      {/* Manifeste — « L'Atelier ouvert » (design 5a) */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[5fr_4fr] gap-16 lg:gap-20 items-center">
          <ScrollReveal>
            <div className="mb-5 text-xs uppercase tracking-[0.35em] text-zinc-500 font-light">
              Manifeste
            </div>
            <h2 className="text-4xl sm:text-5xl italic font-normal tracking-tight text-zinc-900 leading-[1.2] mb-7">
              « L'art n'existe vraiment que lorsqu'il est partagé. »
            </h2>
            <p className="text-lg text-zinc-600 leading-relaxed mb-4">
              Peintre, organiste, altiste, écrivain — Michel Hilger traverse les disciplines avec
              une même conviction : chaque rencontre est le début d'une œuvre. Institutions
              culturelles, communes, maisons de retraite, écoles, éditeurs ou festivals, il
              construit avec chacun des projets sur mesure.
            </p>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Cette page est une porte ouverte : celle de l'atelier.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={120} className="justify-self-center">
            <div className="overflow-hidden rounded-t-full w-[320px] sm:w-[380px] aspect-[3/4] shadow-[0_18px_44px_rgba(26,26,26,0.12)]">
              <Image
                src="/biographie/portrait.webp"
                alt="Portrait de Michel Hilger"
                width={380}
                height={507}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center mt-4 text-sm italic text-zinc-500">
              Michel Hilger, dans son atelier
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Domaines de collaboration */}
      <section className="py-24 px-6 lg:px-8 border-t border-[#eceae5]">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-6">
            <div className="mb-4 text-xs uppercase tracking-[0.35em] text-zinc-500 font-light">
              Domaines
            </div>
            <h2 className="text-4xl sm:text-5xl italic font-normal tracking-tight text-zinc-900">
              Collaborer, sous toutes les formes
            </h2>
            <svg width="200" height="14" viewBox="0 0 220 16" className="block mx-auto mt-4" aria-hidden="true">
              <path
                d="M4 10 Q110 2 216 10"
                fill="none"
                stroke="#a8a7d4"
                strokeWidth={2}
                strokeLinecap="round"
                className="animate-draw-line"
              />
            </svg>
          </ScrollReveal>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-11 gap-y-10 items-start">
            {domains.map((d, index) => (
              <ScrollReveal key={d.title} delay={index * 90}>
                <div className={`group ${d.lift}`}>
                  <div className="overflow-hidden rounded-t-full aspect-[3/4] bg-[#eceae5] shadow-[0_18px_44px_rgba(26,26,26,0.10)] transition-all duration-500 ease-out group-hover:-translate-y-2.5 group-hover:shadow-[0_30px_60px_rgba(26,26,26,0.18)]">
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-[1400ms] ease-out group-hover:scale-[1.07]"
                      style={{ backgroundImage: `url(${d.img})` }}
                    />
                  </div>
                  <div className="pt-5 px-2 text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <span className="w-5 h-px bg-[#a8a7d4]" />
                      <span className="text-[23px] font-medium text-zinc-900">{d.title}</span>
                      <span className="w-5 h-px bg-[#a8a7d4]" />
                    </div>
                    <div className="text-[14.5px] italic text-zinc-500 leading-relaxed">{d.desc}</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* La démarche */}
      <section className="py-24 px-6 lg:px-8 bg-[#f2f1ed] border-t border-[#eceae5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 lg:gap-20 items-start">
          <ScrollReveal>
            <div className="mb-4 text-xs uppercase tracking-[0.35em] text-zinc-500 font-light">
              La démarche
            </div>
            <h2 className="text-3xl sm:text-4xl italic font-normal tracking-tight text-zinc-900 leading-[1.25]">
              Du premier échange à l'œuvre partagée
            </h2>
          </ScrollReveal>
          <div className="flex flex-col">
            {steps.map((s, index) => (
              <ScrollReveal key={s.num} delay={index * 120}>
                <div className="grid grid-cols-[70px_1fr] sm:grid-cols-[90px_1fr] gap-7 py-7 border-b border-[#e0ded8] items-baseline">
                  <span className="text-4xl italic text-[#a8a7d4]">{s.num}</span>
                  <div>
                    <div className="text-[22px] font-medium text-zinc-900 mb-1.5">{s.title}</div>
                    <div className="text-base text-zinc-600 leading-relaxed">{s.desc}</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Appel à projet */}
      <section className="py-28 px-6 lg:px-8 text-center border-t border-[#eceae5]">
        <ScrollReveal>
          <div className="mb-5 text-xs uppercase tracking-[0.35em] text-zinc-500 font-light">
            Et maintenant ?
          </div>
          <h2 className="text-4xl sm:text-5xl italic font-normal tracking-tight text-zinc-900 leading-[1.25] mb-5">
            Vous avez un lieu, un public,
            <br />
            une idée ?
          </h2>
          <p className="text-lg text-zinc-600 leading-relaxed max-w-xl mx-auto mb-10">
            Chaque partenariat commence par une conversation. Écrivez quelques lignes sur votre
            projet — Michel vous répondra personnellement.
          </p>
          <Link
            href="/contact"
            className="inline-block text-[13px] uppercase tracking-[0.25em] text-[#faf9f6] bg-zinc-900 border border-zinc-900 rounded-full px-10 py-4 transition-colors duration-400 hover:bg-transparent hover:text-zinc-900"
          >
            Proposer un projet →
          </Link>
        </ScrollReveal>
      </section>
    </div>
  );
}
