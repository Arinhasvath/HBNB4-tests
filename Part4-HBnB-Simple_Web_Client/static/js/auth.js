document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
    setupLoginForm();
});

function checkAuthStatus() {
    const token = getCookie(API_CONFIG.COOKIE_NAME);
    const loginLink = document.getElementById('login-link');
    const logoutButton = document.getElementById('logout-button');

    if (token) {
        if (loginLink) loginLink.style.display = 'none';
        if (logoutButton) logoutButton.style.display = 'inline-block';
    } else {
        if (loginLink) loginLink.style.display = 'inline-block';
        if (logoutButton) logoutButton.style.display = 'none';
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    }
}

function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            setCookie(API_CONFIG.COOKIE_NAME, data.token, API_CONFIG.COOKIE_EXPIRE_DAYS);
            window.location.href = 'index.html';
        } else {
            errorMessage.textContent = data.error || 'Email ou mot de passe incorrect';
        }
    } catch (error) {
        errorMessage.textContent = 'Erreur de connexion au serveur';
    }
}

function handleLogout() {
    deleteCookie(API_CONFIG.COOKIE_NAME);
    window.location.href = 'login.html';
}