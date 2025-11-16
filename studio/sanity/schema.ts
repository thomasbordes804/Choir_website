// sanity/schema.ts
import siteSettings from './schemas/siteSettings'
import page from './schemas/page'
import event from './schemas/event'
import rehearsal from './schemas/rehearsal'
import choirMember from './schemas/choirMember'
import choirGroup from './schemas/choirGroup'
import song from './schemas/song'
import songCategory from './schemas/songCategory'
import announcement from './schemas/announcement'
import gallery from './schemas/gallery'

export const schemaTypes = [
  siteSettings,
  page,
  event,
  rehearsal,
  choirMember,
  choirGroup,
  song,
  songCategory,
  announcement,
  gallery,
]
