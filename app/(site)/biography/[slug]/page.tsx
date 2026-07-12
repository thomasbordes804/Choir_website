import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RichText } from "@/components/ui/rich-text";
import { VideoEmbed } from "@/components/ui/video-embed";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { getBiographySectionBySlug, getBiographySections, getAnnouncements } from "@/lib/sanity/queries";

// Photos of the choirs involved in the festival (Rosny-sous-Bois, Sucy-en-Brie, Créteil)
const grandParisGallery = [
  { src: "/showcase/oeuvres/Chorales/chorale rosny/chorale_rosny_1.webp", alt: "Chorale à Rosny-sous-Bois", lift: "lg:mt-0" },
  { src: "/showcase/oeuvres/Chorales/chorale sucy/chorale_sucy_1.webp", alt: "Chorale Saint-Martin à Sucy-en-Brie", lift: "lg:mt-11" },
  { src: "/showcase/oeuvres/Chorales/chorale creteil/chorale_creteil.webp", alt: "Chorale à Créteil", lift: "lg:mt-5" },
  { src: "/showcase/oeuvres/Chorales/chorale rosny/chorale_rosny_2.webp", alt: "Concert à Rosny-sous-Bois", lift: "lg:mt-0" },
  { src: "/showcase/oeuvres/Chorales/chorale sucy/chorale_sucy_2.webp", alt: "Concert de la chorale Saint-Martin", lift: "lg:mt-11" },
  { src: "/showcase/oeuvres/Chorales/chorale rosny/chorale_rosny_3.webp", alt: "Chorale des Quatre Vents à Rosny", lift: "lg:mt-5" },
];

