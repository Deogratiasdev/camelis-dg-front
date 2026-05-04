// ========================================
// FONCTIONS COMMUNES - SecureAuth
// ========================================

const API_BASE = 'https://camelis-dg-back.onrender.com';

// Fonction pour obtenir les informations utilisateur
function getUserInfo() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token) {
        window.location.href = 'login.html';
        return null;
    }
    
    return { token, user };
}

// Fonction pour afficher le nom complet de l'utilisateur
function displayUserName() {
    const { user } = getUserInfo();
    if (!user) return;
    
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    const fullName = (firstName && lastName) ? `${firstName} ${lastName}` : firstName || lastName || 'Utilisateur';
    
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

// Fonction pour calculer le score de sécurité
function calculateSecurityScore(user) {
    let score = 50; // Score de base
    
    if (user.email && user.email.includes('@')) score += 25;
    if (user.first_name && user.last_name) score += 25;
    
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
