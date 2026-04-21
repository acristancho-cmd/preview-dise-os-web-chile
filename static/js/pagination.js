// Función para inicializar paginación
function initPagination(listId, numbersId, prevId, nextId) {
  const paginationNumbers = document.getElementById(numbersId);
  const paginatedList = document.getElementById(listId);

  if (!paginationNumbers || !paginatedList) return;

  const listItems = paginatedList.querySelectorAll("li");
  const nextButton = document.getElementById(nextId);
  const prevButton = document.getElementById(prevId);

  const paginationLimit = 16;
  const pageCount = Math.ceil(listItems.length / paginationLimit);
  let currentPage = 1;

  const disableButton = (button) => {
    if (button) {
      button.classList.add("disabled");
      button.setAttribute("disabled", true);
    }
  };

  const enableButton = (button) => {
    if (button) {
      button.classList.remove("disabled");
      button.removeAttribute("disabled");
    }
  };

  const handlePageButtonsStatus = () => {
    if (currentPage === 1) {
      disableButton(prevButton);
    } else {
      enableButton(prevButton);
    }

    if (pageCount === currentPage) {
      disableButton(nextButton);
    } else {
      enableButton(nextButton);
    }
  };

  const handleActivePageNumber = () => {
    paginationNumbers.querySelectorAll(".pagination-number").forEach((button) => {
      button.classList.remove("active");
      const pageIndex = Number(button.getAttribute("page-index"));
      if (pageIndex == currentPage) {
        button.classList.add("active");
      }
    });
  };

  const getPaginationNumbers = () => {
    paginationNumbers.innerHTML = "";
    var items = typeof getPaginationItems === "function" ? getPaginationItems(pageCount, currentPage) : [];
    items.forEach(function (item) {
      if (item.type === "ellipsis") {
        var span = document.createElement("span");
        span.className = "pagination-ellipsis";
        span.innerHTML = "…";
        span.setAttribute("aria-hidden", "true");
        paginationNumbers.appendChild(span);
      } else {
        var btn = document.createElement("button");
        btn.className = "pagination-number";
        btn.innerHTML = item.value;
        btn.setAttribute("page-index", item.value);
        btn.setAttribute("aria-label", "Page " + item.value);
        paginationNumbers.appendChild(btn);
      }
    });
  };

  const setCurrentPage = (pageNum) => {
    currentPage = pageNum;
    getPaginationNumbers();
    handleActivePageNumber();
    handlePageButtonsStatus();

    const prevRange = (pageNum - 1) * paginationLimit;
    const currRange = pageNum * paginationLimit;

    listItems.forEach((item, index) => {
      item.classList.add("hidden");
      if (index >= prevRange && index < currRange) {
        item.classList.remove("hidden");
      }
    });

    // Prevenir scroll no deseado - scroll suave al inicio del contenedor
    const container = paginatedList.closest('.stock-container');
    if (container) {
      // Solo hacer scroll si no estamos en la primera página y el contenedor es visible
      if (pageNum > 1 && container.style.display !== 'none') {
        setTimeout(() => {
          const firstVisibleItem = paginatedList.querySelector('li:not(.hidden)');
          if (firstVisibleItem) {
            firstVisibleItem.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 50);
      } else if (pageNum === 1) {
        // En la primera página, asegurar que no hay scroll extra
        setTimeout(() => {
          container.scrollTop = 0;
        }, 50);
      }
    }
  };

  // Inicializar
  getPaginationNumbers();
  setCurrentPage(1);

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      setCurrentPage(currentPage - 1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      setCurrentPage(currentPage + 1);
    });
  }

  paginationNumbers.addEventListener("click", (e) => {
    if (e.target.classList.contains("pagination-number")) {
      const pageIndex = Number(e.target.getAttribute("page-index"));
      if (pageIndex) {
        setCurrentPage(pageIndex);
      }
    }
  });
}

// Inicializar ambas paginaciones
window.addEventListener("load", () => {
  initPagination("paginated-list", "pagination-numbers-local", "prev-button-local", "next-button-local");
  initPagination("paginated-list-2", "pagination-numbers-global", "prev-button-global", "next-button-global");
});

var simulateClick = function (elem) {
	// Create our event (with options)
	var evt = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
		view: window
	});
	var canceled = !elem.dispatchEvent(evt);
};
setTimeout(() => {
  var someLink = document.querySelector('#button-local');
  simulateClick(someLink);
}, "100");
