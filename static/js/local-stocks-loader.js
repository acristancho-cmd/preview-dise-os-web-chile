(function () {
  var TV_SRC = 'https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js';
  var TV_CFG = { colorTheme: 'dark', isTransparent: true, locale: 'es', autosize: true, showSymbolLogo: false };

  function loadWidget(container) {
    if (!container.hasAttribute('data-tv-pending')) return;
    container.removeAttribute('data-tv-pending');
    var symbol = container.getAttribute('data-symbol');
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = TV_SRC;
    s.async = true;
    s.innerHTML = JSON.stringify(Object.assign({ symbol: symbol }, TV_CFG));
    container.appendChild(s);
  }

  var observers = {};

  function observeSection(sectionId) {
    if (observers[sectionId]) return;
    var cards = document.querySelectorAll('#' + sectionId + ' .local-stock-card');
    if (!cards.length) return;

    if (!('IntersectionObserver' in window)) {
      cards.forEach(function (card) {
        var c = card.querySelector('[data-tv-pending]');
        if (c) loadWidget(c);
      });
      observers[sectionId] = true;
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var container = entry.target.querySelector('[data-tv-pending]');
        if (container) loadWidget(container);
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '200px 0px', threshold: 0 });

    cards.forEach(function (card) { observer.observe(card); });
    observers[sectionId] = observer;
  }

  function watchSection(sectionId) {
    var section = document.getElementById(sectionId);
    if (!section) return;

    // Si ya es visible al cargar (e.g. ?tab=global en la URL con setTimeout del tab.js)
    if (section.style.display !== 'none' && section.style.display !== '') {
      // doble rAF para asegurar que el layout esté listo
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { observeSection(sectionId); });
      });
      return;
    }

    var mo = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        var display = section.style.display;
        if (display !== 'none' && display !== '') {
          mo.disconnect();
          requestAnimationFrame(function () {
            requestAnimationFrame(function () { observeSection(sectionId); });
          });
        }
      });
    });

    mo.observe(section, { attributes: true, attributeFilter: ['style'] });
  }

  function init() {
    observeSection('local');
    watchSection('global');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
