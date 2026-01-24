import React from "react"
import Link from "next/link"
import { sanityConfig } from "@/lib/sanity/config"

type BiographySection = {
  _id: string
  title?: string
  slug?: { current?: string }
  description?: string
  order?: number
}

type BiographyPage = {
  title?: string
  description?: string
  sections?: BiographySection[]
  imageUrl?: string
}

async function fetchBiographyPage(): Promise<BiographyPage | null> {
  const query = encodeURIComponent(`*[_type == "biographyPage"][0]{
    title,
    description,
    "imageUrl": image.asset->url,
    "sections": sections[]->{
      _id,
      title,
      "slug": slug,
      description,
      order
    } | order(order asc)
  }`)
  
  const url = `https://${sanityConfig.projectId}.api.sanity.io/v2021-10-21/data/query/${sanityConfig.dataset}?query=${query}`
  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) return null
  const json = await res.json()
  return (json.result ?? null) as BiographyPage | null
}

export default async function BiographyPage() {
  const bioPage = await fetchBiographyPage()

  if (!bioPage) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
        <main className="mx-auto max-w-3xl py-16 px-6">
          <h1 className="text-2xl font-semibold mb-6 text-black dark:text-zinc-50">Biography</h1>
          <p className="text-zinc-600 dark:text-zinc-400">No biography content found.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <main className="mx-auto max-w-3xl py-16 px-6">
        <h1 className="text-2xl font-semibold mb-6 text-black dark:text-zinc-50">
          {bioPage.title || "Biography"}
        </h1>

        {bioPage.description && (
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            {bioPage.description}
          </p>
        )}

        {bioPage.sections && bioPage.sections.length > 0 ? (
          <ul className="grid gap-2 mb-8">
            {bioPage.sections.map((section) => {
              const slug = section.slug?.current
              if (!slug) return null
              
              return (
                <li key={section._id}>
                  <Link
                    href={`/bio/${slug}`}
                    className="block rounded-md border bg-white p-4 dark:bg-[#0b0b0b] dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <div className="font-medium text-black dark:text-zinc-50">
                      {section.title || "Untitled"}
                    </div>
                    {section.description && (
                      <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                        {section.description}
                      </div>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">No biography sections found.</p>
        )}

        {bioPage.imageUrl && (
          <div className="mt-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bioPage.imageUrl}
              alt="Biography"
              className="w-full rounded-md"
            />
          </div>
        )}
      </main>
    </div>
  )
}

