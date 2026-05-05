// ========================================
// FONCTIONS COMMUNES - SecureAuth
// ========================================

const API_BASE = 'https://camelis-dg-back.onrender.com';

// Fonction pour obtenir les informations utilisateur
function getUserInfo() {
    const token = localStorage.getItem('token');
    const user = normalizeUser(JSON.parse(localStorage.getItem('user') || '{}'));
    
    if (!token) {
        window.location.href = 'login.html';
        return null;
    }
    
    return { token, user };
}

function normalizeUser(user = {}) {
    return {
        ...user,
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        group: user.group || 'Utilisateur',
        created_at: user.created_at || '',
        is_verified: Boolean(user.is_verified)
    };
}

function getFullName(user = {}) {
    const normalized = normalizeUser(user);
    return (normalized.first_name && normalized.last_name)
        ? `${normalized.first_name} ${normalized.last_name}`
        : normalized.first_name || normalized.last_name || 'Utilisateur';
}

function getUserInitials(user = {}) {
    const normalized = normalizeUser(user);
    return ((normalized.first_name[0] || '') + (normalized.last_name[0] || '')).toUpperCase() || 'U';
}

async function hydrateUserProfile() {
    const info = getUserInfo();
    if (!info) return null;

    try {
        const response = await fetch(`${API_BASE}/auth/my-security?include_logs=false&logs_limit=0`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${info.token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) return info;

        const data = await response.json();
        if (data.profile) {
            const merged = normalizeUser({ ...info.user, ...data.profile });
            localStorage.setItem('user', JSON.stringify(merged));
            return { token: info.token, user: merged, profile: data.profile, security: data.security, activity: data.activity };
        }
    } catch {
        return info;
    }

    return info;
}

// Fonction pour afficher le nom complet de l'utilisateur
function displayUserName() {
    const { user } = getUserInfo();
    if (!user) return;
    
    const fullName = getFullName(user);
    
    const userNameElements = document.querySelectorAll('#userName');
    userNameElements.forEach(element => {
        element.textContent = fullName;
    });
}

// Fonction pour afficher l'email (masqué sur mobile)
function displayUserEmail() {
    const { user } = getUserInfo();
    if (!user) return;
    
    const userEmailElements = document.querySelectorAll('#userEmail, #navUserEmail');
    userEmailElements.forEach(element => {
        element.textContent = user.email || '';
    });
}

function displayUserGroup() {
    const { user } = getUserInfo();
    if (!user) return;

    const userGroupElements = document.querySelectorAll('#userGroup, #sidebarGroup');
    userGroupElements.forEach(element => {
        element.textContent = user.group || 'Utilisateur';
    });
}

// Fonction pour calculer le score de sécurité
function calculateSecurityScore(user) {
    const normalized = normalizeUser(user);
    let score = 50; // Score de base
    
    if (normalized.email && normalized.email.includes('@')) score += 25;
    if (normalized.first_name && normalized.last_name) score += 25;
    
    return score;
}

// Fonction pour afficher le score de sécurité
function displaySecurityScore() {
    const { user } = getUserInfo();
    if (!user) return;
    
    const score = calculateSecurityScore(user);
    const scoreElements = document.querySelectorAll('#securityScore');
    scoreElements.forEach(element => {
        element.textContent = score;
    });
}

// Fonction de déconnexion
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Fonction d'initialisation commune
function initializePage() {
    displayUserName();
    displayUserEmail();
    displayUserGroup();
    displaySecurityScore();
}

// Parser JWT
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
    } catch {
        return {};
    }
}
