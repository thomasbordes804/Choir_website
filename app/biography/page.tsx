import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { RichText } from "@/components/ui/rich-text";
import { VideoEmbed } from "@/components/ui/video-embed";
import {
  getBiographyPage,
  getSiteSettings,
  type AnnouncementSummary,
  type BiographyMedia,
  type BiographySection,
} from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Biography",
  description: "Informations biographiques sur Michel Hilger, altiste-peintre et musicien au service des communautés.",
};

const relatedNewsDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
});

const truncateText = (value: string | null | undefined, limit = 160) => {
  if (!value) return null;
  return value.length > limit ? `${value.slice(0, limit)}…` : value;
};

const introductionParagraphs: string[] = [
  "Informations biographiques sur Michel Hilger. Vous trouverez principalement dans cette section des informations biographiques et bien plus encore sur l'altiste-peintre Michel Hilger.",
  "Du Festival Grand Pari's en Chœurs dans l'harmonie à ses apparitions « Michel Hilger à l'orgue », cette biographie éclaire un musicien qui conjugue alto, orgue et peinture au service des communautés.",
  "Les sections « Restauration d'orgues avec Art au Pluriel », « Animations en maisons de retraite », « Curriculum Vitae », « Entretiens », « Associations », « Chorales », « Orchestres », « Festivals », « Enregistrements musicaux », « Enseignements » et « Enfance » complètent le portrait d'un artiste généreux et engagé.",
];

const biographyHighlights: Array<{ title: string; description: string }> = [
  {
    title: "Festival Grand Pari's en Chœurs dans l'harmonie",
    description: "Chronique la participation de Michel Hilger à ce rendez-vous choral parisien, entre direction et arrangements inspirés.",
  },
  {
    title: "Michel Hilger à l'orgue",
    description: "Met en lumière son jeu d'organiste, reliant liturgie, improvisation et répertoires contemporains.",
  },
  {
    title: "Restauration d'orgues avec Art au Pluriel",
    description: "Retrace le travail mené aux côtés du collectif Art au Pluriel pour redonner voix à des instruments historiques.",
  },
  {
    title: "Animations en maisons de retraite",
    description: "Évoque les moments de partage musical offerts aux résidents de maisons de retraite.",
  },
  {
    title: "Curriculum Vitae",
    description: "Détaille un parcours jalonné d'études, de rencontres et de créations marquantes.",
  },
  {
    title: "Entretiens",
    description: "Regroupe les entretiens qui dévoilent sa vision artistique et spirituelle.",
  },
  {
    title: "Associations",
    description: "Présente les associations culturelles et solidaires auxquelles il apporte son énergie.",
  },
  {
    title: "Chorales",
    description: "Recense les chœurs accompagnés, formés ou dirigés par Michel Hilger.",
  },
  {
    title: "Orchestres",
    description: "Met en valeur ses collaborations orchestrales et ses projets de musique de chambre.",
  },
  {
    title: "Festivals",
    description: "Liste les festivals où son alto et ses projets ont résonné.",
  },
  {
    title: "Enregistrements musicaux",
    description: "Archive les captations et albums qui témoignent de son timbre singulier.",
  },
  {
    title: "Enseignements",
    description: "Décrit ses engagements pédagogiques, ateliers et masterclasses.",
  },
  {
    title: "Enfance",
    description: "Revient sur les premières années et les influences familiales qui l'ont conduit vers l'alto et la peinture.",
  },
];


export default async function BiographyPage() {
  const [biography, siteSettings] = await Promise.all([
    getBiographyPage(),
    getSiteSettings(),
  ]);

  const hasRichContent = Boolean(biography?.content && biography.content.length > 0);
  const pageTitle = biography?.title ?? siteSettings?.churchName ?? "Biography";
  const pageDescription =
    siteSettings?.tagline ??
    "Explorez le parcours et les engagements artistiques de Michel Hilger.";

  return (
    <PageShell
      eyebrow="Michel Hilger"
      title={pageTitle}
      description={pageDescription}
    >
      <div className="space-y-10">
        <section className="space-y-4 text-base leading-7 text-zinc-700 dark:text-zinc-200">
          {introductionParagraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </section>

        {hasRichContent ? (
          <RichText
            value={biography?.content ?? []}
            className="text-base leading-7 text-zinc-700 dark:text-zinc-200"
          />
        ) : (
          <EmptyState
            title="Biographie détaillée à enrichir"
            description="Ajoutez du contenu structuré dans la page « biography » du Sanity Studio pour prolonger cette présentation."
            action={
              <Link
                href="/studio"
                className="inline-flex items-center rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-[color:var(--accent-foreground)]"
              >
                Ouvrir le Studio
              </Link>
            }
          />
        )}

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Biographie en un coup d’œil
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              Retrouvez les repères essentiels de la carrière et des engagements de Michel Hilger.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {biographyHighlights.map((highlight, index) => {
              const indexLabel = (index + 1).toString().padStart(2, "0");

              return (
                <div
                  key={highlight.title}
                  className="group relative overflow-hidden rounded-3xl border border-white/50 bg-white/80 p-5 shadow-md shadow-indigo-500/10 transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[rgba(15,23,42,0.6)]"
                >
                  <div
                    className="absolute inset-0 -z-10 bg-gradient-to-br from-white/40 via-transparent to-indigo-200/30 opacity-80 transition group-hover:opacity-100 dark:from-indigo-500/20 dark:via-transparent dark:to-slate-900/30"
                    aria-hidden
                  />
                  <div className="relative space-y-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700 shadow-sm dark:bg-white/10 dark:text-indigo-200">
                      {indexLabel}
                    </span>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {highlight.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </PageShell>
  );
}

