import { useMemo } from "react";

import Image from "next/image";

import type { SanityImageAsset } from "@/lib/sanity/queries";

interface VideoEmbedProps {
  url: string;
  title?: string | null;
  poster?: SanityImageAsset | null;
  className?: string;
}

function buildEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
      }
    }

    if (host === "youtu.be") {
      const videoId = parsed.pathname.replace("/", "");
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
      }
    }

    if (host.includes("vimeo.com")) {
      const segments = parsed.pathname.split("/").filter(Boolean);
      const videoId = segments[segments.length - 1];
      if (videoId) {
        return `https://player.vimeo.com/video/${videoId}`;
      }
    }

    return url;
  } catch (error) {
    console.warn("Invalid video URL", url, error);
    return url;
  }
}

export function VideoEmbed({ url, title, poster, className }: VideoEmbedProps) {
  const embedUrl = useMemo(() => buildEmbedUrl(url), [url]);

  if (embedUrl === url && (url.endsWith(".mp4") || url.endsWith(".webm"))) {
    return (
      <div className={className}>
        <video
          controls
          preload="metadata"
          poster={poster?.url}
          className="h-auto w-full rounded-3xl border border-white/40 bg-black/60 shadow-lg shadow-indigo-500/10"
        >
          <source src={url} />
          Votre navigateur ne prend pas en charge la lecture vidéo.
        </video>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="relative aspect-video overflow-hidden rounded-3xl border border-white/40 bg-black/70 shadow-lg shadow-indigo-500/10">
        {poster?.url ? (
          <Image
            src={poster.url}
            alt={poster.alt ?? title ?? "Vidéo"}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 720px, 100vw"
          />
        ) : null}
        <iframe
          src={embedUrl}
          title={title ?? "Vidéo intégrée"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </div>
  );
}
