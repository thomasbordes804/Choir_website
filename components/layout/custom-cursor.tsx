'use client';

import { useEffect } from 'react';

export function CustomCursor() {
  useEffect(() => {
    // Désactiver sur mobile
    if ('ontouchstart' in window) return;

    // Supprimer tout curseur existant
    const existing = document.getElementById('dynamic-cursor');
    if (existing) existing.remove();

    // Créer le curseur
    const cursor = document.createElement('div');
    cursor.id = 'dynamic-cursor';
    cursor.style.cssText = `
      position: absolute;
      width: 32px;
      height: 32px;
      border: 4px solid #000000;
      background: transparent;
      border-radius: 60% 40% 70% 30% / 30% 70% 40% 60%;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
      pointer-events: none;
      z-index: 2147483647;
      transform: rotate(15deg) scale(1);
      will-change: transform;
      display: block;
      visibility: visible;
      opacity: 1;
      margin: 0;
      padding: 0;
      transition: transform 0.3s ease-out, border-color 0.3s ease-out, box-shadow 0.3s ease-out;
    `;

    // Variables de position avec plus de latence
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let scrollY = 0;
    let isHovering = false;

    // Éléments qui déclenchent le resserrement
    const interactiveSelectors = 'a, button, [role="button"], input, textarea, select, [tabindex]:not([tabindex="-1"])';

    // Fonction pour vérifier si on survole un élément interactif
    const checkHover = (e: MouseEvent) => {
      const target = e.target as Element;
      const isInteractive = target.matches(interactiveSelectors) || 
                           target.closest(interactiveSelectors) !== null;
      
      if (isInteractive && !isHovering) {
        isHovering = true;
        // Resserrement du cercle et changement en blanc
        cursor.style.transform = 'rotate(15deg) scale(0.6)';
        cursor.style.borderColor = '#ffffff';
        cursor.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.8), 0 4px 12px rgba(0, 0, 0, 0.6)';
      } else if (!isInteractive && isHovering) {
        isHovering = false;
        // Retour à la taille normale et couleur noire
        cursor.style.transform = 'rotate(15deg) scale(1)';
        cursor.style.borderColor = '#000000';
        cursor.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.6)';
      }
    };

    // Fonction pour repositionner le curseur avec latence
    const repositionCursor = () => {
      // Latence plus importante (0.08 au lieu de 0.15)
      const lerp = 0.08;
      cursorX += (mouseX - cursorX) * lerp;
      cursorY += (mouseY + scrollY - cursorY) * lerp;

      // Positionner le curseur
      cursor.style.left = `${cursorX - 16}px`;
      cursor.style.top = `${cursorY - 16}px`;
    };

    // Mettre à jour la position de la souris
    const updateMouse = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      checkHover(e);
    };

    // Mettre à jour le scroll
    const updateScroll = () => {
      scrollY = window.scrollY;
    };

    // Initialisation
    updateScroll();
    document.body.appendChild(cursor);

    // Écouter les événements
    document.addEventListener('mousemove', updateMouse, { passive: true });
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });

    // Animation continue pour la latence
    let rafId: number;
    const animate = () => {
      repositionCursor();
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    // Masquer le curseur natif
    const hideCursor = () => {
      const style = document.createElement('style');
      style.id = 'dynamic-cursor-hide';
      style.textContent = `
        * { cursor: none !important; }
        input, textarea, select, button, a { cursor: none !important; }
      `;
      document.head.appendChild(style);
    };
    hideCursor();

    // Nettoyage
    return () => {
      document.removeEventListener('mousemove', updateMouse);
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
      if (rafId) cancelAnimationFrame(rafId);
      if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
      const style = document.getElementById('dynamic-cursor-hide');
      if (style) style.remove();
    };
  }, []);

  return null;
}