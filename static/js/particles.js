document.addEventListener('DOMContentLoaded', function() {
    const particlesContainer = document.getElementById('floating-particles');

    if (!particlesContainer) {
        return;
    }

    // Reducir partículas en mobile (50% menos)
    const isMobile = window.innerWidth <= 767;
    const particleCount = isMobile ? 40 : 80;

    function createParticles() {
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const animationDelay = Math.random() * 5;
            const animationDuration = 15 + Math.random() * 10;
            const opacity = 0.2 + Math.random() * 0.3;

            particle.style.left = left + '%';
            particle.style.top = top + '%';
            particle.style.animationDelay = animationDelay + 's';
            particle.style.animationDuration = animationDuration + 's';
            particle.style.opacity = opacity;

            particlesContainer.appendChild(particle);
        }
    }

    createParticles();
});
