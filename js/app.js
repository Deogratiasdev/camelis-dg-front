// Animation fluide pour la landing page
document.addEventListener('DOMContentLoaded', () => {
    // Animation au scroll pour les elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observer les elements a animer
    document.querySelectorAll('.stat-item, .hero-title, .hero-subtitle').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Animation compteur
    const animateCounter = (el, target) => {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = target === 99.9 ? '99.9%' : target;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current) + (target === 99.9 ? '' : '');
            }
        }, 20);
    };

    // Lancer les compteurs quand visibles
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numberEl = entry.target.querySelector('.stat-number');
                const text = numberEl.textContent;
                if (text === '99.9%') animateCounter(numberEl, 99.9);
                else if (text === '4') animateCounter(numberEl, 4);
                else if (text === '0') numberEl.textContent = '0';
                statsObserver.unobserve(entry.target);
            }
        });
    });

    document.querySelectorAll('.stat-item').forEach(stat => {
        statsObserver.observe(stat);
    });
});

// Classe pour animation
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);
