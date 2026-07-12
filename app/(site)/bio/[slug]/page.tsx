import React from "react"
import Link from "next/link"
import { sanityConfig } from "@/lib/sanity/config"
import BlockContent from "../BlockContent"

type BiographySection = {
  _id: string
  title?: string
  slug?: { current?: string }
  description?: string
  content?: any[]
  images?: Array<{
    asset?: {
      url?: string
    }
    alt?: string
    caption?: string
  }>
  subsections?: Array<{
    title?: string
    slug?: { current?: string }
    content?: any[]
  }>
}

async function fetchBiographySection(slug: string): Promise<BiographySection | null> {
  const query = encodeURIComponent(`*[_type == "biographySection" && slug.current == "${slug}"][0]{
    _id,
    title,
    "slug": slug,
    description,
    content,
    "images": images[]{
      "asset": asset->url,
      alt,
      caption
    },
    "subsections": subsections[]{
      title,
      "slug": slug,
      content
    }
  }`)
  
  const url = `https://${sanityConfig.projectId}.api.sanity.io/v2021-10-21/data/query/${sanityConfig.dataset}?query=${query}`
  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) return null
  const json = await res.json()
  return (json.result ?? null) as BiographySection | null
}

export default async function BiographySectionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const section = await fetchBiographySection(slug)

  if (!section) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
        <main className="mx-auto max-w-3xl py-16 px-6">
          <h1 className="text-2xl font-semibold mb-6 text-black dark:text-zinc-50">Biography Section</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Section not found.</p>
          <Link href="/bio" className="mt-4 text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to Biography
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <main className="mx-auto max-w-3xl py-16 px-6">
        <Link href="/bio" className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
          ← Back to Biography
        </Link>

        <h1 className="text-3xl font-semibold mb-4 text-black dark:text-zinc-50">
          {section.title || "Untitled"}
        </h1>

        {section.description && (
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
            {section.description}
          </p>
        )}

        {section.content && section.content.length > 0 && (
          <div className="prose prose-zinc dark:prose-invert max-w-none mb-8">
            <BlockContent blocks={section.content} />
          </div>
        )}

        {section.images && section.images.length > 0 && (
          <div className="grid gap-4 my-8">
            {section.images.map((img, idx) => {
              const imageUrl = typeof img.asset === 'string' ? img.asset : img.asset?.url
              if (!imageUrl) return null
              return (
                <div key={idx}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={img.alt || `Image ${idx + 1}`}
                    className="w-full rounded-md"
                  />
                  {img.caption && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 text-center">
                      {img.caption}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {section.subsections && section.subsections.length > 0 && (
          <div className="mt-12">
            {section.subsections.map((subsection, idx) => (
              <div key={idx} className="mb-8">
                {subsection.title && (
                  <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">
                    {subsection.title}
                  </h2>
                )}
                {subsection.content && (
                  <div className="prose prose-zinc dark:prose-invert max-w-none">
                    <BlockContent blocks={subsection.content} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

