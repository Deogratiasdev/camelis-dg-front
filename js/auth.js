// ========================================
// AUTHENTIFICATION - SecureAuth Frontend
// ========================================

const API_BASE = 'https://camelis-dg-back.onrender.com';

// Stockage temporaire pour inscription
let registerData = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
};

// ========================================
// STEPS INSCRIPTION
// ========================================
function nextStep(step) {
    // Validation step 1
    if (step === 2) {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        if (!firstName || !lastName) {
            showError('Veuillez remplir tous les champs');
            return;
        }
        registerData.firstName = firstName;
        registerData.lastName = lastName;
    }
    
    // Validation step 2
    if (step === 3) {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        if (!email || !password) {
            showError('Veuillez remplir tous les champs');
            return;
        }
        if (password.length < 8) {
            showError('Le mot de passe doit faire 8 caracteres minimum');
            return;
        }
        registerData.email = email;
        registerData.password = password;
        
        // Envoyer OTP
        requestOTP(email);
    }
    
    // Afficher le step
    document.querySelectorAll('.form-step').forEach(s => s.style.display = 'none');
    document.getElementById('step' + step).style.display = 'block';
    
    // Update indicators
    document.querySelectorAll('.step').forEach((ind, i) => {
        if (i + 1 < step) {
            ind.classList.add('completed');
            ind.classList.remove('active');
        } else if (i + 1 === step) {
            ind.classList.add('active');
        }
    });
}

// ========================================
// API CALLS
// ========================================
async function requestOTP(email) {
    try {
        const response = await fetch(`${API_BASE}/auth/request-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        if (!response.ok) {
            throw new Error('Erreur envoi OTP');
        }
        
        const data = await response.json();
        console.log('OTP envoye (test):', data.otp_for_testing);
        
    } catch (error) {
        showError('Erreur lors de l\'envoi du code OTP');
    }
}

async function register(otpCode) {
    try {
        // 1. Inscription
        const regResponse = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: registerData.email,
                password: registerData.password,
                first_name: registerData.firstName,
                last_name: registerData.lastName
            })
        });
        
        if (!regResponse.ok) {
            const error = await regResponse.json();
            throw new Error(error.detail || 'Erreur inscription');
        }
        
        // 2. Verification OTP
        const verifyResponse = await fetch(`${API_BASE}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: registerData.email,
                code: otpCode
            })
        });
        
        if (!verifyResponse.ok) {
            throw new Error('Code OTP invalide');
        }
        
        showSuccess('Compte cree avec succes ! Redirection...');
        
        // Redirection vers login
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        
    } catch (error) {
        showError(error.message);
    }
}

async function login(email, password) {
    const btn = document.getElementById('loginBtn');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Connexion...';
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            const error = await response.json();
            // Si compte non vérifié (403), rediriger vers OTP verify
            if (response.status === 403) {
                localStorage.setItem('pendingEmail', email);
                window.location.href = 'otp-verify.html?unverified=true';
                return;
            }
            throw new Error(error.detail || 'Identifiants incorrects');
        }
        
        const data = await response.json();
        
        // Sauvegarder token et infos utilisateur
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
            id: data.user_id,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            group: data.group || 'Utilisateur'
        }));
        
        showSuccess('Connexion reussie !');
        
        // Redirection vers dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } catch (error) {
        showError(error.message);
        btn.disabled = false;
        btn.innerHTML = 'Se connecter';
    }
}

// ========================================
// EVENT LISTENERS
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Formulaire inscription
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const otpCode = document.getElementById('otpCode').value;
            if (otpCode.length === 6) {
                register(otpCode);
            } else {
                showError('Veuillez entrer un code OTP valide (6 chiffres)');
            }
        });
    }
    
    // Formulaire login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            login(email, password);
        });
    }
});

// ========================================
// UTILS
// ========================================
function showError(message) {
    const errorDiv = document.getElementById('loginError');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    } else {
        alert(message);
    }
}

function showSuccess(message) {
    const form = document.querySelector('.auth-form') || 
                 document.querySelector('.auth-form-compact') || 
                 document.querySelector('#loginForm') ||
                 document.querySelector('#registerForm');
    
    if (!form) {
        alert(message);
        return;
    }
    
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success';
    successDiv.textContent = message;
    successDiv.style.cssText = 'background:var(--green);color:#fff;padding:1rem;border-radius:var(--radius);margin-bottom:1rem;text-align:center;animation:slideUp 0.3s ease;';
    form.insertBefore(successDiv, form.firstChild);
    
    setTimeout(() => successDiv.remove(), 5000);
}

// Check si deja connecte
const token = localStorage.getItem('token');
if (token && window.location.pathname.includes('login')) {
    window.location.href = 'dashboard.html';
}
