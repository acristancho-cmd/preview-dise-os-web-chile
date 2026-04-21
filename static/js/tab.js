function tabAction(actionName) {
  var section;
  var container = document.getElementsByClassName("stock-container");
  for (section = 0; section < container.length; section++) {
    container[section].style.display = "none";
  }
  document.getElementById(actionName).style.display = "flex";

  // Actualizar clases activas
  var localButton = document.getElementById("button-local");
  var globalButton = document.getElementById("button-global");
  var tabIndicator = document.querySelector(".tab-indicator");

  if(actionName=="local"){
      localButton.classList.add("active");
      globalButton.classList.remove("active");
      if (tabIndicator) {
          tabIndicator.style.transform = "translateX(0)";
      }
      // Reinicializar paginación local
      if (typeof initPagination === 'function') {
          setTimeout(() => {
              initPagination("paginated-list", "pagination-numbers-local", "prev-button-local", "next-button-local");
          }, 100);
      }
  }
  if(actionName=="global"){
      globalButton.classList.add("active");
      localButton.classList.remove("active");
      if (tabIndicator) {
          tabIndicator.style.transform = "translateX(100%)";
      }
      // Reinicializar paginación global
      if (typeof initPagination === 'function') {
          setTimeout(() => {
              initPagination("paginated-list-2", "pagination-numbers-global", "prev-button-global", "next-button-global");
          }, 100);
      }
  }
}
