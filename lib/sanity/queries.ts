import { groq } from "next-sanity";

import { sanityFetch, type SanityFetchOptions } from "./client";

export type PortableTextValue = Array<Record<string, unknown>>;

export type SummaryCounts = {
  choirCount: number;
  songCount: number;
  eventCount: number;
};

export type ChoirMember = {
  _id: string;
  name: string | null;
  role: string | null;
  image: {
    url: string;
    width: number | null;
    height: number | null;
  } | null;
};

export type Song = {
  _id: string;
  title: string | null;
  composer: string | null;
  categories: string[];
};

export type Event = {
  _id: string;
  title: string | null;
  date: string | null;
  location: string | null;
  description: string | null;
};

export type Announcement = {
  _id: string;
  title: string | null;
  slug: string | null;
  publishedAt: string | null;
  highlight: boolean;
  excerpt: string | null;
  body: PortableTextValue;
};

export type SiteSettings = {
  siteTitle: string | null;
  tagline: string | null;
  churchName: string | null;
  homepageHeroTitle: string | null;
  homepageHeroSubtitle: string | null;
  homepageHeroImage: {
    url: string;
    width: number | null;
    height: number | null;
  } | null;
  featuredEvent: Event | null;
};

export type SanityImageAsset = {
  url: string;
  width: number | null;
  height: number | null;
  alt: string | null;
  caption?: string | null;
};

export type VideoEmbedValue = {
  _type: "videoEmbed";
  title: string | null;
  url: string | null;
  platform: string | null;
  description?: string | null;
  poster?: SanityImageAsset | null;
};

export type BiographySection = {
  _id: string;
  title: string | null;
  slug: string | null;
  description: string | null;
  order: number | null;
  content?: PortableTextValue;
  images?: Array<{
    url: string;
    width: number | null;
    height: number | null;
    alt: string | null;
    caption: string | null;
  }>;
  subsections?: Array<{
    title: string | null;
    slug: string | null;
    content: PortableTextValue;
  }>;
};

export type BiographyPage = {
  _id: string;
  title: string | null;
  content: PortableTextValue;
};

const defaultOptions: SanityFetchOptions = {
  revalidate: 300,
};

const summaryQuery = groq`
{
  "choirCount": count(*[_type == "choirMember"]),
  "songCount": count(*[_type == "song"]),
  "eventCount": count(*[_type == "event"])
}`;

const choirMembersQuery = groq`
*[_type == "choirMember"] | order(name asc) {
  _id,
  name,
  role,
  "image": image.asset->{
    url,
    "width": metadata.dimensions.width,
    "height": metadata.dimensions.height
  }
}`;

const songsQuery = groq`
*[_type == "song"] | order(title asc) {
  _id,
  title,
  composer,
  "categories": coalesce(categories[]->title, [])
}`;

const eventsQuery = groq`
*[_type == "event"] | order(coalesce(date, now()) asc)[0...$limit] {
  _id,
  title,
  date,
  location,
  description
}`;

const highlightedAnnouncementsQuery = groq`
*[_type == "announcement" && highlight == true] | order(coalesce(publishedAt, _createdAt) desc)[0...$limit] {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  highlight,
  "excerpt": pt::text(body),
  body
}`;

const announcementsQuery = groq`
*[_type == "announcement"] | order(coalesce(publishedAt, _createdAt) desc)[0...$limit] {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  highlight,
  "excerpt": pt::text(body),
  body  // Make sure body is included
}`;

const biographyPageQuery = groq`
*[_type == "page" && slug.current == "biography"][0]{
  _id,
  title,
  content[]
}`;

const biographySectionsQuery = groq`
*[_type == "biographySection"] | order(coalesce(order, 999) asc, title asc) {
  _id,
  title,
  "slug": slug.current,
  description,
  order
}`;

const biographySectionBySlugQuery = groq`
*[_type == "biographySection" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  description,
  order,
  content[]{
    ...,
    _type == "image" => {
      ...,
      "url": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height,
      "alt": coalesce(alt, asset->altText),
      "caption": coalesce(caption, asset->description)
    },
    _type == "videoEmbed" => {
      ...,
      "poster": poster.asset->{
        url,
        "width": metadata.dimensions.width,
        "height": metadata.dimensions.height,
        "alt": null,
        "caption": null
      }
    }
  },
  "images": images[]{
    "url": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    "alt": coalesce(alt, asset->altText),
    "caption": caption
  },
  "subsections": subsections[]{
    title,
    "slug": slug.current,
    content[]{
      ...,
      _type == "image" => {
        ...,
        "url": asset->url,
        "width": asset->metadata.dimensions.width,
        "height": asset->metadata.dimensions.height,
        "alt": coalesce(alt, asset->altText),
        "caption": coalesce(caption, asset->description)
      },
      _type == "videoEmbed" => {
        ...,
        "poster": poster.asset->{
          url,
          "width": metadata.dimensions.width,
          "height": metadata.dimensions.height,
          "alt": null,
          "caption": null
        }
      }
    }
  }
}`;

