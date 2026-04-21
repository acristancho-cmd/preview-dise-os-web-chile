(function () {
  function initFundsPagination() {
    var grid = document.querySelector('#funds-grid .funds-stocks-grid');
    if (!grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll('.local-stock-card'));
    if (!cards.length) return;

    var pageSize = parseInt(grid.getAttribute('data-page-size') || '20', 10);
    var totalPages = Math.ceil(cards.length / pageSize);
    if (totalPages <= 1) return;

    var nav = document.querySelector('#funds-grid .funds-pagination');
    if (!nav) return;

    var prevBtn = nav.querySelector('.funds-pagination-prev');
    var nextBtn = nav.querySelector('.funds-pagination-next');
    var pagesWrap = nav.querySelector('.funds-pagination-pages');
    var currentPage = 1;

    function buildPageButtons() {
      pagesWrap.innerHTML = '';
      for (var i = 1; i <= totalPages; i++) {
        var pageBtn = document.createElement('button');
        pageBtn.type = 'button';
        pageBtn.className = 'funds-pagination-page';
        pageBtn.textContent = String(i);
        pageBtn.setAttribute('aria-label', 'Ir a la pagina ' + i);
        pageBtn.setAttribute('data-page', String(i));
        pagesWrap.appendChild(pageBtn);
      }
    }

    function render(page) {
      currentPage = page;
      var start = (page - 1) * pageSize;
      var end = start + pageSize;

      cards.forEach(function (card, idx) {
        card.style.display = idx >= start && idx < end ? '' : 'none';
      });

      var pageButtons = pagesWrap.querySelectorAll('.funds-pagination-page');
      pageButtons.forEach(function (btn) {
        var pageNum = Number(btn.getAttribute('data-page'));
        btn.classList.toggle('is-active', pageNum === currentPage);
        btn.setAttribute('aria-current', pageNum === currentPage ? 'page' : 'false');
      });

      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage === totalPages;
    }

    pagesWrap.addEventListener('click', function (event) {
      var target = event.target;
      if (!target || !target.classList.contains('funds-pagination-page')) return;
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFundsPagination);
  } else {
    initFundsPagination();
  }
})();
