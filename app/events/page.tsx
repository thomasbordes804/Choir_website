import React from "react"
import config from "../../studio/sanity.config"

type Event = { _id: string; title?: string; date?: string; location?: string }

async function fetchEvents(): Promise<Event[]> {
  const query = encodeURIComponent(`*[_type == "event"]{_id, title, date, location}`)
  const url = `https://${config.projectId}.api.sanity.io/v2021-10-21/data/query/${config.dataset}?query=${query}`
  const res = await fetch(url)
  if (!res.ok) return []
  const json = await res.json()
  return (json.result ?? []) as Event[]
}

export default async function EventsPage() {
  const events = await fetchEvents()

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <main className="mx-auto max-w-3xl py-16 px-6">
        <h1 className="text-2xl font-semibold mb-6 text-black dark:text-zinc-50">Events</h1>

        {events.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">No events found.</p>
        ) : (
          <ul className="grid gap-2">
            {events.map((e) => (
              <li key={e._id} className="rounded-md border bg-white p-4 dark:bg-[#0b0b0b] dark:border-white/10">
                <div className="font-medium text-black dark:text-zinc-50">{e.title ?? "Untitled event"}</div>
                {e.date && <div className="text-sm text-zinc-600 dark:text-zinc-400">{e.date}</div>}
                {e.location && <div className="text-sm text-zinc-600 dark:text-zinc-400">{e.location}</div>}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}