(function() {
    'use strict';

    const routeMap = {
      '/': '.navbar-link[href="/"]',
      '/blog': '.navbar-link[href="/blog"]',
      '/triipro': '.navbar-link[href="/triipro"]',
      '/about': '.navbar-link[href="/about"]',
      '/stock-list': '.navbar-link[href="/stock-list"]'
    };

    const fondoRoutes = ['/fondos'];

    function setActiveNavLink() {
      const currentPath = window.location.pathname;

      document.querySelectorAll('.navbar-link').forEach(link => {
        link.classList.remove('active');
      });
      document.querySelectorAll('.navbar-item').forEach(item => {
        item.classList.remove('active');
      });

      const isFondoRoute = fondoRoutes.some(route => currentPath === route);
      const isStockList = currentPath === '/stock-list';
      const isEtf = currentPath === '/etf';
      const isProductsRoute = isFondoRoute || isStockList || isEtf;

      document.querySelectorAll('.dropdown-category-card-link').forEach(link => {
        link.classList.remove('active');
      });
      document.querySelectorAll('.menu-mobile-subitem').forEach(link => {
        link.classList.remove('active');
      });

      if (isProductsRoute) {
        const productosItem = document.querySelector('#navbar-item-productos');
        const productosLink = productosItem && productosItem.querySelector('.navbar-link-dropdown');
        if (productosItem && productosLink) {
          productosItem.classList.add('active');
          productosLink.classList.add('active');
        }

        if (currentPath === '/stock-list') {
          const urlParams = new URLSearchParams(window.location.search);
          const tabParam = urlParams.get('tab') === 'global' ? 'global' : 'local';
          const desktopHref = '/stock-list?tab=' + tabParam;
          const mobileHref = '/stock-list?tab=' + tabParam;
          const stockCard = document.querySelector(`.dropdown-category-card-link[href="${desktopHref}"]`);
          const stockMobile = document.querySelector(`.menu-mobile-subitem[href="${mobileHref}"]`);
          if (stockCard) stockCard.classList.add('active');
          if (stockMobile) stockMobile.classList.add('active');
        }

        if (isFondoRoute) {
          const fondoCard = document.querySelector('.dropdown-category-card-link[href="/fondos"]');
          const fondoMobile = document.querySelector('.menu-mobile-subitem[href="/fondos"]');
          if (fondoCard) fondoCard.classList.add('active');
          if (fondoMobile) fondoMobile.classList.add('active');
        }

        if (currentPath === '/etf') {
          const etfCard = document.querySelector('.dropdown-category-card-link[href="/etf"]');
          if (etfCard) {
            etfCard.classList.add('active');
          }
          const etfMobile = document.querySelector('.menu-mobile-subitem[href="/etf"]');
          if (etfMobile) {
            etfMobile.classList.add('active');
          }
        }
      } else if (routeMap[currentPath]) {
        const link = document.querySelector(routeMap[currentPath]);
        if (link) {
          link.classList.add('active');
          const parentItem = link.closest('.navbar-item');
          if (parentItem) {
            parentItem.classList.add('active');
          }
        }
      } else {
        const matchingLink = Array.from(document.querySelectorAll('.navbar-link')).find(link => {
          const href = link.getAttribute('href');
          return href && currentPath.startsWith(href) && href !== '/';
        });

        if (matchingLink) {
          matchingLink.classList.add('active');
          const parentItem = matchingLink.closest('.navbar-item');
          if (parentItem) {
            parentItem.classList.add('active');
          }
        }
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setActiveNavLink);
    } else {
      setActiveNavLink();
    }

    window.addEventListener('popstate', setActiveNavLink);
  })();
