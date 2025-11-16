import React from "react"
import config from "../../studio/sanity.config"

type Member = { _id: string; name?: string; role?: string; imageUrl?: string }

async function fetchChoirMembers(): Promise<Member[]> {
  const query = encodeURIComponent(`*[_type == "choirMember"]{_id, name, role, "imageUrl": image.asset->url}`)
  const url = `https://${config.projectId}.api.sanity.io/v2021-10-21/data/query/${config.dataset}?query=${query}`
  const res = await fetch(url)
  if (!res.ok) return []
  const json = await res.json()
  return (json.result ?? []) as Member[]
}

export default async function ChoirPage() {
  const members = await fetchChoirMembers()

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <main className="mx-auto max-w-3xl py-16 px-6">
        <h1 className="text-2xl font-semibold mb-6 text-black dark:text-zinc-50">Choir Members</h1>

        {members.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">No choir members found.</p>
        ) : (
          <ul className="grid gap-4">
            {members.map((m) => (
              <li key={m._id} className="flex items-center gap-4 rounded-md border bg-white p-4 dark:bg-[#0b0b0b] dark:border-white/10">
                {m.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.imageUrl} alt={m.name ?? "choir member"} width={64} height={64} className="h-16 w-16 rounded-md object-cover" />
                ) : (
                  <div className="h-16 w-16 rounded-md bg-zinc-100 dark:bg-zinc-800" />
                )}
                <div>
                  <div className="font-medium text-black dark:text-zinc-50">{m.name ?? "Unnamed"}</div>
                  {m.role && <div className="text-sm text-zinc-600 dark:text-zinc-400">{m.role}</div>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}