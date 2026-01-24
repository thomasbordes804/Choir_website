import Image from "next/image";
import { cn } from "@/lib/utils";
import { VideoEmbed } from "@/components/ui/video-embed";
import { PortableText, type PortableTextReactComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

interface RichTextProps {
  value: PortableTextBlock[] | Record<string, unknown>[];
  className?: string;
}

const components: Partial<PortableTextReactComponents> = {
  block: {
    normal: ({ children }) => <p className="text-base leading-7 text-zinc-900 dark:text-zinc-100 font-medium">{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-10 text-2xl font-bold text-zinc-950 dark:text-zinc-50">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 text-xl font-bold text-zinc-950 dark:text-zinc-50">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[color:var(--accent)]/60 pl-4 italic text-zinc-800 dark:text-zinc-200 font-medium">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="ml-5 list-disc space-y-2 text-base leading-7 text-zinc-900 dark:text-zinc-100 font-medium">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="ml-5 list-decimal space-y-2 text-base leading-7 text-zinc-900 dark:text-zinc-100 font-medium">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-zinc-950 dark:text-zinc-50">{children}</strong>,
    em: ({ children }) => <em className="italic text-zinc-800 dark:text-zinc-200 font-medium">{children}</em>,
    link: ({ children, value }) => {
      // PortableText passes the markDef as value
      // Try multiple ways to get the href
      const href = value?.href || (value as any)?.url || (value as any)?.link?.href || '';
      
      // Always render as link with proper styling - highlighted by default, more on hover
      return (
        <a
          href={href || '#'}
          target={href && href.startsWith("http") ? "_blank" : undefined}
          rel={href && href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="font-bold !font-bold text-[color:var(--accent)] bg-[color:var(--accent)]/10 px-1.5 py-0.5 rounded-md underline decoration-[color:var(--accent)] decoration-2 underline-offset-4 transition-all duration-200 hover:bg-[color:var(--accent)]/25 hover:text-[color:var(--accent)] hover:shadow-sm hover:shadow-[color:var(--accent)]/30 cursor-pointer"
          style={{ fontWeight: 700 }}
        >
          <strong>{children}</strong>
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.url) {
        return null;
      }

      const width = typeof value.width === "number" ? value.width : 1280;
      const height = typeof value.height === "number" ? value.height : 720;

      return (
        <figure className="overflow-hidden rounded-3xl border border-white/50 bg-white/70 shadow-md shadow-[color:var(--accent)]/10 dark:border-white/10 dark:bg-[rgba(15,23,42,0.5)]">
          <Image
            src={value.url}
            alt={value.alt ?? ""}
            width={width}
            height={height}
            className="h-auto w-full object-cover"
            sizes="(min-width: 1024px) 720px, 100vw"
          />
          {value.caption ? (
            <figcaption className="px-4 py-3 text-center text-sm text-zinc-800 dark:text-zinc-200 font-medium">
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

export function RichText({ value, className }: RichTextProps) {
  const safeValue = (Array.isArray(value) ? value : []) as PortableTextBlock[];

  if (safeValue.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      <PortableText value={safeValue} components={components} />
    </div>
  );
}