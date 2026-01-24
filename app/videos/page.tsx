import type { Metadata } from "next";

import { RichText } from "@/components/ui/rich-text";
import { VideoEmbed } from "@/components/ui/video-embed";
import { getVideosPage } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Vidéos",
  description: "Découvrez les vidéos de Michel Hilger : concerts, documentaires, interviews et performances musicales.",
};

// Video-themed color palettes
const videoPalettes = [
  {
    primary: "from-indigo-600 via-purple-600 to-pink-600",
    accent: "from-indigo-500 to-purple-500",
    border: "border-indigo-400",
    glow: "shadow-[0_0_60px_rgba(99,102,241,0.6)]",
    light: "from-indigo-400/40 via-purple-400/40 to-pink-400/40",
  },
  {
    primary: "from-cyan-500 via-blue-600 to-indigo-600",
    accent: "from-cyan-400 to-blue-500",
    border: "border-cyan-400",
    glow: "shadow-[0_0_60px_rgba(34,211,238,0.6)]",
    light: "from-cyan-400/40 via-blue-400/40 to-indigo-400/40",
  },
  {
    primary: "from-rose-500 via-pink-600 to-fuchsia-600",
    accent: "from-rose-400 to-pink-500",
    border: "border-rose-400",
    glow: "shadow-[0_0_60px_rgba(244,63,94,0.6)]",
    light: "from-rose-400/40 via-pink-400/40 to-fuchsia-400/40",
  },
  {
    primary: "from-emerald-500 via-teal-600 to-cyan-600",
    accent: "from-emerald-400 to-teal-500",
    border: "border-emerald-400",
    glow: "shadow-[0_0_60px_rgba(16,185,129,0.6)]",
    light: "from-emerald-400/40 via-teal-400/40 to-cyan-400/40",
  },
  {
    primary: "from-amber-500 via-orange-600 to-red-600",
    accent: "from-amber-400 to-orange-500",
    border: "border-amber-400",
    glow: "shadow-[0_0_60px_rgba(251,191,36,0.6)]",
    light: "from-amber-400/40 via-orange-400/40 to-red-400/40",
  },
];

