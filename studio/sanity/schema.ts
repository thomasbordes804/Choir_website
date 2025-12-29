// sanity/schema.ts
import siteSettings from './schemas/siteSettings'
import page from './schemas/page'
import biographyTopic from './schemas/biographyPage'

import event from './schemas/event'
import rehearsal from './schemas/rehearsal'
import choirMember from './schemas/choirMember'
import choirGroup from './schemas/choirGroup'
import song from './schemas/song'
import songCategory from './schemas/songCategory'
import announcement from './schemas/announcement'
import gallery from './schemas/gallery'
import videoEmbed from './schemas/videoEmbed'

export const schemaTypes = [
  siteSettings,
    page,
  biographyTopic,

  event,
  rehearsal,
  choirMember,
  choirGroup,
  song,
  songCategory,
  announcement,
  gallery,
  videoEmbed,
]