// Precursor concerts filmed and shared on the festival's YouTube channel
const grandParisVideos = [
  { title: "Concert à Valenton — 14 janvier 2018", url: "https://www.youtube.com/watch?v=riRQRDyaiXw" },
  { title: "Concert à Rosny-sous-Bois — 21 janvier 2018", url: "https://www.youtube.com/watch?v=2TLFGcGKG-U" },
];

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const sections = await getBiographySections();
  return sections
    .filter((section) => section.slug)
    .map((section) => ({
      slug: section.slug!,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const section = await getBiographySectionBySlug(slug);

  if (!section) {
    return {
      title: "Section non trouvée",
    };
  }

  return {
    title: section.title ?? "Section de biographie",
    description: section.description ?? undefined,
  };
}

// Helper to extract videos from content
function extractVideos(content: any[]) {
  if (!content) return [];
  return content.filter((item) => item._type === "videoEmbed");
}

// Helper to filter content without videos
function filterContentWithoutVideos(content: any[]) {
  if (!content) return [];
  return content.filter((item) => item._type !== "videoEmbed");
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
});

export default async function BiographySectionPage({ params }: Props) {
  const { slug } = await params;
  const [section, allAnnouncements] = await Promise.all([
    getBiographySectionBySlug(slug),
    getAnnouncements(50),
  ]);

  if (!section) {
    notFound();
  }

  const content = section.content ?? [];
  const videos = extractVideos(content);
  const contentWithoutVideos = filterContentWithoutVideos(content);
  // Filter announcements related to Grand Pari's
  const relatedAnnouncements = slug === "grand-paris-en-choeurs"
    ? allAnnouncements
        .filter((announcement) => 
          announcement.title?.toLowerCase().includes("grand pari") ||
          announcement.title?.toLowerCase().includes("chœur") ||
          announcement.title?.toLowerCase().includes("chorale") ||
          announcement.slug?.includes("grand-paris")
        )
        .sort((a, b) => {
          const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
          const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
          return dateB - dateA;
        })
    : [];

  // Check if this is the organ restoration section - be more specific to avoid matching "organist"
  // Only match if title contains BOTH "restauration" AND "art au pluriel" to avoid matching "Michel Hilger à l'orgue"
  const organSlugs = ["organ", "restauration-d-orgues", "restauration-orgues"];
  const isOrganSection = 
    organSlugs.includes(slug) ||
    organSlugs.includes(section.slug || "") ||
    (section.title?.toLowerCase().includes("restauration") && 
     section.title?.toLowerCase().includes("art au pluriel"));

  // Check if this is the retirement home section
  const retirementSlugs = ["retirement-home", "maison-retraite", "maisons-retraite", "animations-maisons-retraite"];
  const retirementTitleKeywords = ["maison", "retraite", "animation"];
  
  const isRetirementSection = 
    retirementSlugs.includes(slug) ||
    retirementSlugs.includes(section.slug || "") ||
    retirementTitleKeywords.some(keyword => 
      section.title?.toLowerCase().includes(keyword)
    );

  // Check if this is the CV section
  const cvSlugs = ["cv", "curriculum-vitae", "curriculum"];
  const cvTitleKeywords = ["curriculum", "vitae", "cv"];
  
  const isCVSection = 
    cvSlugs.includes(slug) ||
    cvSlugs.includes(section.slug || "") ||
    cvTitleKeywords.some(keyword => 
      section.title?.toLowerCase().includes(keyword)
    );

  // Generate local image paths for organ section if no images in Sanity
  const organLocalImages = isOrganSection && (!section.images || section.images.length === 0)
    ? Array.from({ length: 34 }, (_, i) => ({
        url: `/org/org_${i + 1}.webp`,
        width: 800,
        height: 600,
        alt: `Restauration d'orgue ${i + 1}`,
        caption: null,
      }))
    : [];

  // Generate local image paths for retirement home section if no images in Sanity
  const retirementLocalImages = isRetirementSection && (!section.images || section.images.length === 0)
    ? Array.from({ length: 13 }, (_, i) => ({
        url: `/maison_de_retraite/maison_${i + 1}.webp`,
        width: 800,
        height: 600,
        alt: `Animation en maison de retraite ${i + 1}`,
        caption: null,
      }))
    : [];

  // Generate local image path for CV section if no images in Sanity
  const cvPortraitImage = isCVSection && (!section.images || section.images.length === 0)
    ? {
        url: `/CV/portrait.webp`,
        width: 600,
        height: 800,
        alt: `Portrait de Michel Hilger`,
        caption: null,
      }
    : null;

  // Use Sanity images if available, otherwise use local images
  // IMPORTANT: Only use one source to avoid duplicates
  // For CV section, we don't include the portrait in displayImages (it's shown alongside text)
  const displayImages = (section.images && section.images.length > 0) 
    ? section.images 
    : (isOrganSection ? organLocalImages : (isRetirementSection ? retirementLocalImages : []));

  // Determine if we should use masonry layout (for organ and retirement sections)
  const useMasonryLayout = isOrganSection || isRetirementSection;

  // Festival Grand Pari's en Chœurs — bespoke chapter design ("La Portée")
  if (slug === "grand-paris-en-choeurs") {
    const chronology = [...relatedAnnouncements].sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateA - dateB;
    });

    return (
      <div className="relative min-h-screen bg-[#fbfaf8]">
        {/* Header */}
        <section className="pt-16 pb-4 px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/biography"
              className="group inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-[#a8433a] mb-10"
            >
              <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Retour à la biographie
            </Link>
            <div className="mb-4 text-xs uppercase tracking-[0.35em] text-zinc-500 font-light">
              Biographie · Chapitre 01
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl italic font-normal tracking-tight text-zinc-900 leading-[1.15] mb-6">
              {section.title}
            </h1>
            <svg width="180" height="14" viewBox="0 0 180 14" className="mb-8" aria-hidden="true">
              <path d="M2 8 Q90 2 178 8" fill="none" stroke="#a8433a" strokeWidth={2} strokeLinecap="round" className="animate-draw-line" />
            </svg>
            {section.description && (
              <p className="text-lg sm:text-xl text-zinc-600 leading-relaxed">
                {section.description}
              </p>
            )}
          </div>
        </section>

        {/* Manifeste */}
        {section.content && section.content.length > 0 && (
          <section className="pt-10 pb-20 px-6 lg:px-8">
            <ScrollReveal className="max-w-3xl mx-auto">
              <div className="text-[17px] text-zinc-600 leading-relaxed space-y-5 [&_p]:text-[17px] [&_p]:text-zinc-600 [&_p]:leading-relaxed [&_p]:font-normal [&_em]:text-[#a8433a] [&_em]:not-italic [&_em]:font-medium">
                <RichText value={section.content} />
              </div>
            </ScrollReveal>
          </section>
        )}

        {/* Galerie */}
        <section className="py-24 px-6 lg:px-8 border-t border-[#eceae5]">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal className="text-center mb-6">
              <div className="mb-4 text-xs uppercase tracking-[0.35em] text-zinc-500 font-light">
                Galerie
              </div>
              <h2 className="text-4xl sm:text-5xl italic font-normal tracking-tight text-zinc-900">
                Les chorales, sur le terrain
              </h2>
            </ScrollReveal>
            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-11 gap-y-10 items-start">
              {grandParisGallery.map((photo, index) => (
                <ScrollReveal key={photo.src} delay={index * 90}>
                  <div className={`group ${photo.lift}`}>
                    <div className="overflow-hidden rounded-t-full aspect-[3/4] bg-[#eceae5] shadow-[0_18px_44px_rgba(26,26,26,0.10)] transition-all duration-500 ease-out group-hover:-translate-y-2.5 group-hover:shadow-[0_30px_60px_rgba(26,26,26,0.18)]">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        width={600}
                        height={800}
                        className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.07]"
                      />
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Vidéos */}
        <section className="py-24 px-6 lg:px-8 border-t border-[#eceae5] bg-[#f2f1ed]">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal className="text-center mb-14">
              <div className="mb-4 text-xs uppercase tracking-[0.35em] text-zinc-500 font-light">
                Vidéos
              </div>
              <h2 className="text-4xl sm:text-5xl italic font-normal tracking-tight text-zinc-900">
                Concerts précurseurs
              </h2>
            </ScrollReveal>
            <div className="grid gap-8 sm:grid-cols-2">
              {grandParisVideos.map((video, index) => (
                <ScrollReveal key={video.url} delay={index * 100}>
                  <VideoEmbed url={video.url} title={video.title} />
                  <div className="mt-4 text-sm italic text-zinc-500 text-center">{video.title}</div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Chronologie */}
        {chronology.length > 0 && (
          <section className="py-24 px-6 lg:px-8 border-t border-[#eceae5]">
            <div className="max-w-4xl mx-auto">
              <ScrollReveal className="mb-14 text-center">
                <div className="mb-4 text-xs uppercase tracking-[0.35em] text-zinc-500 font-light">
                  Chronologie
                </div>
                <h2 className="text-4xl sm:text-5xl italic font-normal tracking-tight text-zinc-900">
                  Le festival, concert après concert
                </h2>
              </ScrollReveal>
              <div className="flex flex-col">
                {chronology.map((item, index) => (
                  <ScrollReveal key={item._id} delay={Math.min(index * 60, 600)}>
                    <div className="grid grid-cols-[90px_1fr] sm:grid-cols-[130px_1fr] gap-6 sm:gap-8 py-7 border-b border-[#e0ded8] items-baseline">
                      <span className="text-sm uppercase tracking-[0.15em] text-[#a8433a]">
                        {item.publishedAt ? dateFormatter.format(new Date(item.publishedAt)) : ""}
                      </span>
                      <div>
                        <div className="text-[19px] font-medium text-zinc-900 mb-1.5">{item.title}</div>
                        {item.excerpt && (
                          <div className="text-base text-zinc-600 leading-relaxed">{item.excerpt}</div>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Concours d'affiches */}
        {section.subsections && section.subsections.length > 0 && (
          <section className="py-24 px-6 lg:px-8 border-t border-[#eceae5] bg-[#f2f1ed]">
            <div className="max-w-3xl mx-auto text-center">
              {section.subsections.map((sub, index) => (
                <ScrollReveal key={sub.slug ?? index}>
                  <div className="mb-4 text-xs uppercase tracking-[0.35em] text-zinc-500 font-light">
                    Participer
                  </div>
                  {sub.title && (
                    <h2 className="text-3xl sm:text-4xl italic font-normal tracking-tight text-zinc-900 mb-5">
                      {sub.title}
                    </h2>
                  )}
                  {sub.content && sub.content.length > 0 && (
                    <div className="text-lg text-zinc-600 leading-relaxed">
                      <RichText value={sub.content} />
                    </div>
                  )}
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-28 px-6 lg:px-8 text-center border-t border-[#eceae5]">
          <ScrollReveal>
            <div className="mb-5 text-xs uppercase tracking-[0.35em] text-zinc-500 font-light">
              Et maintenant ?
            </div>
            <h2 className="text-4xl sm:text-5xl italic font-normal tracking-tight text-zinc-900 leading-[1.25] mb-5">
              Votre chorale, votre église,
              <br />
              votre gare du Grand Paris ?
            </h2>
            <p className="text-lg text-zinc-600 leading-relaxed max-w-xl mx-auto mb-10">
              Le festival continue de s'étendre au fil des nouvelles lignes. Écrivez à Michel pour
              associer votre chorale ou votre lieu à une prochaine étape.
            </p>
            <Link
              href="/contact"
              className="inline-block text-[13px] uppercase tracking-[0.25em] text-[#faf9f6] bg-zinc-900 border border-zinc-900 rounded-full px-10 py-4 transition-colors duration-400 hover:bg-transparent hover:text-zinc-900"
            >
              Proposer un concert →
            </Link>
          </ScrollReveal>
        </section>
      </div>
    );
  }

  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 py-14 lg:px-8 font-[family-name:var(--font-playfair)]">
      {/* Back Navigation */}
      <Link
        href="/biography"
        className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:text-[color:var(--accent)] mb-8"
      >
        <svg
          className="h-4 w-4 transition-transform group-hover:-translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Retour à la biographie
      </Link>

      {/* Page Header */}
      <div className="mb-12 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
          BIOGRAPHIE
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          {section.title ?? "Section de biographie"}
        </h1>
        {section.description && (
          <p className="max-w-3xl text-lg text-zinc-900 dark:text-zinc-100 leading-relaxed font-normal">
            {section.description}
          </p>
        )}
      </div>

      <div className="space-y-16">
        {/* Main Content - Special layout for CV section with portrait floating on left */}
        {contentWithoutVideos && contentWithoutVideos.length > 0 && (
          <article className={`prose prose-lg max-w-none ${isCVSection ? 'relative' : ''}`}>
            {isCVSection && cvPortraitImage && (
              <figure className="group float-left mr-8 mb-6 w-64 sm:w-80 overflow-hidden rounded-xl border-2 border-zinc-200/60 bg-white/60 shadow-lg transition-all duration-300 hover:border-[color:var(--accent)]/60 hover:shadow-xl hover:shadow-[color:var(--accent)]/20 dark:border-zinc-700/60 dark:bg-zinc-900/40 dark:hover:border-[color:var(--accent)]/40">
                <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  <Image
                    src={cvPortraitImage.url}
                    alt={cvPortraitImage.alt ?? "Portrait de Michel Hilger"}
                    width={cvPortraitImage.width}
                    height={cvPortraitImage.height}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 640px) 320px, 256px"
                  />
                </div>
                {cvPortraitImage.caption && (
                  <figcaption className="px-4 py-3 text-center text-sm text-zinc-700 dark:text-zinc-300 font-normal">
                    {cvPortraitImage.caption}
                  </figcaption>
                )}
              </figure>
            )}
            
            <div className="text-xl leading-relaxed text-zinc-900 dark:text-zinc-100 font-normal space-y-6">
              <RichText value={contentWithoutVideos} />
            </div>
            
            {/* Clear float for CV section */}
            {isCVSection && <div className="clear-both" />}
          </article>
        )}

        {/* Videos Section */}
        {videos && videos.length > 0 && (
          <section className="space-y-8">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
                Vidéos
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {videos.map((video, index) => {
                if (!video.url) return null;
                return (
                  <div key={index} className="space-y-2">
                    {video.title && (
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        {video.title}
                      </h3>
                    )}
                    <VideoEmbed
                      url={video.url}
                      title={video.title}
                      poster={video.poster}
                    />
                    {video.description && (
                      <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        {video.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Image Gallery - Special artistic layout for organ restoration and retirement home */}
        {displayImages && displayImages.length > 0 && (
          <section className="space-y-8">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
                Galerie
              </p>
            </div>
            
            {useMasonryLayout ? (
              // Artistic masonry grid for organ restoration and retirement home
              <div className="columns-1 sm:columns-2 lg:columns-4 gap-4 space-y-4">
                {displayImages.map((image, index) => {
                  if (!image.url) return null;

                  const width = typeof image.width === "number" ? image.width : 800;
                  const height = typeof image.height === "number" ? image.height : 600;
                  
                  // Varying aspect ratios for artistic effect
                  const aspectRatios = [
                    "aspect-[4/3]",
                    "aspect-square",
                    "aspect-[3/4]",
                    "aspect-[16/9]",
                    "aspect-square",
                    "aspect-[5/4]",
                  ];
                  const aspect = aspectRatios[index % aspectRatios.length];

                  return (
                    <figure
                      key={image.url || index}
                      className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl border-2 border-zinc-200/60 bg-white/70 backdrop-blur-sm shadow-lg transition-all duration-500 hover:border-[color:var(--accent)]/60 hover:shadow-2xl hover:shadow-[color:var(--accent)]/30 hover:-translate-y-1 hover:scale-[1.02] dark:border-zinc-700/60 dark:bg-zinc-900/50"
                    >
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 rounded-2xl" />
                      
                      {/* Image container */}
                      <div className={`relative w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 ${aspect}`}>
                        <Image
                          src={image.url}
                          alt={image.alt ?? (isOrganSection ? `Restauration d'orgue ${index + 1}` : `Animation en maison de retraite ${index + 1}`)}
                          width={width}
                          height={height}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        />
                      </div>
                      
                      {/* Caption overlay */}
                      {image.caption && (
                        <figcaption className="absolute bottom-0 left-0 right-0 px-4 py-3 text-center text-sm text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl">
                          {image.caption}
                        </figcaption>
                      )}
                      
                      {/* Decorative corner accent */}
                      <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-[color:var(--accent)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tl-2xl" />
                    </figure>
                  );
                })}
              </div>
            ) : (
              // Standard grid for other sections
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {displayImages.map((image, index) => {
                  if (!image.url) return null;

                  const width = typeof image.width === "number" ? image.width : 800;
                  const height = typeof image.height === "number" ? image.height : 600;

                  return (
                    <figure
                      key={image.url || index}
                      className="group relative overflow-hidden rounded-xl border-2 border-zinc-200/60 bg-white/60 shadow-lg transition-all duration-300 hover:border-[color:var(--accent)]/60 hover:shadow-xl hover:shadow-[color:var(--accent)]/20 dark:border-zinc-700/60 dark:bg-zinc-900/40 dark:hover:border-[color:var(--accent)]/40"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                        <Image
                          src={image.url}
                          alt={image.alt ?? `Image ${index + 1}`}
                          width={width}
                          height={height}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        />
                      </div>
                      {image.caption && (
                        <figcaption className="px-4 py-3 text-center text-sm text-zinc-700 dark:text-zinc-300 font-normal">
                          {image.caption}
                        </figcaption>
                      )}
                    </figure>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Actualités du Grand Pari's en Chœur */}
        {relatedAnnouncements && relatedAnnouncements.length > 0 && (
          <section className="space-y-8">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
                Actualité du Grand Pari's en Chœur
              </p>
            </div>
            <div className="space-y-6">
              {relatedAnnouncements.map((announcement) => (
                <article
                  key={announcement._id}
                  className="w-full rounded-xl border-2 border-zinc-200/60 bg-white/70 backdrop-blur-sm p-8 shadow-lg transition-all duration-300 hover:border-[color:var(--accent)]/60 hover:shadow-xl hover:shadow-[color:var(--accent)]/20 dark:border-zinc-700/60 dark:bg-zinc-900/50 dark:hover:bg-zinc-900/70"
                >
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--accent)]">
                        {announcement.publishedAt
                          ? dateFormatter.format(new Date(announcement.publishedAt))
                          : "Récemment"}
                      </div>
                      <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                        {announcement.title ?? "Actualité"}
                      </h3>
                    </div>
                    
                    {announcement.body && announcement.body.length > 0 && (
                      <div className="prose prose-lg max-w-none">
                        <div className="text-lg leading-relaxed text-zinc-900 dark:text-zinc-100 font-normal">
                          <RichText value={announcement.body} />
                        </div>
                      </div>
                    )}
                    
                    {(!announcement.body || announcement.body.length === 0) && announcement.excerpt && (
                      <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
                        {announcement.excerpt}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Subsections - Now including CV section */}
        {section.subsections && section.subsections.length > 0 && (
          <section className="space-y-10">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
                Sous-sections
              </p>
            </div>
            <div className="space-y-8">
              {section.subsections.map((subsection, index) => (
                <div
                  key={index}
                  className="space-y-4 rounded-xl border-2 border-zinc-200/60 bg-white/50 backdrop-blur-sm p-8 shadow-md transition-all duration-300 hover:border-[color:var(--accent)]/60 hover:bg-white/70 hover:shadow-lg dark:border-zinc-700/60 dark:bg-zinc-900/30 dark:hover:border-[color:var(--accent)]/40 dark:hover:bg-zinc-900/50"
                  style={{
                    borderLeft: `4px solid ${index % 2 === 0 ? '#ff6b6b' : '#4ecdc4'}`,
                  }}
                >
                  {subsection.title && (
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                      {subsection.title}
                    </h3>
                  )}
                  {subsection.content && subsection.content.length > 0 && (
                    <div className="prose prose-lg max-w-none">
                      <div className="text-lg leading-relaxed text-zinc-900 dark:text-zinc-100 font-normal">
                        <RichText value={subsection.content} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {(!section.content || section.content.length === 0) &&
          (!displayImages || displayImages.length === 0) &&
          (!section.subsections || section.subsections.length === 0) &&
          (!videos || videos.length === 0) &&
          (!relatedAnnouncements || relatedAnnouncements.length === 0) && (
            <div className="rounded-xl border-2 border-zinc-200/60 bg-white/40 p-12 text-center dark:border-zinc-700/60 dark:bg-zinc-900/30">
              <p className="text-lg text-zinc-700 dark:text-zinc-300">
                Le contenu de cette section sera bientôt disponible.
              </p>
            </div>
          )}
      </div>
    </section>
  );
}