import React from "react"
import config from "../../studio/sanity.config"

type Song = { _id: string; title?: string; composer?: string }

async function fetchSongs(): Promise<Song[]> {
  const query = encodeURIComponent(`*[_type == "song"]{_id, title, composer}`)
  const url = `https://${config.projectId}.api.sanity.io/v2021-10-21/data/query/${config.dataset}?query=${query}`
  const res = await fetch(url)
  if (!res.ok) return []
  const json = await res.json()
  return (json.result ?? []) as Song[]
}

export default async function SongsPage() {
  const songs = await fetchSongs()

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <main className="mx-auto max-w-3xl py-16 px-6">
        <h1 className="text-2xl font-semibold mb-6 text-black dark:text-zinc-50">Songs</h1>

        {songs.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">No songs found.</p>
        ) : (
          <ul className="grid gap-2">
            {songs.map((s) => (
              <li key={s._id} className="rounded-md border bg-white p-4 dark:bg-[#0b0b0b] dark:border-white/10">
                <div className="font-medium text-black dark:text-zinc-50">{s.title ?? "Untitled"}</div>
                {s.composer && <div className="text-sm text-zinc-600 dark:text-zinc-400">{s.composer}</div>}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}