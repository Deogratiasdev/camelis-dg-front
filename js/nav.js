// ========================================
// NAVIGATION RESPONSIVE - SecureAuth
// ========================================

// Injecter la navigation dans toutes les pages
function injectNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    const desktopNavItems = [
        { id: 'dashboard', href: 'dashboard.html', icon: 'fa-chart-line', label: 'Dashboard' },
        { id: 'logs', href: 'auth-logs.html', icon: 'fa-clock-rotate-left', label: 'Logs' },
        { id: 'ai', href: 'ai-analysis.html', icon: 'fa-brain', label: 'Analyse IA' },
        { id: 'profile', href: 'profile.html', icon: 'fa-user', label: 'Profil' }
    ];

    const mobileNavItems = [
        { id: 'dashboard', href: 'dashboard.html', icon: 'fa-chart-line', label: 'Dashboard' },
        { id: 'logs', href: 'auth-logs.html', icon: 'fa-clock-rotate-left', label: 'Logs' },
        { id: 'ai', href: 'ai-analysis.html', icon: 'fa-brain', label: 'Analyse IA' },
        { id: 'profile', href: 'profile.html', icon: 'fa-user', label: 'Profil' }
    ];
    
    // Déterminer la page active
    const activeIdDesktop = desktopNavItems.find(item => currentPage.includes(item.href.replace('.html', '')))?.id || '';
    const activeIdMobile = mobileNavItems.find(item => currentPage.includes(item.href.replace('.html', '')))?.id || '';
    
    // Navigation desktop (top)
    const desktopNav = document.createElement('nav');
    desktopNav.className = 'nav-desktop';
    desktopNav.innerHTML = `
        <div class="nav-container">
            <a href="dashboard.html" class="nav-brand">
                <i class="fa-solid fa-shield-halved"></i>
                <span>Security Web</span>
            </a>
            <div class="nav-links">
                ${desktopNavItems.map(item => `
                    <a href="${item.href}" class="nav-link ${activeIdDesktop === item.id ? 'active' : ''}">
                        <i class="fa-solid ${item.icon}"></i>
                        <span>${item.label}</span>
                    </a>
                `).join('')}
            </div>
            <button class="nav-logout" onclick="logout()" title="Déconnexion">
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
        </div>
    `;
    
    // Navigation mobile (bottom)
    const mobileNav = document.createElement('nav');
    mobileNav.className = 'nav-mobile';
    mobileNav.innerHTML = `
        ${mobileNavItems.map(item => `
            <a href="${item.href}" class="nav-item ${activeIdMobile === item.id ? 'active' : ''}">
                <i class="fa-solid ${item.icon}"></i>
                <span>${item.label}</span>
            </a>
        `).join('')}
        <button class="nav-item" onclick="logout()">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Déco</span>
        </button>
    `;
    
    // Insérer au début du body
    document.body.insertBefore(desktopNav, document.body.firstChild);
    document.body.appendChild(mobileNav);
    
    // Ajouter le padding nécessaire au body
    document.body.classList.add('has-nav');
}

// Fonction logout globale
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Initialiser la navigation au chargement
document.addEventListener('DOMContentLoaded', injectNavigation);
