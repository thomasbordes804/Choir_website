import { FOLDER_IMAGES, getFolderForSubsection } from './public-assets';

export function getImagesFromFolder(
  folderConfig: { 
    basePath: string; 
    files?: readonly string[]; 
    pattern?: (i: number) => string; 
    count?: number;
  },
  limit?: number
): string[] {
  if (folderConfig.files) {
    const files = limit ? folderConfig.files.slice(0, limit) : folderConfig.files;
    return files.map(file => `${folderConfig.basePath}/${file}`);
  }

  if (folderConfig.pattern && folderConfig.count) {
    const count = limit ? Math.min(limit, folderConfig.count) : folderConfig.count;
    const pattern = folderConfig.pattern;
    return Array.from({ length: count }, (_, i) =>
      `${folderConfig.basePath}/${pattern(i)}`
    );
  }

  return [];
}

/**
 * Map section slugs/titles to exactly 4 image paths per subsection
 * Uses the public-assets utility for consistent folder access
 */
export function getSectionImagePaths(sectionSlug: string | null, sectionTitle: string | null): string[] {
  const slug = sectionSlug?.toLowerCase() || '';
  const title = sectionTitle?.toLowerCase() || '';
  const combined = `${slug} ${title}`.toLowerCase();
  
  // Helper to combine slug and title matching
  const matches = (key: string) => combined.includes(key.toLowerCase());
  
  // Chorale de Sucy en Brie - first 4 org images (5-8 for Bondy, 9-12 for Orly)
  if (matches('sucy-en-brie') || (matches('sucy') && !matches('bondy') && !matches('orly'))) {
    return getImagesFromFolder(FOLDER_IMAGES.org, 4).slice(0, 4);
  }
  
  if (matches('bondy')) {
    return getImagesFromFolder(FOLDER_IMAGES.org, 8).slice(4, 8);
  }
  
  if (matches('orly')) {
    return getImagesFromFolder(FOLDER_IMAGES.org, 12).slice(8, 12);
  }
  
  // Chants - use Composition musicales (4 images)
  if (matches('chants') || matches('chant') || matches('musicales') || (matches('musique') && !matches('portrait'))) {
    return getImagesFromFolder(FOLDER_IMAGES.compositionMusicales, 4);
  }
  
  // Ecriture - use Poésies (only 1 file, so use Composition musicales for variety)
  if (matches('ecriture') || matches('poesies') || matches('poésie') || matches('poesie')) {
    const poesieImages = getImagesFromFolder(FOLDER_IMAGES.poesies, 1);
    const compositionImages = getImagesFromFolder(FOLDER_IMAGES.compositionMusicales, 3);
    return [...poesieImages, ...compositionImages].slice(0, 4);
  }
  
  // Dessin - use Dessins, pastels et techniques mixtes (4 images)
  if (matches('dessin') || matches('dessins')) {
    return getImagesFromFolder(FOLDER_IMAGES.dessinsPastels, 4);
  }
  
  // Peinture - use peintures sur toiles (Personnages and Natures mortes, pick 4)
  if ((matches('peinture') || matches('peintures')) && !matches('toile') && !matches('clavecin') && !matches('table')) {
    const personnages = getImagesFromFolder(FOLDER_IMAGES.personnages, 2);
    const naturesMortes = getImagesFromFolder(FOLDER_IMAGES.naturesMortes, 2);
    return [...personnages, ...naturesMortes].slice(0, 4);
  }
  
  // Sculpture - use scultures (only 2 available, repeat to get 4)
  if (matches('sculpture') || matches('scultures')) {
    const sculptureImages = getImagesFromFolder(FOLDER_IMAGES.scultures);
    while (sculptureImages.length < 4 && sculptureImages.length > 0) {
      sculptureImages.push(...sculptureImages);
    }
    return sculptureImages.slice(0, 4);
  }
  
  // Impression sur tissu - use impression sur tissu folder (3 available, repeat one to get 4)
  if (matches('impression') && matches('tissu')) {
    const tissuImages = getImagesFromFolder(FOLDER_IMAGES.impressionTissu);
    while (tissuImages.length < 4 && tissuImages.length > 0) {
      tissuImages.push(...tissuImages);
    }
    return tissuImages.slice(0, 4);
  }
  
  // Coloriage - use Coloriages pédagogiques et thérapeutiques (4 images)
  if (matches('coloriage') || matches('coloriages')) {
    return getImagesFromFolder(FOLDER_IMAGES.coloriages, 4);
  }
  
  // Design de packaging - use Design de packagings folder (4 images)
  if (matches('design') && (matches('packaging') || matches('packagings'))) {
    return getImagesFromFolder(FOLDER_IMAGES.designPackagings, 4);
  }
  
  // Flacon de parfums - use Flacon de parfums folder (4 images)
  if (matches('flacon') || matches('parfums') || matches('parfum')) {
    return getImagesFromFolder(FOLDER_IMAGES.flaconParfums, 4);
  }
  
  // Affiches évènementielles - use Affiches évènementielles folder (4 images)
  if (matches('affiche') || matches('évènementiel') || matches('evenementiel')) {
    return getImagesFromFolder(FOLDER_IMAGES.affichesEvenementielles, 4);
  }
  
  // peintures sur table - use peintures sur table folder (4 images)
  if (matches('table') && matches('peinture')) {
    return getImagesFromFolder(FOLDER_IMAGES.peinturesSurTable, 4);
  }
  
  // Oeuvres de jeunesse - use Oeuvres de jeunesse folder (4 images)
  if (matches('jeunesse') || matches('jeune')) {
    return getImagesFromFolder(FOLDER_IMAGES.oeuvresJeunesse, 4);
  }

  // Portraits - use Portraits folder (4 images)
  if (matches('portraits') || matches('portrait')) {
    return getImagesFromFolder(FOLDER_IMAGES.portraits, 4);
  }
  
  // Fallback: Try to find folder using the title/slug directly
  const folderConfig = getFolderForSubsection(title || slug);
  if (folderConfig) {
    const images = getImagesFromFolder(folderConfig, 4);
    if (images.length > 0) {
      while (images.length < 4 && images.length > 0) {
        images.push(...images);
      }
      return images.slice(0, 4);
    }
  }
  
  return [];
}

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
