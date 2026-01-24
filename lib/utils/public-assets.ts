/**
 * Public Assets Structure Reference
 * 
 * This file provides a centralized reference to all folders and subfolders
 * in the public directory for easy mapping and access across pages.
 */

// Main folder paths
export const PUBLIC_FOLDERS = {
    // Biography
    biography: '/biographie',
    cv: '/CV',
    
    // Home page
    homePage: '/home_page',
    
    // Books
    livres: '/Livres',
    
    // Retirement home
    maisonRetraite: '/maison_de_retraite',
    
    // Music
    musiques: '/Musiques',
    media: '/media',
    
    // Org (Choir organizations)
    org: '/orgue',
    
    // Works main folder
    oeuvres: '/oeuvres',
    
    // Oeuvres subfolders
    oeuvresSubfolders: {
      affichesEvenementielles: '/showcase/oeuvres/Affiches évènementielles',
      coloriages: '/showcase/oeuvres/Coloriages pédagogiques et thérapeutiques',
      compositionMusicales: '/showcase/oeuvres/Composition musicales',
      designPackagings: '/showcase/oeuvres/Design de packagings',
      flaconParfums: '/showcase/oeuvres/Flacon de parfums',
      impressionTissu: '/showcase/oeuvres/impression sur tissu',
      oeuvresJeunesse: '/showcase/oeuvres/Oeuvres de jeunesse',
      peinturesSurTable: '/showcase/oeuvres/Peintures/peintures sur table',
      peinturesSurToiles: '/showcase/oeuvres/Peintures/peintures sur toiles',
      poesies: '/showcase/oeuvres/Poésies',
      portraits: '/showcase/oeuvres/Portraits',
      scultures: '/showcase/oeuvres/scultures',
    },
    
    // Peintures sur toiles subfolders
    peinturesSurToilesSubfolders: {
      dessinsPastels: '/showcase/oeuvres/Peintures/peintures sur toiles/Dessins, pastels et techniques mixtes',
      naturesMortes: '/showcase/oeuvres/Peintures/peintures sur toiles/Natures mortes',
      personnages: '/showcase/oeuvres/Peintures/peintures sur toiles/Personnages',
      peinturesSurClavecin: '/showcase/oeuvres/Peintures/Peintures sur clavecin',
    },
  } as const;
  
  // Image file patterns for each folder
  export const FOLDER_IMAGES = {
    // Biography
    biography: {
      basePath: PUBLIC_FOLDERS.biography,
      files: ['portrait.webp'],
    },
    
    // CV
    cv: {
      basePath: PUBLIC_FOLDERS.cv,
      files: ['portrait.webp'],
    },
    
    // Home page
    homePage: {
      basePath: PUBLIC_FOLDERS.homePage,
      files: [
        'home_page.jpg',
        'home_page_1.jpg',
        'home_page_2.jpg',
        'home_page_3.jpg',
        'home_page_4.jpg',
        'home_page_5.jpg',
        'home_page_6.jpg',
      ],
    },
    
    // Books
    livres: {
      basePath: PUBLIC_FOLDERS.livres,
      files: [
        'la_mort_attendra.webp',
        'la_mort_attendra_1.webp',
        'la_mort_attendra_2.webp',
        'la_mort_attendra_3.webp',
        'les_miracles_de_ma_vie.webp',
      ],
    },
    
    // Retirement home
    maisonRetraite: {
      basePath: PUBLIC_FOLDERS.maisonRetraite,
      pattern: (i: number) => `maison_${i + 1}.webp`,
      count: 13,
    },
    
    // Music
    musiques: {
      basePath: PUBLIC_FOLDERS.musiques,
      files: ['Last Dream - song.png', 'Yura yura - song.png'],
    },
    
    // Org (Choir organizations) - 34 files
    org: {
      basePath: PUBLIC_FOLDERS.org,
      pattern: (i: number) => `org_${i + 1}.webp`,
      count: 34,
    },
    
    // Affiches évènementielles - 11 files
    affichesEvenementielles: {
      basePath: PUBLIC_FOLDERS.oeuvresSubfolders.affichesEvenementielles,
      files: [
        'concertDeNoel.thumb.webp',
        'cultura.thumb.webp',
        'cultura2.thumb.webp',
        'IMG_8363.thumb.webp',
        'lAsieEstBelle.thumb.webp',
        'lePaysDuSourire.thumb.webp',
        'lesAilesDuPrintemps.thumb.webp',
        'louangeRythmeEtVariations.thumb.webp',
        'semaineDesArts.thumb.webp',
        'sister-cities-game.thumb.webp',
        'triptyqueSacre.thumb.webp',
      ],
    },
    
    // Coloriages pédagogiques et thérapeutiques - 7 files
    coloriages: {
      basePath: PUBLIC_FOLDERS.oeuvresSubfolders.coloriages,
      files: [
        '3musicians0.thumb.webp',
        '3musicians1.thumb.webp',
        'a0.thumb.webp',
        'a1.thumb.webp',
        'b0.thumb.webp',
        'b1.thumb.webp',
        'balloon0.thumb.webp',
      ],
    },
    
    // Composition musicales - 5 files
    compositionMusicales: {
      basePath: PUBLIC_FOLDERS.oeuvresSubfolders.compositionMusicales,
      pattern: (i: number) => `Composition musicales_${i + 1}.jpg`,
      count: 5,
    },
    
    // Design de packagings - 18 files
    designPackagings: {
      basePath: PUBLIC_FOLDERS.oeuvresSubfolders.designPackagings,
      files: [
        'beaujolais.thumb.webp',
        'biscuitProvence.thumb.webp',
        'champsElysees.thumb.webp',
        'cup1.thumb.webp',
        'cup2.thumb.webp',
        'ducks.thumb.webp',
        'greenTea.thumb.webp',
        'jb.thumb.webp',
        'IMG_1109.thumb.webp',
        'IMG_1145.thumb.webp',
        'IMG_1211.thumb.webp',
        'IMG_1722.thumb.webp',
        'IMG_2040.thumb.webp',
        'IMG_2246.thumb.webp',
        'nutella.thumb.webp',
        'paris.thumb.webp',
        'tasse.thumb.webp',
        'tsarine.thumb.webp',
      ],
    },
    
    // Flacon de parfums - 6 files
    flaconParfums: {
      basePath: PUBLIC_FOLDERS.oeuvresSubfolders.flaconParfums,
      files: [
        'detail-flacon2.webp',
        'detail-flacon3..webp',
        'detail-flacon4.webp',
        'flacon0.webp',
        'flacon2.webp',
        'flacon3.webp',
      ],
    },
    
    // Impression sur tissu - 3 files
    impressionTissu: {
      basePath: PUBLIC_FOLDERS.oeuvresSubfolders.impressionTissu,
      files: [
        'PHOTO-2024-05-06-10-14-31.thumb.webp',
        'PHOTO-2024-05-06-10-14-31-1.thumb.webp',
        'PHOTO-2024-05-06-10-14-31-2.thumb.webp',
      ],
    },
    
    // Oeuvres de jeunesse - 12 files
    oeuvresJeunesse: {
      basePath: PUBLIC_FOLDERS.oeuvresSubfolders.oeuvresJeunesse,
      files: [
        'IMG_0899.thumb.webp',
        'IMG_0900.thumb.webp',
        'IMG_0902.thumb.webp',
        'IMG_0903 (1).thumb.webp',
        'IMG_0905.thumb.webp',
        'IMG_0906.thumb.webp',
        'IMG_0909.thumb.webp',
        'IMG_0910.thumb.webp',
        'IMG_0911.thumb.webp',
        'IMG_0913.thumb.webp',
        'IMG_0915.thumb.webp',
        'IMG_0917.thumb.webp',
      ],
    },
    
    // Peintures sur table - 6 files
    peinturesSurTable: {
      basePath: PUBLIC_FOLDERS.oeuvresSubfolders.peinturesSurTable,
      files: [
        'FullSizeRender.thumb (1).webp',
        'FullSizeRender2.thumb.webp',
        'img1.thumb.webp',
        'img2.thumb.webp',
        't1.thumb.webp',
        't2.thumb.webp',
      ],
    },
    
    // Peintures sur toiles - Personnages - 18 files
    personnages: {
      basePath: PUBLIC_FOLDERS.peinturesSurToilesSubfolders.personnages,
      files: [
        'a2.thumb.webp',
        'belle_captive.thumb.webp',
        'camille_saint_saens.thumb.webp',
        'defile_de_mode_lingerie.thumb.webp',
        'et_l_enfant_jaillit_du_sein_de_sa_mere.thumb.webp',
        'femme.thumb.webp',
        'femme_aux_cheveux_de_lin.thumb.webp',
        'flo_skieuse_experimentee.thumb.webp',
        'jeune_femme_nue_pudique.thumb.webp',
        'joie_du_ski.thumb.webp',
        'le_regard_du_desert.thumb.webp',
        'meditation.thumb.webp',
        'nu_fantasque.thumb.webp',
        'petit_cornac.thumb.webp',
        'souffle-et-danse-1.thumb.webp',
        'souffle-et-danse-2.thumb.webp',
        'souffle-et-danse-3.thumb.webp',
        'une_poussiere_dans_l_oeil.thumb.webp',
      ],
    },
    
    // Peintures sur toiles - Natures mortes - 5 files
    naturesMortes: {
      basePath: PUBLIC_FOLDERS.peinturesSurToilesSubfolders.naturesMortes,
      files: [
        'bouquet_au_vase_rond.thumb.webp',
        'bouquet_au_vase_vert.thumb.webp',
        'gerbe_de_fleurs_des_champs.thumb.webp',
        'offrande-florale.thumb.webp',
        'valse_de_fleurs.thumb.webp',
      ],
    },
    
    // Dessins, pastels et techniques mixtes - 37 files
    dessinsPastels: {
      basePath: PUBLIC_FOLDERS.peinturesSurToilesSubfolders.dessinsPastels,
      files: [
        'cheval.thumb.webp',
        'd1.thumb.webp',
        'd2.thumb.webp',
        'd3.thumb.webp',
        'd4.thumb.webp',
        'd5.thumb.webp',
        'd6.thumb.webp',
        'd8.thumb.webp',
        'd9.thumb.webp',
        'd10.thumb.webp',
        'd11.thumb.webp',
        'fsr.thumb.webp',
        'fsr2.thumb.webp',
        'fsr3.thumb.webp',
        'FullSizeRender.thumb.webp',
        'FullSizeRender67.thumb.webp',
        'FullSizeRender68.thumb.webp',
        'FullSizeRender70.thumb.webp',
        'FullSizeRender73.thumb.webp',
        'FullSizeRender75.thumb.webp',
        'FullSizeRender76.thumb.webp',
        'FullSizeRender77.thumb.webp',
        'FullSizeRender78.thumb.webp',
        'FullSizeRender79.thumb.webp',
        'FullSizeRender80.thumb.webp',
        'FullSizeRender81.thumb.webp',
        'FullSizeRender91.thumb.webp',
        'FullSizeRender92.thumb.webp',
        'FullSizeRender93.thumb.webp',
        'FullSizeRender95.thumb.webp',
        'FullSizeRender97.thumb.webp',
        'gondoles.thumb.webp',
        'IMG_6404.thumb.webp',
        'IMG_6405 (1).thumb.webp',
        'music1.thumb.webp',
        'music2.thumb.webp',
        'portrait.thumb.webp',
      ],
    },
    
    // Poésies - 1 file
    poesies: {
      basePath: PUBLIC_FOLDERS.oeuvresSubfolders.poesies,
      files: ['Composition musicales_1.jpg'],
    },
    
    // Portraits - 6 files
    portraits: {
      basePath: PUBLIC_FOLDERS.oeuvresSubfolders.portraits,
      files: [
        'a1.webp',
        'a2.webp',
        'a3.webp',
        'femme.webp',
        'IMG_5666.webp',
        'p1.webp',
      ],
    },
    
    // Sculptures - 2 files
    scultures: {
      basePath: PUBLIC_FOLDERS.oeuvresSubfolders.scultures,
      files: [
        'danseuseAgile.thumb.webp',
        'danseuseAgile2.thumb.webp',
      ],
    },
  } as const;
  
  /**
   * Get image paths from a folder configuration
   * @param folderConfig - Folder configuration object
   * @param limit - Optional limit to number of images returned (default: all)
   * @returns Array of full image paths
   */
  export function getImagesFromFolder(
    folderConfig: { 
      basePath: string; 
      files?: string[]; 
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
      return Array.from({ length: count }, (_, i) => 
        `${folderConfig.basePath}/${folderConfig.pattern(i)}`
      );
    }
    
    return [];
  }
  
  /**
   * Get a single representative image from a folder
   * @param folderConfig - Folder configuration object
   * @param index - Optional index (default: 0 for first image)
   * @returns Full image path or null
   */
  export function getSingleImageFromFolder(
    folderConfig: { 
      basePath: string; 
      files?: string[]; 
      pattern?: (i: number) => string; 
      count?: number;
    },
    index: number = 0
  ): string | null {
    if (folderConfig.files && folderConfig.files.length > index) {
      return `${folderConfig.basePath}/${folderConfig.files[index]}`;
    }
    
    if (folderConfig.pattern && folderConfig.count && index < folderConfig.count) {
      return `${folderConfig.basePath}/${folderConfig.pattern(index)}`;
    }
    
    return null;
  }
  
  /**
   * Map subsection label to appropriate folder configuration
   * @param label - Subsection label
   * @returns Folder configuration or null
   */
  export function getFolderForSubsection(label: string): typeof FOLDER_IMAGES[keyof typeof FOLDER_IMAGES] | null {
    const labelLower = label.toLowerCase();
    
    // Direct mappings
    const mappings: Record<string, keyof typeof FOLDER_IMAGES> = {
      'peinture': 'personnages',
      'peintures': 'personnages',
      'chorale de sucy en brie': 'portraits',
      'chorale de bondy': 'portraits',
      'chorale d\'orly': 'portraits',
      'chorale d\'orly': 'portraits',
      'sucy': 'portraits',
      'bondy': 'portraits',
      'orly': 'portraits',
      'chants': 'compositionMusicales',
      'chant': 'compositionMusicales',
      'musique': 'compositionMusicales',
      'composition': 'compositionMusicales',
      'ecriture': 'poesies',
      'poésie': 'poesies',
      'poesie': 'poesies',
      'poésies': 'poesies',
      'dessin': 'dessinsPastels',
      'dessins': 'dessinsPastels',
      'sculpture': 'scultures',
      'scultures': 'scultures',
      'impression': 'impressionTissu',
      'tissu': 'impressionTissu',
      'coloriage': 'coloriages',
      'coloriages': 'coloriages',
      'design': 'designPackagings',
      'packaging': 'designPackagings',
      'packagings': 'designPackagings',
      'flacon': 'flaconParfums',
      'parfum': 'flaconParfums',
      'parfums': 'flaconParfums',
      'affiche': 'affichesEvenementielles',
      'évènementiel': 'affichesEvenementielles',
      'evenementiel': 'affichesEvenementielles',
      'table': 'peinturesSurTable',
      'jeunesse': 'oeuvresJeunesse',
      'jeune': 'oeuvresJeunesse',
      'portrait': 'portraits',
      'portraits': 'portraits',
    };
    
    // Try exact match first
    if (mappings[labelLower]) {
      return FOLDER_IMAGES[mappings[labelLower]];
    }
    
    // Try partial matching
    for (const [key, folderKey] of Object.entries(mappings)) {
      if (labelLower.includes(key)) {
        return FOLDER_IMAGES[folderKey];
      }
    }
    
    return null;
  }
  
  /**
   * Get a single representative image for a subsection label
   * @param label - Subsection label
   * @returns Full image path or default fallback
   */
  export function getSubsectionImagePath(label: string): string {
    const folderConfig = getFolderForSubsection(label);
    if (folderConfig) {
      const image = getSingleImageFromFolder(folderConfig, 0);
      if (image) return image;
    }
    
    // Default fallback
    return '/biographie/portrait.webp';
  }
  
  /**
   * Get multiple images for a subsection label (for rotating images)
   * @param label - Subsection label
   * @param count - Number of images to return (default: 4)
   * @returns Array of image paths
   */
  export function getSubsectionImagePaths(label: string, count: number = 4): string[] {
    const folderConfig = getFolderForSubsection(label);
    if (folderConfig) {
      const images = getImagesFromFolder(folderConfig, count);
      if (images.length > 0) {
        // If we have fewer images than requested, repeat them
        while (images.length < count && images.length > 0) {
          images.push(...images.slice(0, count - images.length));
        }
        return images.slice(0, count);
      }
    }
    
    // Default fallback
    return Array(count).fill('/biographie/portrait.webp');
  }
  
  // Export all folder keys for easy access
  export type FolderKey = keyof typeof FOLDER_IMAGES;
  export type OeuvresSubfolderKey = keyof typeof PUBLIC_FOLDERS.oeuvresSubfolders;
  export type PeinturesSubfolderKey = keyof typeof PUBLIC_FOLDERS.peinturesSurToilesSubfolders;