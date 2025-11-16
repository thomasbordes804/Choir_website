'use client'

import React from "react"
import Link from "next/link"
import config from "../studio/sanity.config"

async function fetchCounts() {
  const queries = {
    choir: encodeURIComponent(`*[_type == "choirMember"]{_id}`),
    songs: encodeURIComponent(`*[_type == "song"]{_id}`),
    events: encodeURIComponent(`*[_type == "event"]{_id}`)
  }

  async function q(qs: string) {
    const url = `https://${config.projectId}.api.sanity.io/v2021-10-21/data/query/${config.dataset}?query=${qs}`
    const res = await fetch(url)
    if (!res.ok) return []
    const json = await res.json()
    return json.result ?? []
  }

  const [choir, songs, events] = await Promise.all([q(queries.choir), q(queries.songs), q(queries.events)])
  return { choir: choir.length, songs: songs.length, events: events.length }
}

export default async function Home() {
  const counts = await fetchCounts()

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <main className="mx-auto max-w-3xl py-16 px-6">
        <h1 className="text-3xl font-semibold mb-6 text-black dark:text-zinc-50">Church Choir</h1>

        <div className="grid gap-4">
          <Link href="/choir" className="block rounded-md border bg-white p-6 dark:bg-[#0b0b0b] dark:border-white/10">
            <div className="text-lg font-medium text-black dark:text-zinc-50">Choir Members</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">{counts.choir} members</div>
          </Link>

          <Link href="/songs" className="block rounded-md border bg-white p-6 dark:bg-[#0b0b0b] dark:border-white/10">
            <div className="text-lg font-medium text-black dark:text-zinc-50">Songs</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">{counts.songs} songs</div>
          </Link>

          <Link href="/events" className="block rounded-md border bg-white p-6 dark:bg-[#0b0b0b] dark:border-white/10">
            <div className="text-lg font-medium text-black dark:text-zinc-50">Events</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">{counts.events} events</div>
          </Link>
        </div>
      </main>
    </div>
  )
}
// ...existing code...