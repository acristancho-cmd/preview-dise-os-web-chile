function initBlogPagination() {
  const paginationNumbers = document.getElementById("pagination-numbers-blog");
  const paginatedList = document.getElementById("blog-paginated-list");
  const paginationContainer = document.querySelector(".blog-list-container .pagination-container");

  if (!paginationNumbers || !paginatedList || !paginationContainer) {
    console.warn("Blog pagination: Elements not found", {
      paginationNumbers: !!paginationNumbers,
      paginatedList: !!paginatedList,
      paginationContainer: !!paginationContainer
    });
    return;
  }

  const listItems = paginatedList.querySelectorAll(".items");
  const nextButton = document.getElementById("next-button-blog");
  const prevButton = document.getElementById("prev-button-blog");

  const paginationLimit = 9;
  const pageCount = Math.ceil(listItems.length / paginationLimit);
  let currentPage = 1;

  paginationContainer.style.display = "flex";
  paginationContainer.style.visibility = "visible";
  paginationContainer.style.opacity = "1";

  if (listItems.length === 0) {
    paginationContainer.style.display = "none";
    return;
  }

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
        btn.setAttribute("aria-label", "Página " + item.value);
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

    const container = paginatedList.closest(".blog-list-container");
    if (container && pageNum > 1) {
      setTimeout(() => {
        const firstVisibleItem = paginatedList.querySelector(".items:not(.hidden)");
        if (firstVisibleItem) {
          firstVisibleItem.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
    } else if (container && pageNum === 1) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 50);
    }
  };

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

window.addEventListener("load", () => {
  initBlogPagination();
});
