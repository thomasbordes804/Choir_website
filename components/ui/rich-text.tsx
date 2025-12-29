import Image from "next/image";
import { PortableText, type PortableTextReactComponents } from "@portabletext/react";

import { cn } from "@/lib/utils";
import { VideoEmbed } from "@/components/ui/video-embed";

const components: PortableTextReactComponents = {
  block: {
    normal: ({ children }) => <p className="text-base leading-7 text-zinc-700 dark:text-zinc-300">{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-10 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 text-xl font-semibold text-zinc-900 dark:text-zinc-100">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[color:var(--accent)]/60 pl-4 italic text-zinc-600 dark:text-zinc-300">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="ml-5 list-disc space-y-2 text-base leading-7 text-zinc-700 dark:text-zinc-300">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="ml-5 list-decimal space-y-2 text-base leading-7 text-zinc-700 dark:text-zinc-300">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-zinc-900 dark:text-zinc-100">{children}</strong>,
    em: ({ children }) => <em className="italic text-zinc-700 dark:text-zinc-300">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith("http") ? "_blank" : undefined}
        rel={value?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
        className="underline decoration-[color:var(--accent)] decoration-2 underline-offset-4"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.url) {
        return null;
      }

      const width = typeof value.width === "number" ? value.width : 1280;
      const height = typeof value.height === "number" ? value.height : 720;

      return (
        <figure className="overflow-hidden rounded-3xl border border-white/50 bg-white/70 shadow-md shadow-indigo-500/10 dark:border-white/10 dark:bg-[rgba(15,23,42,0.5)]">
          <Image
            src={value.url}
            alt={value.alt ?? ""}
            width={width}
            height={height}
            className="h-auto w-full object-cover"
            sizes="(min-width: 1024px) 720px, 100vw"
          />
          {value.caption ? (
            <figcaption className="px-4 py-3 text-center text-sm text-zinc-600 dark:text-zinc-300">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
    videoEmbed: ({ value }) => {
      if (!value?.url) {
        return null;
      }

      return <VideoEmbed url={value.url as string} title={value.title as string | undefined} poster={value.poster} />;
    },
  },
};

interface RichTextProps {
  value: Array<Record<string, unknown>>;
  className?: string;
}

export function RichText({ value, className }: RichTextProps) {
  if (!value || value.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      <PortableText value={value} components={components} />
    </div>
  );
}
