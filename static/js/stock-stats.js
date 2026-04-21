// Stock Stats Counter Animation
document.addEventListener('DOMContentLoaded', function() {
    const statValues = document.querySelectorAll('.stat-value[data-count]');

    const animateCounter = (element, target) => {
      // If target is 0, show it immediately
      if (target === 0) {
        element.textContent = '0';
        return;
      }

      const duration = 2000; // 2 seconds
      const start = 0;
      const increment = target / (duration / 16); // 60fps
      let current = start;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          element.textContent = Math.floor(current).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target.toLocaleString();
        }
      };

      updateCounter();
    };

    // Intersection Observer para animar cuando se vea el widget
    const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statCard = entry.target.closest('.stat-card');
          if (statCard && !statCard.classList.contains('animated')) {
            statCard.classList.add('animated');
            const statValue = statCard.querySelector('.stat-value[data-count]');
            if (statValue) {
              const target = parseInt(statValue.getAttribute('data-count'), 10);
              if (!isNaN(target) && target >= 0) {
                animateCounter(statValue, target);
              } else {
                statValue.textContent = '0';
              }
            }
          }
        }
      });
    }, observerOptions);

    // Observar cada stat card
    statValues.forEach(statValue => {
      const statCard = statValue.closest('.stat-card');
      if (statCard) {
        observer.observe(statCard);
      }
    });

    // Si ya está visible, animar inmediatamente
    statValues.forEach(statValue => {
      const statCard = statValue.closest('.stat-card');
      if (statCard) {
        const rect = statCard.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible && !statCard.classList.contains('animated')) {
          statCard.classList.add('animated');
          const target = parseInt(statValue.getAttribute('data-count'), 10);
          if (!isNaN(target) && target >= 0) {
            setTimeout(() => {
              animateCounter(statValue, target);
            }, 300);
          } else {
            statValue.textContent = '0';
          }
        }
      }
    });
  });
