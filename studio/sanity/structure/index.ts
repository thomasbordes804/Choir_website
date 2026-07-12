import type { StructureResolver } from 'sanity/structure'
import type { StructureBuilder } from 'sanity/structure'

import {
  Gear,
  FileText,
  Palette,
  PaintBrush,
  Pencil,
  Cube,
  Package,
  Quotes,
  MusicNote,
  MusicNotes,
  MusicNotesPlus,
  Tag,
  BookOpen,
  Books,
  UsersThree,
  UserCircle,
  Calendar,
  CalendarCheck,
  Megaphone,
  MegaphoneSimple,
  Newspaper,
  ImageSquare,
  Image,
  Archive,
  Drop,
  TShirt,
  Flower,
  Signpost,
  Baby,
  UserSquare,
  PianoKeys,
  Table,
  Heart,
} from 'phosphor-react'

/**
 * A category that has subcategories (e.g. Peintures sur toiles → Natures mortes, Personnages…).
 * First level lists the subcategories, second level lists artworks in that subcategory.
 */
function categoryWithSubs(
  S: StructureBuilder,
  catId: string,
  docType: string,
  title: string,
  icon: React.ComponentType,
) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .child(
      S.documentList()
        .id(`${catId}-subs`)
        .title(title)
        .apiVersion('2024-01-01')
        .filter(`_type == "workCategory" && parent._ref == $parentId`)
        .params({ parentId: catId })
        .child((subCatId) =>
          S.documentList()
            .title(title)
            .apiVersion('2024-01-01')
            .filter(`_type == "${docType}" && $catId in categories[]._ref`)
            .params({ catId: subCatId })
        )
    )
}

/**
 * A flat category (no subcategories) — clicking it shows the artworks directly.
 */
function categoryFlat(
  S: StructureBuilder,
  catId: string,
  docType: string,
  title: string,
  icon: React.ComponentType,
) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .child(
      S.documentList()
        .id(`${catId}-list`)
        .title(title)
        .apiVersion('2024-01-01')
        .filter(`_type == "${docType}" && $catId in categories[]._ref`)
        .params({ catId })
    )
}

export const structure: StructureResolver = (S) =>
  S.list()
    .id('root')
    .title('Contenu')
    .items([
      // --- RÉGLAGES ---
      S.listItem()
        .title('Réglages')
        .icon(Gear)
        .child(
          S.list()
            .title('Réglages')
            .items([
              S.listItem()
                .title('Paramètres du site')
                .icon(Gear)
                .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
              S.documentTypeListItem('page').title('Pages').icon(FileText),
            ])
        ),

      // --- ŒUVRES ---
      S.listItem()
        .title('Œuvres')
        .icon(Palette)
        .child(
          S.list()
            .title('Œuvres')
            .items([
              S.documentTypeListItem('workCategory').title('Catégories').icon(Tag),
              S.divider(),
              // Exact order from artsparadise.net/works/
              categoryWithSubs(S, 'workCategory-paintings', 'painting', 'Peintures sur toiles', PaintBrush),
              categoryFlat(S, 'workCategory-drawings', 'drawing', 'Dessins, pastels et techniques mixtes', Pencil),
              categoryFlat(S, 'workCategory-harpsichord', 'painting', 'Peintures sur clavecin', PianoKeys),
              categoryFlat(S, 'workCategory-table', 'painting', 'Peintures sur table', Table),
              categoryFlat(S, 'workCategory-fabric', 'appliedArt', 'Impression sur tissu', TShirt),
              categoryFlat(S, 'workCategory-sculptures', 'sculpture', 'Sculptures', Cube),
              categoryFlat(S, 'workCategory-colorings', 'drawing', 'Coloriages pédagogiques et thérapeutiques', Flower),
              categoryFlat(S, 'workCategory-packages', 'appliedArt', 'Design de packagings', Package),
              categoryFlat(S, 'workCategory-perfume-bottles', 'appliedArt', 'Flacons de parfum', Drop),
              categoryFlat(S, 'workCategory-posters', 'appliedArt', 'Affiches événementielles', Signpost),
              categoryFlat(S, 'workCategory-poetry', 'poem', 'Poésies', Quotes),
              categoryFlat(S, 'workCategory-juvenilia', 'painting', 'Œuvres de jeunesse', Baby),
              categoryFlat(S, 'workCategory-portraits', 'painting', 'Portraits', UserSquare),
              S.divider(),
              S.documentTypeListItem('musicalWork').title('Œuvres musicales').icon(MusicNote),
            ])
        ),

      // --- BIOGRAPHIE & LIVRES ---
      S.listItem()
        .title('Biographie & livres')
        .icon(BookOpen)
        .child(
          S.list()
            .title('Biographie & livres')
            .items([
              S.documentTypeListItem('biographyTopic')
                .title('Chapitres de biographie')
                .icon(BookOpen),
              S.documentTypeListItem('book').title('Livres').icon(Books),
            ])
        ),

      // --- CHORALES & MUSIQUE ---
      S.listItem()
        .title('Chorales & musique')
        .icon(MusicNotes)
        .child(
          S.list()
            .title('Chorales & musique')
            .items([
              S.documentTypeListItem('choirGroup').title('Chorales').icon(UsersThree),
              S.documentTypeListItem('choirMember').title('Choristes').icon(UserCircle),
              S.divider(),
              S.documentTypeListItem('song').title('Chants').icon(MusicNote),
              S.documentTypeListItem('songCategory').title('Catégories de chants').icon(Tag),
              S.divider(),
              S.documentTypeListItem('event').title('Événements').icon(CalendarCheck),
              S.documentTypeListItem('rehearsal').title('Répétitions').icon(MusicNotesPlus),
            ])
        ),

      // --- ACTUALITÉS & COMMUNICATION ---
      S.listItem()
        .title('Actualités & communication')
        .icon(Megaphone)
        .child(
          S.list()
            .title('Actualités & communication')
            .items([
              S.documentTypeListItem('announcement').title('Actualités').icon(MegaphoneSimple),
              S.documentTypeListItem('pressItem').title('Parutions presse').icon(Newspaper),
              S.documentTypeListItem('gallery').title('Galeries photos').icon(ImageSquare),
            ])
        ),

      // --- DONS ---
      S.documentTypeListItem('donation').title('Dons (fresque des mécènes)').icon(Heart),

      S.divider(),

      // --- LEGACY (à migrer puis supprimer) ---
      S.listItem()
        .title('À migrer (ancien)')
        .icon(Archive)
        .child(
          S.list()
            .title('À migrer (ancien)')
            .items([
              S.documentTypeListItem('workSection').title("Anciennes sections d'œuvres").icon(FileText),
              S.documentTypeListItem('biographySection')
                .title('Anciennes sections de biographie')
                .icon(FileText),
            ])
        ),
    ])