export default async function VideosPage() {
  const videosPage = await getVideosPage();

  const hasContent = Boolean(videosPage?.content && videosPage.content.length > 0);
  const pageTitle = videosPage?.title ?? "Vidéos";
  const pageDescription = videosPage?.description ?? "Découvrez les vidéos de Michel Hilger : concerts, documentaires, interviews et performances musicales.";

  // Extract videos from content
  const videos = videosPage?.content?.filter((item: any) => item._type === "videoEmbed") || [];
  const contentWithoutVideos = videosPage?.content?.filter((item: any) => item._type !== "videoEmbed") || [];

  return (
    <section className="relative mx-auto w-full max-w-7xl px-6 py-14 lg:px-8 font-[family-name:var(--font-playfair)] overflow-hidden">
      {/* Cinematic background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Projector light effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-bl from-cyan-500/20 via-blue-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        
        {/* Sound wave decorative lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 200 100" preserveAspectRatio="none">
          <path d="M0,50 Q25,30 50,50 T100,50 T150,50 T200,50" stroke="currentColor" strokeWidth="1" fill="none" className="text-indigo-500" />
          <path d="M0,50 Q25,70 50,50 T100,50 T150,50 T200,50" stroke="currentColor" strokeWidth="1" fill="none" className="text-purple-500" />
          <path d="M0,50 Q30,20 60,50 T120,50 T180,50" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-pink-500" />
        </svg>
      </div>

      {/* Page Header - Cinematic Style */}
      <div className="mb-16 space-y-6 relative z-10">
        {/* Decorative header with play button theme */}
        <div className="flex items-center gap-4">
          {/* Left decorative element - Play button style */}
          <div className="flex items-center gap-3">
            <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full" />
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div className="h-1 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
          </div>
          
          {/* Center label */}
          <p className="text-sm tracking-[0.3em] uppercase font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
            CINÉMA & PERFORMANCES
          </p>
          
          {/* Right decorative element */}
          <div className="flex items-center gap-3 flex-1">
            <div className="h-1 w-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full" />
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1 h-6 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-60" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
            <div className="h-1 flex-1 bg-gradient-to-r from-rose-500 via-pink-500 to-transparent rounded-full" />
          </div>
        </div>

        {/* Main title with cinematic gradient */}
        <h1 className="text-6xl sm:text-7xl font-black tracking-tight">
          <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {pageTitle}
          </span>
        </h1>

        {/* Description with decorative elements */}
        {pageDescription && (
          <div className="relative">
            <p className="max-w-3xl text-xl leading-relaxed font-bold text-zinc-800 dark:text-zinc-200">
              {pageDescription}
            </p>
            {/* Decorative sound waves */}
            <div className="mt-4 flex items-center gap-2">
              <div className="h-0.5 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-0.5 bg-gradient-to-t from-indigo-500 via-purple-500 to-pink-500 rounded-full" style={{ height: `${8 + i * 4}px` }} />
                ))}
              </div>
              <div className="h-0.5 flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-transparent rounded-full" />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-20 relative z-10">
        {/* Introduction Content */}
        {contentWithoutVideos && contentWithoutVideos.length > 0 && (
          <article className="prose prose-lg max-w-none">
            <div className="text-xl leading-relaxed text-zinc-900 dark:text-zinc-100 font-semibold space-y-6">
              <RichText value={contentWithoutVideos} />
            </div>
          </article>
        )}

        {/* Videos Grid - Cinematic Style */}
        {videos && videos.length > 0 ? (
          <section className="space-y-12">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video: any, index: number) => {
                if (!video.url) return null;
                
                const palette = videoPalettes[index % videoPalettes.length];
                
                return (
                  <div
                    key={index}
                    className="group relative"
                  >
                    {/* Projector light effect on hover */}
                    <div className={`absolute -inset-2 bg-gradient-to-br ${palette.light} rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10`} />
                    
                    {/* Main video card - Cinema screen style */}
                    <div className={`relative overflow-hidden rounded-2xl border-4 ${palette.border} bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:${palette.glow}`}>
                      {/* Cinema screen frame effect */}
                      <div className="absolute inset-0 border-2 border-white/10 rounded-2xl pointer-events-none" />
                      
                      {/* Top cinema frame */}
                      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-zinc-900/80 to-transparent z-20" />
                      
                      {/* Content */}
                      <div className="relative z-10 p-6 space-y-4">
                        {/* Video container with cinematic aspect ratio */}
                        <div className="relative overflow-hidden rounded-xl bg-black shadow-2xl group-hover:shadow-[0_0_40px_rgba(0,0,0,0.8)] transition-all duration-500">
                          {/* Play button overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30">
                              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                          
                          <VideoEmbed
                            url={video.url}
                            title={video.title}
                            poster={video.poster}
                          />
                        </div>

                        {/* Title with strong contrast */}
                        <div className="space-y-3">
                          {video.title && (
                            <h3 className="text-xl font-black text-white leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:via-purple-400 group-hover:to-pink-400 transition-all duration-500 drop-shadow-lg">
                              {video.title}
                            </h3>
                          )}
                          
                          {video.description && (
                            <p className="text-sm font-bold text-zinc-300 leading-relaxed line-clamp-2 group-hover:text-zinc-100 transition-colors duration-500">
                              {video.description}
                            </p>
                          )}
                        </div>

                        {/* Bottom cinema frame with gradient */}
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-zinc-900 via-zinc-900/80 to-transparent pointer-events-none" />
                      </div>

                      {/* Animated border glow on hover */}
                      <div className={`absolute inset-0 rounded-2xl border-4 ${palette.border} opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${palette.glow} pointer-events-none`} />
                      
                      {/* Corner spotlights */}
                      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-white/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          <div className="rounded-2xl border-4 border-zinc-700/60 bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 backdrop-blur-md p-12 text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-lg font-bold text-zinc-300">
              Les vidéos seront bientôt disponibles.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}