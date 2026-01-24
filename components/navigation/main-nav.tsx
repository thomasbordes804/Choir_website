'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

type NavItem = {
  href: string;
  label: string;
  subsections?: { href: string; label: string; image?: string }[];
  categories?: WorksCategory[];
};

type WorksSubsection = {
  href: string;
  label: string;
};

type WorksCategory = {
  label: string;
  subcategories: WorksSubsection[];
};

// Group subsections into categories
function groupSubsectionsIntoCategories(subsections: WorksSubsection[]): WorksCategory[] {
  const categories: WorksCategory[] = [];
  
  // Helper to find subsections by keyword
  const findByKeyword = (keywords: string[]) => {
    return subsections.filter(sub => {
      const labelLower = sub.label.toLowerCase();
      return keywords.some(keyword => labelLower.includes(keyword.toLowerCase()));
    });
  };
  
  // Peintures category
  const peinturesSubs = findByKeyword(['peinture']);
  if (peinturesSubs.length > 0) {
    categories.push({
      label: 'Peintures',
      subcategories: peinturesSubs,
    });
  }
  
  // Musiques category
  const musiquesSubs = findByKeyword(['musique', 'composition','chant']);
  if (musiquesSubs.length > 0) {
    categories.push({
      label: 'Musiques',
      subcategories: musiquesSubs,
    });
  }
  
  // Chorales category
  const choralesSubs = findByKeyword(['chorale', 'sucy', 'bondy', 'orly']);
  if (choralesSubs.length > 0) {
    categories.push({
      label: 'Chorales',
      subcategories: choralesSubs,
    });
  }
  
  // Other standalone categories
  const ecritureSubs = findByKeyword(['poésie']);
  if (ecritureSubs.length > 0) {
    categories.push({
      label: 'Ecriture',
      subcategories: ecritureSubs,
    });
  }
  
  const dessinSubs = findByKeyword(['dessin', 'coloriage']);
  if (dessinSubs.length > 0) {
    categories.push({
      label: 'Dessin',
      subcategories: dessinSubs,
    });
  }
  
  const sculptureSubs = findByKeyword(['sculpture', 'scultures']);
  if (sculptureSubs.length > 0) {
    categories.push({
      label: 'Sculpture',
      subcategories: sculptureSubs,
    });
  }
  
  const portraitsSubs = findByKeyword(['portrait', 'portraits']);
  if (portraitsSubs.length > 0) {
    categories.push({
      label: 'Portraits',
      subcategories: portraitsSubs,
    });
  }

  // Autres category (Design, Flacon, Impression, Coloriage, Affiches, Jeunesse)
  const autresSubs = findByKeyword([
    'design', 'packaging', 'flacon', 'parfum', 'impression', 'tissu',
    'affiche', 'évènementiel', 'evenementiel', 'jeunesse', 'jeune'
  ]);
  if (autresSubs.length > 0) {
    categories.push({
      label: 'Autres',
      subcategories: autresSubs,
    });
  }
  
  // Add any remaining ungrouped subsections to "Autres"
  const allGroupedHrefs = new Set(categories.flatMap(cat => cat.subcategories.map(sub => sub.href)));
  const remainingSubs = subsections.filter(sub => !allGroupedHrefs.has(sub.href));
  if (remainingSubs.length > 0) {
    const autresIndex = categories.findIndex(cat => cat.label === 'Autres');
    if (autresIndex >= 0) {
      categories[autresIndex].subcategories.push(...remainingSubs);
    } else {
      categories.push({
        label: 'Autres',
        subcategories: remainingSubs,
      });
    }
  }
  
  return categories;
}

