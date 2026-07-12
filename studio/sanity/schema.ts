// sanity/schema.ts

// --- Reusable objects ---
import captionedImage from './schemas/captionedImage'
import purchaseLink from './schemas/purchaseLink'
import videoEmbed from './schemas/videoEmbed'

// --- Config & generic ---
import siteSettings from './schemas/siteSettings'
import page from './schemas/page'

// --- Œuvres (taxonomy + artwork types) ---
import workCategory from './schemas/workCategory'
import painting from './schemas/painting'
import drawing from './schemas/drawing'
import sculpture from './schemas/sculpture'
import appliedArt from './schemas/appliedArt'
import poem from './schemas/poem'
import musicalWork from './schemas/musicalWork'

// --- Biography & books ---
import biographyTopic from './schemas/biographyPage'
import biographySubSection from './schemas/biographySubSection'
import book from './schemas/book'

// --- Choirs & music ---
import event from './schemas/event'
import rehearsal from './schemas/rehearsal'
import choirMember from './schemas/choirMember'
import choirGroup from './schemas/choirGroup'
import song from './schemas/song'
import songCategory from './schemas/songCategory'

// --- News & communication ---
import announcement from './schemas/announcement'
import pressItem from './schemas/pressItem'
import gallery from './schemas/gallery'

// --- Support / donations ---
import donation from './schemas/donation'

// --- Legacy (kept until data is migrated, then delete) ---
import workSection from './schemas/workSection'
import biographySection from './schemas/biographySection'

export const schemaTypes = [
  // Reusable objects
  captionedImage,
  purchaseLink,
  videoEmbed,

  // Config & generic
  siteSettings,
  page,

  // Œuvres
  workCategory,
  painting,
  drawing,
  sculpture,
  appliedArt,
  poem,
  musicalWork,

  // Biography & books
  biographyTopic,
  biographySubSection,
  book,

  // Choirs & music
  event,
  rehearsal,
  choirMember,
  choirGroup,
  song,
  songCategory,

  // News & communication
  announcement,
  pressItem,
  gallery,

  // Support / donations
  donation,

  // Legacy — to migrate then remove
  workSection,
  biographySection,
]
