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

export type AnnouncementSummary = {
  _id: string;
  title: string | null;
  slug: string | null;
  publishedAt: string | null;
  excerpt: string | null;
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
  body
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

export function getSiteSettings() {
  return sanityFetch<SiteSettings | null>(siteSettingsQuery, {}, { revalidate: 120, tags: ["settings"] });
}
