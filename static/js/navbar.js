function closeMenu() {
  const el = document.querySelector("#m-menu");
  el.classList.remove("active");
  setTimeout(() => {
      el.classList.add("display-none");
  }, "1000");
}

function openMenu() {
  const el = document.querySelector("#m-menu");
  el.classList.remove("display-none");
  const copilotButton = document.querySelector('#copilot-section .menu-mobile-section-title');
  if (copilotButton) {
    copilotButton.setAttribute('aria-expanded', 'true');
  }
  setTimeout(() => {
      el.classList.add("active");
  }, "10");
}

// Cerrar menú al hacer click fuera
document.addEventListener('DOMContentLoaded', function() {
  const menu = document.querySelector("#m-menu");

  if (menu) {
    menu.addEventListener('click', function(e) {
      // Si el click es en el overlay (fondo), cerrar el menú
      if (e.target === menu) {
        closeMenu();
      }
    });
  }
});

// Toggle productos menu
function toggleProductsMenu() {
  const button = document.querySelector('#productos-section .menu-mobile-section-title');
  if (button) {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !isExpanded);
  }
}

// Toggle Copilot menu
function toggleCopilotMenu() {
  const button = document.querySelector('#copilot-section .menu-mobile-section-title');
  if (button) {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !isExpanded);
  }
}
