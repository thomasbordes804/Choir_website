import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RichText } from "@/components/ui/rich-text";
import { VideoEmbed } from "@/components/ui/video-embed";
import { getWorksSectionBySlug, getWorksSections } from "@/lib/sanity/queries";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const sections = await getWorksSections();
  return sections
    .filter((section) => section.slug)
    .map((section) => ({
      slug: section.slug!,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const section = await getWorksSectionBySlug(slug);

  if (!section) {
    return {
      title: "Section non trouvée",
    };
  }

  return {
    title: section.title ?? "Section d'œuvre",
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

export default async function WorksSectionPage({ params }: Props) {
  const { slug } = await params;
  const section = await getWorksSectionBySlug(slug);

  if (!section) {
    notFound();
  }

  // Extract videos from content
  const videos = extractVideos(section.content);
  const contentWithoutVideos = filterContentWithoutVideos(section.content);

  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 py-14 lg:px-8 font-[family-name:var(--font-playfair)]">
      {/* Back Navigation */}
      <Link
        href="/works"
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
        Retour aux œuvres
      </Link>

      {/* Page Header */}
      <div className="mb-12 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
          ŒUVRES
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          {section.title ?? "Section d'œuvre"}
        </h1>
        {section.description && (
          <p className="max-w-3xl text-lg text-zinc-900 dark:text-zinc-100 leading-relaxed font-normal">
            {section.description}
          </p>
        )}
      </div>

      <div className="space-y-16">
        {/* Main Content */}
        {contentWithoutVideos && contentWithoutVideos.length > 0 && (
          <article className="prose prose-lg max-w-none">
            <div className="text-xl leading-relaxed text-zinc-900 dark:text-zinc-100 font-normal space-y-6">
              <RichText value={contentWithoutVideos} />
            </div>
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

        {/* Image Gallery */}
        {section.images && section.images.length > 0 && (
          <section className="space-y-8">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]">
                Galerie
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {section.images.map((image, index) => {
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
          </section>
        )}

        {/* Subsections */}
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
          (!section.images || section.images.length === 0) &&
          (!section.subsections || section.subsections.length === 0) &&
          (!videos || videos.length === 0) && (
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