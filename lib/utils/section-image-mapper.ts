import { FOLDER_IMAGES, getFolderForSubsection, getImagesFromFolder } from './public-assets';

/**
 * Same category matching as getSectionImagePaths, but returns the FULL set of
 * images available for the section instead of capping at 4. Used by the
 * museum-style gallery on the works index page, which wants every piece in
 * each subsection rather than a small preview set.
 */
export function getFullSectionImagePaths(sectionSlug: string | null, sectionTitle: string | null): string[] {
  const slug = sectionSlug?.toLowerCase() || '';
  const title = sectionTitle?.toLowerCase() || '';
  const combined = `${slug} ${title}`.toLowerCase();

  const matches = (key: string) => combined.includes(key.toLowerCase());

  if (matches('sucy-en-brie') || (matches('sucy') && !matches('bondy') && !matches('orly'))) {
    return getImagesFromFolder(FOLDER_IMAGES.org, 4).slice(0, 4);
  }

  if (matches('bondy')) {
    return getImagesFromFolder(FOLDER_IMAGES.org, 8).slice(4, 8);
  }

  if (matches('orly')) {
    return getImagesFromFolder(FOLDER_IMAGES.org, 12).slice(8, 12);
  }

  if (matches('chants') || matches('chant') || matches('musicales') || (matches('musique') && !matches('portrait'))) {
    return getImagesFromFolder(FOLDER_IMAGES.compositionMusicales);
  }

  if (matches('ecriture') || matches('poesies') || matches('poésie') || matches('poesie')) {
    return getImagesFromFolder(FOLDER_IMAGES.poesies);
  }

  if (matches('dessin') || matches('dessins')) {
    return getImagesFromFolder(FOLDER_IMAGES.dessinsPastels);
  }

  if ((matches('peinture') || matches('peintures')) && !matches('toile') && !matches('clavecin') && !matches('table')) {
    return [
      ...getImagesFromFolder(FOLDER_IMAGES.personnages),
      ...getImagesFromFolder(FOLDER_IMAGES.naturesMortes),
    ];
  }

  if (matches('sculpture') || matches('scultures')) {
    return getImagesFromFolder(FOLDER_IMAGES.scultures);
  }

  if (matches('impression') && matches('tissu')) {
    return getImagesFromFolder(FOLDER_IMAGES.impressionTissu);
  }

  if (matches('coloriage') || matches('coloriages')) {
    return getImagesFromFolder(FOLDER_IMAGES.coloriages);
  }

  if (matches('design') && (matches('packaging') || matches('packagings'))) {
    return getImagesFromFolder(FOLDER_IMAGES.designPackagings);
  }

  if (matches('flacon') || matches('parfums') || matches('parfum')) {
    return getImagesFromFolder(FOLDER_IMAGES.flaconParfums);
  }

  if (matches('affiche') || matches('évènementiel') || matches('evenementiel')) {
    return getImagesFromFolder(FOLDER_IMAGES.affichesEvenementielles);
  }

  if (matches('table') && matches('peinture')) {
    return getImagesFromFolder(FOLDER_IMAGES.peinturesSurTable);
  }

  if (matches('jeunesse') || matches('jeune')) {
    return getImagesFromFolder(FOLDER_IMAGES.oeuvresJeunesse);
  }

  if (matches('portraits') || matches('portrait')) {
    return getImagesFromFolder(FOLDER_IMAGES.portraits);
  }

  const folderConfig = getFolderForSubsection(title || slug);
  if (folderConfig) {
    return getImagesFromFolder(folderConfig);
  }

  return [];
}
