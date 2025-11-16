import type { StructureResolver } from 'sanity/structure'

import {
  Gear,
  FileText,
  Calendar,
  CalendarCheck,
  MusicNotesPlus,
  MusicNote,
  MusicNotes,
  Tag,
  Users,
  UsersThree,
  UserCircle,
  Megaphone,
  MegaphoneSimple,
  Image,
  ImageSquare,
} from 'phosphor-react'

export const structure: StructureResolver = (S) =>
  S.list()
    .id('root')
    .title('Content')
    .items([
      // --- GENERAL ---
      S.listItem()
        .title('General')
        .icon(Gear)
        .child(
          S.list()
            .title('General')
            .items([
              S.listItem()
                .title('Site Settings')
                .icon(Gear)
                .child(
                  S.document()
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
                ),

              S.documentTypeListItem('page')
                .title('Pages')
                .icon(FileText),
            ])
        ),

      // --- PLANNING ---
      S.listItem()
        .title('Planning')
        .icon(Calendar)
        .child(
          S.list()
            .title('Planning')
            .items([
              S.documentTypeListItem('event')
                .title('Events')
                .icon(CalendarCheck),

              S.documentTypeListItem('rehearsal')
                .title('Rehearsals')
                .icon(MusicNotesPlus),
            ])
        ),

      // --- MUSIC ---
      S.listItem()
        .title('Music')
        .icon(MusicNotes)
        .child(
          S.list()
            .title('Music')
            .items([
              S.documentTypeListItem('song')
                .title('Songs')
                .icon(MusicNote),

              S.documentTypeListItem('songCategory')
                .title('Song Categories')
                .icon(Tag),
            ])
        ),

      // --- PEOPLE ---
      S.listItem()
        .title('People')
        .icon(Users)
        .child(
          S.list()
            .title('People')
            .items([
              S.documentTypeListItem('choirGroup')
                .title('Choir Groups')
                .icon(UsersThree),

              S.documentTypeListItem('choirMember')
                .title('Choir Members')
                .icon(UserCircle),
            ])
        ),

      // --- NEWS ---
      S.listItem()
        .title('News')
        .icon(Megaphone)
        .child(
          S.list()
            .title('News')
            .items([
              S.documentTypeListItem('announcement')
                .title('Announcements')
                .icon(MegaphoneSimple),
            ])
        ),

      // --- MEDIA ---
      S.listItem()
        .title('Media')
        .icon(Image) // ✔️ this icon exists
        .child(
          S.list()
            .title('Media')
            .items([
              S.documentTypeListItem('gallery')
                .title('Photo Galleries')
                .icon(ImageSquare), // ✔️ valid
            ])
        ),
    ])
