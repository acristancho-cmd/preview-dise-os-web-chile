/**
 * Stock List Tab Handler
 * Maneja la activación de tabs (local/global) desde parámetros de URL
 */

(function() {
    'use strict';

    function activateTabFromURL() {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');

      if (tabParam === 'local' || tabParam === 'global') {
        // Esperar a que la página cargue completamente
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
              if (typeof tabAction === 'function') {
                tabAction(tabParam);
              }
            }, 300);
          });
        } else {
          setTimeout(() => {
            if (typeof tabAction === 'function') {
              tabAction(tabParam);
            }
          }, 300);
        }
      }
    }

    // Ejecutar al cargar
    activateTabFromURL();

    // También ejecutar cuando cambie la URL (para navegación SPA)
    window.addEventListener('popstate', activateTabFromURL);
  })();