const siteSettingsQuery = groq`
*[_type == "siteSettings"][0]{
  siteTitle,
  tagline,
  churchName,
  homepageHeroTitle,
  homepageHeroSubtitle,
  "homepageHeroImage": homepageHeroImage.asset->{
    url,
    "width": metadata.dimensions.width,
    "height": metadata.dimensions.height
  },
  featuredEvent->{
    _id,
    title,
    date,
    location,
    description
  }
}`;

const videosPageQuery = groq`
*[_type == "page" && slug.current == "videos"][0]{
  _id,
  title,
  description,
  content[]{
    ...,
    _type == "image" => {
      ...,
      "url": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height,
      "alt": coalesce(alt, asset->altText),
      "caption": coalesce(caption, asset->description)
    },
    _type == "videoEmbed" => {
      ...,
      "poster": poster.asset->{
        url,
        "width": metadata.dimensions.width,
        "height": metadata.dimensions.height,
        "alt": null,
        "caption": null
      }
    }
  }
}`;

const worksPageQuery = groq`
*[_type == "page" && slug.current == "works"][0]{
  _id,
  title,
  content[]
}`;

const worksSectionsQuery = groq`
*[_type == "workSection"] | order(coalesce(order, 999) asc, title asc) {
  _id,
  title,
  "slug": slug.current,
  description,
  order
}`;

export type WorksPage = {
  _id: string;
  title: string | null;
  content: PortableTextValue;
};

export type WorksSection = {
  _id: string;
  title: string | null;
  slug: string | null;
  description: string | null;
  order: number | null;
};

export function getWorksPage() {
  return sanityFetch<WorksPage | null>(worksPageQuery, {}, { 
    revalidate: 0, // Force revalidation
    tags: ["works", "page"] 
  });
}

export function getWorksSections() {
  return sanityFetch<WorksSection[]>(worksSectionsQuery, {}, { 
    revalidate: 0, // Force revalidation
    tags: ["works"] 
  });
}

export async function getVideosPage() {
  return sanityFetch<{
    _id: string;
    title: string | null;
    description: string | null;
    content: PortableTextValue;
  } | null>(videosPageQuery);
}

export function getSummaryCounts() {
  return sanityFetch<SummaryCounts>(summaryQuery, {}, { revalidate: 60, tags: ["choir", "songs", "events"] });
}

export function getChoirMembers() {
  return sanityFetch<ChoirMember[]>(choirMembersQuery, {}, { ...defaultOptions, tags: ["choir"] });
}

export function getSongs() {
  return sanityFetch<Song[]>(songsQuery, {}, { ...defaultOptions, tags: ["songs"] });
}

export function getEvents(limit = 20) {
  return sanityFetch<Event[]>(eventsQuery, { limit }, { ...defaultOptions, tags: ["events"] });
}

export function getHighlightedAnnouncements(limit = 3) {
  return sanityFetch<Announcement[]>(highlightedAnnouncementsQuery, { limit }, { ...defaultOptions, tags: ["announcements"] });
}

export function getAnnouncements(limit = 24) {
  return sanityFetch<Announcement[]>(announcementsQuery, { limit }, { ...defaultOptions, tags: ["announcements"] });
}

export function getBiographyPage() {
  return sanityFetch<BiographyPage | null>(biographyPageQuery, {}, { ...defaultOptions, tags: ["biography", "page"] });
}

export function getBiographySections() {
  return sanityFetch<BiographySection[]>(biographySectionsQuery, {}, { ...defaultOptions, tags: ["biography"] });
}

export function getBiographySectionBySlug(slug: string) {
  return sanityFetch<BiographySection | null>(biographySectionBySlugQuery, { slug }, { ...defaultOptions, tags: ["biography"] });
}

export function getSiteSettings() {
  return sanityFetch<SiteSettings | null>(siteSettingsQuery, {}, { revalidate: 120, tags: ["settings"] });
}

// --- Poems (works gallery poetry reading panel) ---
// See studio/sanity/schemas/poem.ts

export type Poem = {
  _id: string;
  title: string | null;
  slug: string | null;
  dedication: string | null;
  year: number | null;
  /** Flattened plain text of the portable-text body, one verse per line. */
  bodyText: string | null;
  /** Optional recorded reading uploaded in the Studio; falls back to
   *  browser text-to-speech when absent. */
  audioUrl: string | null;
};

const poemsQuery = groq`
*[_type == "poem"] | order(coalesce(year, 9999) asc, title asc) {
  _id,
  title,
  "slug": slug.current,
  dedication,
  year,
  "bodyText": pt::text(body),
  "audioUrl": audio.asset->url
}`;

export function getPoems() {
  return sanityFetch<Poem[]>(poemsQuery, {}, { ...defaultOptions, tags: ["poems"] });
}

// --- Donations ("la fresque des mécènes" on /don) ---
// See studio/sanity/schemas/donation.ts

export type Donation = {
  _id: string;
  donorName: string | null;
  amount: number;
  tier: "esquisse" | "pigment" | "fresque" | null;
  color: string;
  donatedAt: string | null;
};

const donationsQuery = groq`
*[_type == "donation"] | order(coalesce(donatedAt, _createdAt) asc) {
  _id,
  donorName,
  amount,
  tier,
  color,
  donatedAt
}`;

export function getDonations() {
  return sanityFetch<Donation[]>(donationsQuery, {}, { ...defaultOptions, tags: ["donations"] });
}