// Image mapping for each subsection
const getSubsectionImage = (label: string): string => {
  const labelLower = label.toLowerCase();
  
  // Map based on label content
  const imageMap: Record<string, string> = {
    // Peinture
    "peinture sur toiles": "/showcase/oeuvres/Peintures/peintures sur toiles/Personnages/femme.thumb.webp",
    "peinture sur table": "/showcase/oeuvres/Peintures/peintures sur table/t1.thumb.webp",
    "peinture sur clavecin": "/showcase/oeuvres/Peintures/peintures sur clavecin/clavecin_1.webp",
    
    //Musiques
    "chants": "/showcase/musique.png",
    "composition musicale": "/showcase/alto.png",
    
    // Chorales
    "chorale de sucy en brie": "/showcase/oeuvres/Chorales/chorale sucy/chorale_sucy_1.webp",
    "chorale de bondy": "/showcase/oeuvres/Chorales/chorale rosny/chorale_rosny_1.webp",
    "chorale d'orly": "/showcase/oeuvres/Chorales/chorale creteil/chorale_creteil.webp", 

    // Ecriture / Poésie
    "poésie": "/showcase/oeuvres/Poésies/Composition musicales_1.jpg",

    // Dessin
    "dessins": "/showcase/oeuvres/Dessins, pastels et techniques mixtes/gondoles.thumb.webp",

    // Sculpture
    "sculpture": "/showcase/oeuvres/scultures/danseuseAgile.thumb.webp",

    // Portraits
    "portrait": "/showcase/oeuvres/Portraits/p1.webp",

    // Impression sur tissu
    "impression": "/showcase/oeuvres/impression sur tissu/PHOTO-2024-05-06-10-14-31.thumb.webp",

    // Coloriage
    "coloriage": "/showcase/oeuvres/Coloriages pédagogiques et thérapeutiques/a0.thumb.webp",

    // Design de packaging
    "design": "/showcase/oeuvres/Design de packagings/tsarine.thumb.webp",

    // Flacon de parfums
    "flacon": "/showcase/oeuvres/Flacon de parfums/flacon0.webp",

    // Affiches évènementielles
    "affiche": "/showcase/oeuvres/Affiches évènementielles/concertDeNoel.thumb.webp",

    // Oeuvres de jeunesse
    "jeunesse": "/showcase/oeuvres/Oeuvres de jeunesse/IMG_0899.thumb.webp",
    
    // Communication
    "festival concerts": "/showcase/communication/evenementiel.jpg",
    "parution presse": "/showcase/communication/media.jpg",
    "newsletter": "/showcase/communication/newsletter.jpg",
    "plaquette": "/showcase/communication/plaquette.jpg",
    //"portraits": "/oeuvres/Portraits/p1.thumb.webp",
  };
  
  // Try exact match first
  if (imageMap[labelLower]) {
    return imageMap[labelLower];
  }
  
  // Try partial matching
  for (const [key, imagePath] of Object.entries(imageMap)) {
    if (labelLower.includes(key)) {
      return imagePath;
    }
  }
  
  // Default fallback
  return "/biographie/portrait.webp";
};

