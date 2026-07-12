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

export type BiographyMediaImage = SanityImageAsset & { _type: "image"; _key?: string | null };
export type BiographyMediaVideo = VideoEmbedValue & { _type: "videoEmbed"; _key?: string | null };
export type BiographyMedia = BiographyMediaImage | BiographyMediaVideo;

export type BiographyTopicSummary = {
  _id: string;
  title: string | null;
  slug: string | null;
  eyebrow: string | null;
  summary: string | null;
  order: number | null;
  heroImage: SanityImageAsset | null;
  heroVideo: VideoEmbedValue | null;
  intro: PortableTextValue;
  relatedNews: AnnouncementSummary[];
};

export type BiographyTopicDetail = BiographyTopicSummary & {
  body: PortableTextValue;
  mediaGallery: BiographyMedia[];
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

export type AnnouncementSummary = {
  _id: string;
  title: string | null;
  slug: string | null;
  publishedAt: string | null;
  excerpt: string | null;
  body?: PortableTextValue; // Add body field
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

const biographyTopicsQuery = groq`
*[_type == "biographyTopic"] | order(coalesce(order, 999) asc, title asc) {
  _id,
  title,
  "slug": slug.current,
  eyebrow,
  summary,
  order,
  "heroImage": heroImage{
    "_type": "image",
    "url": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    "alt": coalesce(alt, asset->altText),
    "caption": coalesce(caption, asset->description)
  },
  "heroVideo": heroVideo{
    _type,
    title,
    url,
    platform,
    description,
    "poster": poster.asset->{
      url,
      "width": metadata.dimensions.width,
      "height": metadata.dimensions.height,
      "alt": null,
      "caption": null
    }
  },
  intro[0...3]{
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
  relatedNews[]->{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    "excerpt": pt::text(body)
  }
}`;

const biographyTopicBySlugQuery = groq`
*[_type == "biographyTopic" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  eyebrow,
  summary,
  order,
  "heroImage": heroImage{
    "_type": "image",
    "url": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height,
    "alt": coalesce(alt, asset->altText),
    "caption": coalesce(caption, asset->description)
  },
  "heroVideo": heroVideo{
    _type,
    title,
    url,
    platform,
    description,
    "poster": poster.asset->{
      url,
      "width": metadata.dimensions.width,
      "height": metadata.dimensions.height,
      "alt": null,
      "caption": null
    }
  },
  intro[]{
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
  body[]{
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
  "mediaGallery": mediaGallery[]{
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
  relatedNews[]->{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    "excerpt": pt::text(body)
  }
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

const booksPageQuery = groq`
*[_type == "page" && slug.current == "books"][0]{
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
  },
  "books": books[]{
    slug,
    coverImagePath,
    title,
    subtitle,
    authors,
    publisher,
    publicationDate,
    "galleryImages": galleryImages[]{
      url,
      alt,
      caption
    },
    description[]{
      ...,
      _type == "image" => {
        ...,
        "url": asset->url,
        "width": asset->metadata.dimensions.width,
        "height": asset->metadata.dimensions.height,
        "alt": coalesce(alt, asset->altText),
        "caption": coalesce(caption, asset->description)
      }
    },
    additionalContent[]{
      ...,
      _type == "image" => {
        ...,
        "url": asset->url,
        "width": asset->metadata.dimensions.width,
        "height": asset->metadata.dimensions.height,
        "alt": coalesce(alt, asset->altText),
        "caption": coalesce(caption, asset->description)
      }
    },
    "coverImage": coverImage{
      "url": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height,
      "alt": coalesce(alt, asset->altText)
    },
    "purchaseLinks": purchaseLinks[]{
      label,
      url
    }
  }
}`;

export async function getBooksPage() {
  return sanityFetch<{
    _id: string;
    title: string | null;
    description: string | null;
    content: PortableTextValue;
    books: Array<{
      slug?: string;
      coverImagePath?: string;
      title: string;
      subtitle?: string;
      authors?: string[];
      publisher?: string;
      publicationDate?: string;
      galleryImages?: Array<{
        url: string;
        alt?: string;
        caption?: string;
      }>;
      description: PortableTextValue;
      additionalContent?: PortableTextValue;
      coverImage?: {
        url: string;
        width: number;
        height: number;
        alt?: string;
      };
      purchaseLinks?: Array<{
        label: string;
        url: string;
      }>;
    }>;
  } | null>(booksPageQuery, {}, { 
    revalidate: 0,
    tags: ["books", "page"] 
  });
}

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

const worksSectionBySlugQuery = groq`
*[_type == "workSection" && slug.current == $slug][0] {
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

export type WorksSectionDetail = {
  _id: string;
  title: string | null;
  slug: string | null;
  description: string | null;
  order: number | null;
  content: PortableTextValue;
  images: Array<{
    url: string;
    width: number;
    height: number;
    alt?: string;
    caption?: string;
  }>;

subsections: Array<{
    title: string;
    slug: string | null;
    content: PortableTextValue;
  }>;
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

export function getWorksSectionBySlug(slug: string) {
  return sanityFetch<WorksSectionDetail | null>(worksSectionBySlugQuery, { slug }, { 
    revalidate: 0, // Force revalidation
    tags: ["works"] 
  });
}

export async function getBookBySlug(slug: string) {
  const booksPage = await getBooksPage();
  const books = booksPage?.books || [];
  
  const book = books.find((b: any) => b.slug === slug);
  
  if (!book) {
    return null;
  }

  return {
    ...book,
    coverImagePath: book.coverImagePath || book.coverImage?.url,
  };
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

export function getBiographyTopics() {
  return sanityFetch<BiographyTopicSummary[]>(biographyTopicsQuery, {}, { ...defaultOptions, tags: ["biography"] });
}

export function getBiographyTopicBySlug(slug: string) {
  return sanityFetch<BiographyTopicDetail | null>(biographyTopicBySlugQuery, { slug }, { ...defaultOptions, tags: ["biography"] });
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
