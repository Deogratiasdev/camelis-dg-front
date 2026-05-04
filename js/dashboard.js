// ========================================
// DASHBOARD - SecureAuth
// ========================================

const API_BASE = 'http://localhost:8000';

// Verifier authentification
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

if (!token) {
    window.location.href = 'login.html';
}

// Afficher infos utilisateur
const firstName = user.first_name || '';
const lastName = user.last_name || '';
const fullName = (firstName && lastName) ? `${firstName} ${lastName}` : firstName || lastName || 'Utilisateur';
document.getElementById('userName').textContent = fullName;
document.getElementById('userEmail').textContent = user.email;

// Charger donnees securite
async function loadSecurityData() {
    try {
        const response = await fetch(`${API_BASE}/auth/my-security`, {
            method: 'GET',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                logout();
                return;
            }
            throw new Error('Erreur chargement');
        }
        
        const data = await response.json();
        
        // Calculer score de sécurité
        let securityScore = 50;
        if (user.email && user.email.includes('@')) securityScore += 25;
        if (user.first_name && user.last_name) securityScore += 25;
        
        // Mettre a jour UI
        document.getElementById('securityScore').textContent = securityScore;
        document.getElementById('alertCount').textContent = data.activity?.alerts_count || '0';
        document.getElementById('profileStatus').textContent = (user.first_name && user.last_name) ? '✓' : '!';
        document.getElementById('loginCount').textContent = data.activity?.login_count || '1';
        
    } catch (error) {
        console.error('Erreur:', error);
        // Valeurs par défaut en cas d'erreur
        document.getElementById('securityScore').textContent = '50';
        document.getElementById('alertCount').textContent = '0';
        document.getElementById('profileStatus').textContent = '!';
        document.getElementById('loginCount').textContent = '1';
    }
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

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Charger au demarrage
loadSecurityData();
