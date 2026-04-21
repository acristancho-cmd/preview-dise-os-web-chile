(function () {
  function initPaginator(section) {
    var grid = section.querySelector('ul');
    var nav = section.querySelector('.cards-pagination');
    if (!grid || !nav) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll('.local-stock-card'));
    if (!cards.length) return;

    var pageSize = parseInt(grid.getAttribute('data-page-size') || '20', 10);
    var totalPages = Math.ceil(cards.length / pageSize);
    if (totalPages <= 1) {
      nav.style.display = 'none';
      return;
    }

    var prevBtn = nav.querySelector('.cards-pagination-prev');
    var nextBtn = nav.querySelector('.cards-pagination-next');
    var pagesWrap = nav.querySelector('.cards-pagination-pages');
    var currentPage = 1;

    function buildPageButtons() {
      pagesWrap.innerHTML = '';
      for (var i = 1; i <= totalPages; i++) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cards-pagination-page';
        btn.setAttribute('data-page', String(i));
        btn.setAttribute('aria-label', 'Ir a la pagina ' + i);
        btn.textContent = String(i);
        pagesWrap.appendChild(btn);
      }
    }

    function render(page) {
      currentPage = page;
      var start = (currentPage - 1) * pageSize;
      var end = start + pageSize;

      cards.forEach(function (card, idx) {
        card.style.display = idx >= start && idx < end ? '' : 'none';
      });

      pagesWrap.querySelectorAll('.cards-pagination-page').forEach(function (btn) {
        var pageNum = Number(btn.getAttribute('data-page'));
        var active = pageNum === currentPage;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-current', active ? 'page' : 'false');
      });

      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage === totalPages;
    }

    pagesWrap.addEventListener('click', function (event) {
      var target = event.target;
      if (!target.classList.contains('cards-pagination-page')) return;
      var page = Number(target.getAttribute('data-page'));
      if (!page || page === currentPage) return;
      render(page);
    });

    prevBtn.addEventListener('click', function () {
      if (currentPage > 1) render(currentPage - 1);
    });

    nextBtn.addEventListener('click', function () {
      if (currentPage < totalPages) render(currentPage + 1);
    });

    buildPageButtons();
    render(1);
  }

  function init() {
    document.querySelectorAll('[id=\"etf-grid\"], [id=\"local\"], [id=\"global\"]').forEach(initPaginator);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
