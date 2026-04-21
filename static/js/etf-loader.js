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

  function init() {
    var cards = document.querySelectorAll('#etf-grid .local-stock-card, #funds-grid .local-stock-card');
    if (!cards.length) return;

    if (!('IntersectionObserver' in window)) {
      cards.forEach(function (card) {
        var c = card.querySelector('[data-tv-pending]');
        if (c) loadWidget(c);
      });
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