export function MainNav({ worksSubsections = [] }: { worksSubsections?: WorksSubsection[] }) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const categoryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (categoryTimeoutRef.current) {
        clearTimeout(categoryTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = (itemHref: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenDropdown(itemHref);
  };

  const handleMouseLeave = (itemHref: string) => {
    // Add a small delay before closing to prevent accidental closes
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
      setHoveredCategory(null);
    }, 200);
  };

  const handleDropdownMouseEnter = (itemHref: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenDropdown(itemHref);
  };

  const handleDropdownMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
      setHoveredCategory(null);
    }, 200);
  };

  const handleCategoryMouseEnter = (categoryLabel: string) => {
    if (categoryTimeoutRef.current) {
      clearTimeout(categoryTimeoutRef.current);
    }
    setHoveredCategory(categoryLabel);
  };

  const handleCategoryMouseLeave = () => {
    categoryTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 300); // Increased delay to allow moving to sub-sub-sections
  };

  // Group works subsections into categories
  const worksCategories = groupSubsectionsIntoCategories(worksSubsections);

  // Build nav items with dynamic works categories
  const navItems: NavItem[] = [
    { href: "/", label: "Accueil" },
    {
      href: "/actuality",
      label: "Actualités",
      subsections: [
        { href: "/actuality/les-6-derniers-mois", label: "Les 6 derniers mois" },
        { href: "/actuality/bonne-annee", label: "Bonne année" },
      ],
    },
    {
      href: "/works",
      label: "Œuvres",
      categories: worksCategories,
    },
    { href: "/biography", label: "Biographie" },
    {
      href: "/communication",
      label: "Communication",
      categories: [
        {
          label: "Evenementiel",
          subcategories: [
            { href: "/communication/evenementiel/festival-concerts", label: "Festival concerts" },
          ],
        },
        {
          label: "Medias",
          subcategories: [
            { href: "/communication/medias/parution-presse", label: "Parution presse" },
          ],
        },
        {
          label: "Newsletter",
          subcategories: [
            { href: "/communication/newsletter", label: "Newsletter" },
          ],
        },
        {
          label: "Plaquette",
          subcategories: [
            { href: "/communication/plaquette", label: "Plaquette" },
          ],
        },
      ],
    },
    { href: "/partenariat", label: "Partenariat" },
    { href: "/contact", label: "Contact" },
    { href: "/archive", label: "Archive" },
  ];


  return (    <nav       aria-label="Main navigation"       className="px-5 py-1.5 ml-8 relative overflow-visible"      style={{        background: 'linear-gradient(to right, transparent 0%, rgba(237, 234, 230, 0.4) 8%, rgba(237, 234, 230, 0.4) 92%, transparent 100%)',      }}    >      <ul className="flex items-center gap-6 sm:gap-8 text-xs font-light tracking-wider relative z-10">        {navItems.map((item) => {          const isActive = item.href === "/"            ? pathname === item.href            : pathname?.startsWith(item.href ?? "");                    const hasSubsections = item.subsections && item.subsections.length > 0;          const hasCategories = item.categories && item.categories.length > 0;          const hasDropdown = hasSubsections || hasCategories;          const isDropdownOpen = openDropdown === item.href;          return (            <li              key={item.href}              className="relative z-10"              onMouseEnter={() => hasDropdown && handleMouseEnter(item.href)}              onMouseLeave={() => hasDropdown && handleMouseLeave(item.href)}            >              <Link                href={item.href}                className="group relative text-zinc-700 transition-all duration-300"              >                <span className={`relative inline-block transition-all duration-300 ${                  isActive                    ? "text-zinc-900 font-normal"                    : isDropdownOpen                    ? "text-zinc-900"                    : "hover:text-zinc-900"                }`}>                  {item.label}                  {/* Simple thin underline */}                  <span className={`absolute -bottom-0.5 left-0 h-px bg-zinc-900 transition-all duration-300 origin-left ${                    isActive || isDropdownOpen                      ? "w-full scale-x-100"                      : "w-0 scale-x-0 group-hover:w-full group-hover:scale-x-100"                  }`} />                </span>              </Link>              {/* Dropdown Menu - Keep all existing dropdown code */}              {hasDropdown && (
                <div
                  ref={dropdownRef}
                  data-dropdown={item.href}
                  className={`absolute top-full shadow-xl transition-all duration-300 ease-out backdrop-blur-sm ${
                    isDropdownOpen
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2 pointer-events-none"
                  }`}
                  style={{ 
                    zIndex: 1000,
                    backgroundColor: 'rgba(237, 234, 230, 0.98)', // Very strong transparent beige
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    marginTop: '16px',
                    left: '0',
                    minWidth: '200px',
                    maxWidth: '280px',
                  }}
                  onMouseEnter={() => handleDropdownMouseEnter(item.href)}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  {(item.href === "/works" && hasCategories) || (item.href === "/communication" && hasCategories) ? (
                    // Simple vertical list of categories/sub-sections
                    <ul className="py-2">
                      {item.categories?.map((category, index) => (
                        <li
                          key={category.label}
                          className="relative"
                          onMouseEnter={() => handleCategoryMouseEnter(category.label)}
                          onMouseLeave={handleCategoryMouseLeave}
                        >
                          <div className={`px-4 py-2.5 transition-all duration-200 ${
                            hoveredCategory === category.label
                              ? 'bg-white/80 text-zinc-900 font-medium'
                              : 'text-zinc-700 hover:bg-white/50 hover:text-zinc-900'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                {category.label}
                              </span>
                              {category.subcategories.length > 0 && (
                                <span className="text-zinc-400 text-xs ml-2">→</span>
                              )}
                            </div>
                          </div>

                          {/* Sub-sub-sections panel - appears on the RIGHT when hovering, aligned with sub-section */}
                          {hoveredCategory === category.label && category.subcategories.length > 0 && (
                            <div 
                              className="absolute left-full shadow-xl backdrop-blur-sm transition-all duration-300 ease-out"
                              style={{
                                zIndex: 1001,
                                backgroundColor: 'rgba(237, 234, 230, 0.98)',
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)',
                                minWidth: '280px',
                                padding: '8px',
                                marginLeft: '-4px',
                                top: '-16px', // Align with sub-section content (py-2.5 = 10px)
                                animation: 'fadeInSlide 0.2s ease-out',
                              }}
                              onMouseEnter={() => {
                                // Keep the hovered category active when mouse enters the subcategories panel
                                if (categoryTimeoutRef.current) {
                                  clearTimeout(categoryTimeoutRef.current);
                                }
                                // Explicitly keep the category hovered
                                setHoveredCategory(category.label);
                              }}
                              onMouseLeave={handleCategoryMouseLeave}
                            >
                              <ul className="space-y-1">
                                {category.subcategories.map((subcategory, index) => {
                                  const isSubActive = pathname?.startsWith(subcategory.href);
                                  const imagePath = getSubsectionImage(subcategory.label);
                                  
                                  return (
                                    <li key={`${subcategory.href}-${index}`}>
                                      <Link
                                        href={subcategory.href}
                                        className={`group/sub flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 ${
                                          isSubActive
                                            ? 'bg-white/80 text-zinc-900'
                                            : 'hover:bg-white/60 text-zinc-700 hover:text-zinc-900'
                                        }`}
                                      >
                                        {/* Subcategory image thumbnail */}
                                        <div className="flex-shrink-0 w-12 h-12 relative overflow-hidden rounded-md border border-zinc-300 bg-zinc-100">
                                          <Image
                                            src={imagePath}
                                            alt={subcategory.label}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover/sub:scale-110"
                                            sizes="48px"
                                            style={{ filter: 'brightness(0.75)' }}  // Changed from 0.8 to 0.7
                                          />
                                        </div>
                                        
                                        {/* Subcategory label */}
                                        <span 
                                          className={`text-sm font-medium flex-1 ${
                                            isSubActive ? 'font-semibold' : ''
                                          }`}
                                          style={{
                                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                                          }}
                                        >
                                          {subcategory.label}
                                        </span>
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : hasSubsections ? (
                    // Simple list for sections with direct subsections (like Actualités)
                    <ul className="py-2">
                      {item.subsections?.map((subsection, index) => {
                        const isSubActive = pathname?.startsWith(subsection.href);
                        return (
                          <li key={`${subsection.href}-${index}`}>
                            <Link
                              href={subsection.href}
                              className={`flex items-center justify-between px-4 py-2.5 transition-all duration-200 ${
                                isSubActive
                                  ? 'bg-white/80 text-zinc-900 font-medium'
                                  : 'text-zinc-700 hover:bg-white/50 hover:text-zinc-900'
                              }`}
                            >
                              <span className="text-sm font-medium">
                                {subsection.label}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </nav>
  );
}